import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { journalArticles } from "@/lib/schema";
import { sql, lte, or, isNull, eq, and } from "drizzle-orm";
import { parseTags } from "@/lib/content";
import { resolveForView } from "@/lib/preview";
import { getBySlug } from "@/lib/content";
import ContentBody from "@/components/ContentBody";
import ShareButtons from "@/components/ShareButtons";
import RelatedPosts from "@/components/RelatedPosts";
import TagList from "@/components/TagList";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl } from "@/lib/site";
import { articleJsonLd, buildMetadata } from "@/lib/seo";

export const revalidate = 60;

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ preview?: string }>;

export async function generateStaticParams() {
  const rows = await db
    .select({ slug: journalArticles.slug })
    .from(journalArticles)
    .where(
      and(
        eq(journalArticles.status, "published"),
        or(isNull(journalArticles.publishedAt), lte(journalArticles.publishedAt, sql`(unixepoch())`))
      )
    );
  return rows.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const row = await getBySlug("journal", slug);
  if (!row) return { title: "Not found" };
  return buildMetadata({
    title: row.title,
    description: row.excerpt,
    path: `/journal/${row.slug}`,
    image: row.image || undefined,
    type: "article",
    publishedTime: row.publishedAt ?? row.createdAt,
    modifiedTime: row.updatedAt,
    tags: parseTags(row.tags),
  });
}

export default async function JournalDetail({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const row = await resolveForView("journal", slug, preview);
  if (!row) notFound();

  const tags = parseTags(row.tags);
  const url = absoluteUrl(`/journal/${row.slug}`);
  const date = (row.publishedAt ?? row.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="max-w-3xl mx-auto px-6 md:px-8 py-12">
      <JsonLd
        data={articleJsonLd({
          title: row.title,
          description: row.excerpt,
          url,
          image: row.image || undefined,
          datePublished: row.publishedAt ?? row.createdAt,
          dateModified: row.updatedAt,
          tags,
        })}
      />

      <nav className="text-xs font-mono text-outline mb-6 tracking-widest uppercase">
        <Link href="/journal" className="hover:text-white">Journal</Link>
        <span className="mx-2 text-outline-variant">/</span>
        <span>{row.date}</span>
      </nav>

      <header className="mb-10">
        <TagList tags={tags} />
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mt-4 mb-6">
          {row.title}
        </h1>
        <div className="flex items-center gap-4 text-xs font-mono text-outline uppercase tracking-widest">
          <time dateTime={(row.publishedAt ?? row.createdAt).toISOString()}>{date}</time>
          {row.readingMinutes > 0 && <span>{row.readingMinutes} min read</span>}
        </div>
      </header>

      {row.image && (
        <div className="aspect-video relative mb-12 border border-white/5 overflow-hidden">
          <Image
            src={row.image}
            alt={row.imageAlt || row.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>
      )}

      {row.excerpt && (
        <p className="text-lg text-on-surface-variant leading-relaxed mb-10 italic">
          {row.excerpt}
        </p>
      )}

      <ContentBody html={row.body} />

      <div className="border-t border-white/5 pt-8 mt-16">
        <ShareButtons url={url} title={row.title} />
      </div>

      <RelatedPosts kind="journal" excludeId={row.id} tags={tags} />
    </article>
  );
}

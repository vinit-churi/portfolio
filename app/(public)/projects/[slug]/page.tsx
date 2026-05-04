import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { projects } from "@/lib/schema";
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
import { buildMetadata, softwareJsonLd } from "@/lib/seo";

export const revalidate = 60;

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ preview?: string }>;

export async function generateStaticParams() {
  const rows = await db
    .select({ slug: projects.slug })
    .from(projects)
    .where(
      and(
        eq(projects.status, "published"),
        or(isNull(projects.publishedAt), lte(projects.publishedAt, sql`(unixepoch())`))
      )
    );
  return rows.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const row = await getBySlug("projects", slug);
  if (!row) return { title: "Not found" };
  return buildMetadata({
    title: row.title,
    description: row.description,
    path: `/projects/${row.slug}`,
    image: row.image || undefined,
    type: "article",
    publishedTime: row.publishedAt ?? row.createdAt,
    modifiedTime: row.updatedAt,
    tags: parseTags(row.tags),
  });
}

export default async function ProjectDetail({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const row = await resolveForView("projects", slug, preview);
  if (!row) notFound();

  const tags = parseTags(row.tags);
  const url = absoluteUrl(`/projects/${row.slug}`);

  return (
    <article className="max-w-3xl mx-auto px-6 md:px-8 py-12">
      <JsonLd
        data={softwareJsonLd({
          title: row.title,
          description: row.description,
          url,
          image: row.image || undefined,
          codeRepository: row.githubUrl,
        })}
      />

      <nav className="text-xs font-mono text-outline mb-6 tracking-widest uppercase">
        <Link href="/projects" className="hover:text-white">Projects</Link>
      </nav>

      <header className="mb-10">
        <TagList tags={tags} />
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mt-4 mb-4">
          {row.title}
        </h1>
        <p className="text-lg text-on-surface-variant leading-relaxed">
          {row.description}
        </p>
        <div className="flex flex-wrap gap-3 mt-6">
          {row.githubUrl && (
            <a
              href={row.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono uppercase tracking-widest border border-white/10 px-3 py-1.5 text-outline hover:text-white hover:border-white/20 transition-colors"
            >
              GitHub →
            </a>
          )}
          {row.url && (
            <a
              href={row.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono uppercase tracking-widest bg-primary text-on-primary px-3 py-1.5 hover:opacity-90 transition-opacity"
            >
              Live →
            </a>
          )}
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

      <ContentBody html={row.body} />

      <div className="border-t border-white/5 pt-8 mt-16">
        <ShareButtons url={url} title={row.title} />
      </div>

      <RelatedPosts kind="projects" excludeId={row.id} tags={tags} />
    </article>
  );
}

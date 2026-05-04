import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { listPublished, countPublished, parseTags } from "@/lib/content";
import TagList from "@/components/TagList";
import Pagination from "@/components/Pagination";
import EmptyState from "@/components/EmptyState";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";
export const revalidate = 60;

const PAGE_SIZE = 12;

export const metadata: Metadata = buildMetadata({
  title: "Journal",
  description: "Notes, essays, and findings from the field.",
  path: "/journal",
});

type SearchParams = Promise<{ page?: string }>;

export default async function JournalIndex({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const [items, total] = await Promise.all([
    listPublished("journal", { limit: PAGE_SIZE, offset }),
    countPublished("journal"),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <section className="max-w-7xl mx-auto px-8 py-16">
      <header className="mb-12">
        <h2 className="text-xs uppercase tracking-[0.3em] text-outline mb-2 font-bold">
          Insights
        </h2>
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Journal
        </h1>
        <p className="text-on-surface-variant mt-3 max-w-2xl">
          Notes from the field — distributed systems, performance, and the craft.
        </p>
      </header>

      {items.length === 0 ? (
        <EmptyState title="No entries yet" hint="Check back soon." />
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((article) => {
            const tags = parseTags(article.tags);
            const date = (article.publishedAt ?? article.createdAt).toLocaleDateString(
              "en-US",
              { year: "numeric", month: "short", day: "numeric" }
            );
            return (
              <li key={article.id}>
                <Link href={`/journal/${article.slug}`} className="group block">
                  <div className="aspect-video bg-surface-container overflow-hidden mb-4 border border-white/5 relative">
                    {article.image && (
                      <Image
                        src={article.image}
                        alt={article.imageAlt || article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover grayscale group-hover:scale-105 transition-transform duration-500 opacity-80"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-4 text-xs text-outline font-mono uppercase">
                      <time dateTime={(article.publishedAt ?? article.createdAt).toISOString()}>
                        {date}
                      </time>
                      {article.readingMinutes > 0 && (
                        <span>{article.readingMinutes} min</span>
                      )}
                    </div>
                    <h3 className="font-headline font-bold text-white group-hover:text-primary transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                </Link>
                {tags.length > 0 && (
                  <div className="mt-3">
                    <TagList tags={tags.slice(0, 3)} size="xs" />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <Pagination base="/journal" page={page} totalPages={totalPages} />
    </section>
  );
}

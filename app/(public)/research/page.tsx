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
  title: "Research",
  description: "Long-form research notes and explorations.",
  path: "/research",
});

type SearchParams = Promise<{ page?: string }>;

export default async function ResearchIndex({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const [items, total] = await Promise.all([
    listPublished("research", { limit: PAGE_SIZE, offset }),
    countPublished("research"),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <section className="max-w-7xl mx-auto px-8 py-16">
      <header className="mb-12">
        <h2 className="text-xs uppercase tracking-[0.3em] text-outline mb-2 font-bold">
          Thinking
        </h2>
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Research
        </h1>
        <p className="text-on-surface-variant mt-3 max-w-2xl">
          Deep dives, hypotheses, and findings worth a longer read.
        </p>
      </header>

      {items.length === 0 ? (
        <EmptyState title="No research yet" hint="Check back soon." />
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((entry) => {
            const tags = parseTags(entry.tags);
            const date = (entry.publishedAt ?? entry.createdAt).toLocaleDateString(
              "en-US",
              { year: "numeric", month: "short", day: "numeric" }
            );
            return (
              <li key={entry.id}>
                <Link href={`/research/${entry.slug}`} className="group block">
                  <div className="aspect-video bg-surface-container overflow-hidden mb-4 border border-white/5 relative">
                    {entry.image && (
                      <Image
                        src={entry.image}
                        alt={entry.imageAlt || entry.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover grayscale group-hover:scale-105 transition-transform duration-500 opacity-80"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-4 text-xs text-outline font-mono uppercase">
                      <time dateTime={(entry.publishedAt ?? entry.createdAt).toISOString()}>
                        {date}
                      </time>
                      {entry.readingMinutes > 0 && (
                        <span>{entry.readingMinutes} min</span>
                      )}
                    </div>
                    <h3 className="font-headline font-bold text-white group-hover:text-primary transition-colors leading-snug">
                      {entry.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant line-clamp-2">
                      {entry.excerpt}
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

      <Pagination base="/research" page={page} totalPages={totalPages} />
    </section>
  );
}

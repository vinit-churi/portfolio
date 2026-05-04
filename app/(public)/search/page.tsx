import type { Metadata } from "next";
import { searchAll, detailPath, parseTags, type ContentKind } from "@/lib/content";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import EmptyState from "@/components/EmptyState";
import SearchBar from "@/components/SearchBar";

export const dynamic = "force-dynamic";

const LABEL: Record<ContentKind, string> = {
  journal: "Journal",
  research: "Research",
  projects: "Project",
};

type SearchParams = Promise<{ q?: string }>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const sp = await searchParams;
  return buildMetadata({
    title: sp.q ? `Search: ${sp.q}` : "Search",
    description: "Search across journal, research, and projects.",
    path: "/search",
  });
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const results = q.length >= 2 ? await searchAll(q, 50) : [];

  return (
    <section className="max-w-4xl mx-auto px-8 py-16">
      <header className="mb-10">
        <h1 className="font-headline text-4xl font-extrabold text-white tracking-tight mb-6">
          Search
        </h1>
        <SearchBar />
      </header>

      {q.length < 2 ? (
        <p className="text-sm font-mono text-outline">Type at least two characters.</p>
      ) : results.length === 0 ? (
        <EmptyState title={`No results for "${q}"`} />
      ) : (
        <ul className="space-y-3">
          {results.map((r) => (
            <li key={`${r.kind}-${r.slug}`}>
              <Link
                href={detailPath(r.kind, r.slug)}
                className="block group border border-white/5 bg-surface-container px-5 py-4 hover:border-white/15 transition-all"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-headline font-bold text-white group-hover:text-primary transition-colors">
                    {r.title}
                  </h3>
                  <span className="text-[10px] font-mono text-outline uppercase tracking-widest shrink-0">
                    {LABEL[r.kind]}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant line-clamp-2 mt-1">
                  {r.excerpt}
                </p>
                {parseTags(r.tags).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {parseTags(r.tags).slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-1.5 py-0.5 border border-white/5 font-mono text-outline uppercase"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

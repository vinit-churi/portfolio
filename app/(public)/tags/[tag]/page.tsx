import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { listPublished, parseTags, type ContentKind } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import EmptyState from "@/components/EmptyState";

export const dynamic = "force-static";
export const revalidate = 300;

type Params = Promise<{ tag: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return buildMetadata({
    title: `#${decoded}`,
    description: `All content tagged with ${decoded}.`,
    path: `/tags/${encodeURIComponent(decoded)}`,
  });
}

const KIND_LABEL: Record<ContentKind, string> = {
  journal: "Journal",
  research: "Research",
  projects: "Projects",
};

export default async function TagPage({ params }: { params: Params }) {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  if (!tag.trim()) notFound();

  const [journal, research, projects] = await Promise.all([
    listPublished("journal", { tag, limit: 100 }),
    listPublished("research", { tag, limit: 100 }),
    listPublished("projects", { tag, limit: 100 }),
  ]);

  const total = journal.length + research.length + projects.length;

  const sections: { kind: ContentKind; rows: Array<{ id: number; slug: string; title: string; excerpt: string; tags: string }> }[] = [
    {
      kind: "journal",
      rows: journal.map((r) => ({ id: r.id, slug: r.slug, title: r.title, excerpt: r.excerpt, tags: r.tags })),
    },
    {
      kind: "research",
      rows: research.map((r) => ({ id: r.id, slug: r.slug, title: r.title, excerpt: r.excerpt, tags: r.tags })),
    },
    {
      kind: "projects",
      rows: projects.map((r) => ({ id: r.id, slug: r.slug, title: r.title, excerpt: r.description, tags: r.tags })),
    },
  ];

  return (
    <section className="max-w-5xl mx-auto px-8 py-16">
      <header className="mb-12">
        <Link
          href="/tags"
          className="text-xs font-mono text-outline hover:text-white uppercase tracking-widest"
        >
          ← All tags
        </Link>
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-white tracking-tight mt-4">
          #{tag}
        </h1>
        <p className="text-on-surface-variant mt-3 font-mono text-sm">
          {total} {total === 1 ? "entry" : "entries"}
        </p>
      </header>

      {total === 0 ? (
        <EmptyState title={`Nothing tagged "${tag}" yet`} />
      ) : (
        <div className="space-y-12">
          {sections.map(({ kind, rows }) =>
            rows.length === 0 ? null : (
              <div key={kind}>
                <h2 className="text-xs uppercase tracking-[0.3em] text-outline mb-4 font-bold">
                  {KIND_LABEL[kind]}
                </h2>
                <ul className="space-y-3">
                  {rows.map((row) => {
                    const tags = parseTags(row.tags);
                    return (
                      <li key={`${kind}-${row.id}`}>
                        <Link
                          href={`/${kind}/${row.slug}`}
                          className="block group border border-white/5 bg-surface-container px-5 py-4 hover:border-white/15 transition-all"
                        >
                          <h3 className="font-headline font-bold text-white group-hover:text-primary transition-colors">
                            {row.title}
                          </h3>
                          <p className="text-xs text-on-surface-variant line-clamp-2 mt-1">
                            {row.excerpt}
                          </p>
                          {tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {tags.slice(0, 4).map((t) => (
                                <span
                                  key={t}
                                  className={`text-[10px] px-1.5 py-0.5 font-mono uppercase border ${
                                    t === tag
                                      ? "border-primary/40 text-primary"
                                      : "border-white/5 text-outline"
                                  }`}
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )
          )}
        </div>
      )}
    </section>
  );
}

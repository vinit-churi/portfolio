import Link from "next/link";
import type { Metadata } from "next";
import { listAllTags } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import EmptyState from "@/components/EmptyState";

export const dynamic = "force-static";
export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: "Tags",
  description: "Browse content by tag.",
  path: "/tags",
});

export default async function TagsIndex() {
  const tags = await listAllTags();

  return (
    <section className="max-w-5xl mx-auto px-8 py-16">
      <header className="mb-12">
        <h2 className="text-xs uppercase tracking-[0.3em] text-outline mb-2 font-bold">
          Index
        </h2>
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Tags
        </h1>
        <p className="text-on-surface-variant mt-3">Browse all content by topic.</p>
      </header>

      {tags.length === 0 ? (
        <EmptyState title="No tags yet" />
      ) : (
        <ul className="flex flex-wrap gap-2">
          {tags.map(({ tag, count }) => (
            <li key={tag}>
              <Link
                href={`/tags/${encodeURIComponent(tag)}`}
                className="inline-flex items-center gap-2 px-3 py-2 border border-white/10 bg-surface-container hover:border-white/20 hover:text-white text-on-surface-variant text-sm font-mono uppercase tracking-widest transition-colors"
              >
                <span>{tag}</span>
                <span className="text-outline text-xs">{count}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

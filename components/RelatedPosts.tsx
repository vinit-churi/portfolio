import Link from "next/link";
import { ContentKind, detailPath, listRelated } from "@/lib/content";

export default async function RelatedPosts({
  kind,
  excludeId,
  tags,
}: {
  kind: ContentKind;
  excludeId: number;
  tags: string[];
}) {
  const items = await listRelated(kind, excludeId, tags, 3);
  if (items.length === 0) return null;

  const normalized = items.map((it) => ({
    id: it.id,
    slug: it.slug,
    title: it.title,
    desc: "excerpt" in it ? it.excerpt : it.description,
  }));

  return (
    <aside className="border-t border-white/5 pt-10 mt-16">
      <h3 className="text-xs uppercase tracking-[0.3em] text-outline mb-6 font-bold">
        Related
      </h3>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {normalized.map((it) => (
          <li key={it.id}>
            <Link
              href={detailPath(kind, it.slug)}
              className="block group border border-white/5 bg-surface-container p-5 hover:border-white/15 transition-all"
            >
              <h4 className="font-headline text-sm font-bold text-white group-hover:text-primary transition-colors leading-snug mb-2">
                {it.title}
              </h4>
              <p className="text-xs text-on-surface-variant line-clamp-3">{it.desc}</p>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

import Link from "next/link";
import { listPublished, parseTags, type ContentKind } from "@/lib/content";

type Entry = {
  kind: ContentKind;
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: Date;
  tags: string[];
  readingMinutes: number;
};

export default async function WritingSection() {
  const [journal, research] = await Promise.all([
    listPublished("journal", { limit: 6 }),
    listPublished("research", { limit: 6 }),
  ]);

  const entries: Entry[] = [
    ...journal.map((row) => ({
      kind: "journal" as const,
      id: row.id,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      date: row.publishedAt ?? row.createdAt,
      tags: parseTags(row.tags),
      readingMinutes: row.readingMinutes,
    })),
    ...research.map((row) => ({
      kind: "research" as const,
      id: row.id,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      date: row.publishedAt ?? row.createdAt,
      tags: parseTags(row.tags),
      readingMinutes: row.readingMinutes,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 8);

  if (entries.length === 0) return null;

  return (
    <section id="writing" className="bg-surface-container-lowest py-20">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-outline mb-2 font-bold">
              Writing
            </h2>
            <h3 className="font-headline text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Notes &amp; long-form
            </h3>
          </div>
          <span className="font-mono text-xs text-outline tabular-nums">
            {String(entries.length).padStart(2, "0")} / {String(journal.length + research.length).padStart(2, "0")}
          </span>
        </div>

        <ol className="border-t border-white/5">
          {entries.map((entry, index) => {
            const date = entry.date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            });
            return (
              <li key={`${entry.kind}-${entry.id}`}>
                <Link
                  href={`/${entry.kind}/${entry.slug}`}
                  className="grid grid-cols-12 gap-4 md:gap-6 py-5 border-b border-white/5 group hover:bg-white/[0.015] transition-colors -mx-2 px-2"
                >
                  <span className="hidden md:flex col-span-1 items-start pt-0.5 font-mono text-[11px] text-outline-variant tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="col-span-3 md:col-span-2 font-mono text-[11px] text-outline uppercase tracking-widest pt-0.5 tabular-nums">
                    {date}
                  </span>
                  <span className="col-span-9 md:col-span-7 flex flex-col gap-1.5 min-w-0">
                    <span className="font-headline text-[15px] md:text-base text-white group-hover:text-primary transition-colors leading-snug">
                      {entry.title}
                    </span>
                    <span className="hidden md:block text-xs text-on-surface-variant leading-relaxed line-clamp-1">
                      {entry.excerpt}
                    </span>
                  </span>
                  <span className="col-span-12 md:col-span-2 flex items-center justify-start md:justify-end gap-3 font-mono text-[11px] text-outline uppercase tracking-widest pt-0.5">
                    <span
                      className={
                        entry.kind === "research"
                          ? "text-on-surface-variant"
                          : "text-outline"
                      }
                    >
                      {entry.kind === "research" ? "Research" : "Note"}
                    </span>
                    {entry.readingMinutes > 0 && (
                      <span className="tabular-nums">{entry.readingMinutes}m</span>
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>

        <div className="flex items-center justify-between mt-8 text-xs font-mono uppercase tracking-widest">
          <Link
            href="/journal"
            className="text-outline hover:text-white transition-colors"
          >
            All notes →
          </Link>
          <Link
            href="/research"
            className="text-outline hover:text-white transition-colors"
          >
            All research →
          </Link>
        </div>
      </div>
    </section>
  );
}

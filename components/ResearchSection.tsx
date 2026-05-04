import Image from "next/image";
import Link from "next/link";
import { listPublished, parseTags } from "@/lib/content";

export default async function ResearchSection() {
  const all = await listPublished("research", { limit: 3 });
  if (all.length === 0) return null;

  return (
    <section id="research" className="max-w-7xl mx-auto px-8 py-16 bg-surface">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-xs uppercase tracking-[0.3em] text-outline mb-2 font-bold">
            Thinking
          </h2>
          <h3 className="font-headline text-3xl font-bold text-white tracking-tight">
            Research
          </h3>
        </div>
        <Link
          href="/research"
          className="text-xs font-bold uppercase tracking-widest text-primary border-b border-primary/50 pb-1 hover:border-primary transition-all"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {all.map((entry) => {
          const tags = parseTags(entry.tags);
          const date = (entry.publishedAt ?? entry.createdAt).toLocaleDateString(
            "en-US",
            { year: "numeric", month: "short", day: "numeric" }
          );
          return (
            <Link
              key={entry.id}
              href={`/research/${entry.slug}`}
              className="group block"
            >
              <article>
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
                    {tags[0] && <span>{tags[0]}</span>}
                  </div>
                  <h4 className="font-headline font-bold text-white group-hover:text-primary transition-colors leading-snug">
                    {entry.title}
                  </h4>
                  <p className="text-xs text-on-surface-variant line-clamp-2">
                    {entry.excerpt}
                  </p>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import { listPublished, parseTags } from "@/lib/content";

export default async function JournalSection() {
  const articles = await listPublished("journal", { limit: 3 });
  if (articles.length === 0) return null;

  return (
    <section id="journal" className="max-w-7xl mx-auto px-8 py-16 bg-background">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-xs uppercase tracking-[0.3em] text-outline mb-2 font-bold">
            Insights
          </h2>
          <h3 className="font-headline text-3xl font-bold text-white tracking-tight">
            Journal &amp; Research
          </h3>
        </div>
        <Link
          href="/journal"
          className="text-xs font-bold uppercase tracking-widest text-primary border-b border-primary/50 pb-1 hover:border-primary transition-all"
        >
          View All Entries
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map((article) => {
          const tags = parseTags(article.tags);
          const date = (article.publishedAt ?? article.createdAt).toLocaleDateString(
            "en-US",
            { year: "numeric", month: "short", day: "numeric" }
          );
          return (
            <Link
              key={article.id}
              href={`/journal/${article.slug}`}
              className="group block"
            >
              <article>
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
                    {tags[0] && <span>{tags[0]}</span>}
                  </div>
                  <h4 className="font-headline font-bold text-white group-hover:text-primary transition-colors leading-snug">
                    {article.title}
                  </h4>
                  <p className="text-xs text-on-surface-variant line-clamp-2">
                    {article.excerpt}
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

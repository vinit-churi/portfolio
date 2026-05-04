import Image from "next/image";
import { db } from "@/lib/db";
import { research } from "@/lib/schema";
import { asc, eq } from "drizzle-orm";

export default async function ResearchSection() {
  const all = await db
    .select()
    .from(research)
    .where(eq(research.published, true))
    .orderBy(asc(research.sortOrder));

  if (all.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-8 py-16 bg-surface">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-xs uppercase tracking-[0.3em] text-outline mb-2 font-bold">
            Thinking
          </h2>
          <h3 className="font-headline text-3xl font-bold text-white tracking-tight">
            Research
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {all.map((entry) => (
          <article key={entry.id} className="group">
            <div className="aspect-video bg-surface-container overflow-hidden mb-4 border border-white/5 relative">
              {entry.image && (
                <Image
                  src={entry.image}
                  alt={entry.imageAlt}
                  fill
                  className="object-cover grayscale group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
              )}
            </div>
            <div className="space-y-2">
              <div className="flex gap-4 text-xs text-outline font-mono uppercase">
                <span>{entry.date}</span>
                <span>{entry.tag}</span>
              </div>
              <h4 className="font-headline font-bold text-white group-hover:text-primary transition-colors leading-snug">
                {entry.title}
              </h4>
              <p className="text-xs text-on-surface-variant line-clamp-2">
                {entry.excerpt}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

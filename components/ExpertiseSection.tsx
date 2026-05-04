import { db } from "@/lib/db";
import { expertiseItems } from "@/lib/schema";
import { asc } from "drizzle-orm";

export default async function ExpertiseSection() {
  const items = await db
    .select()
    .from(expertiseItems)
    .orderBy(asc(expertiseItems.sortOrder));

  return (
    <section id="expertise" className="bg-surface-container-lowest py-16">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-xs uppercase tracking-[0.3em] text-outline mb-2 font-bold">
              Expertise
            </h2>
            <h3 className="font-headline text-3xl font-bold text-white tracking-tight">
              Technical Verticals
            </h3>
          </div>
          <span className="font-mono text-xs text-outline/40 tabular-nums">
            {String(items.length).padStart(2, "0")} domains
          </span>
        </div>

        <div className="border-t border-white/5">
          {items.map((item, index) => {
            const tags: string[] = JSON.parse(item.tags);
            return (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-4 md:gap-6 py-6 border-b border-white/5 group hover:bg-white/[0.015] transition-colors -mx-2 px-2"
              >
                {/* Index */}
                <div className="hidden md:flex col-span-1 items-start pt-0.5">
                  <span className="font-mono text-xs text-outline/30 tabular-nums select-none">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Icon */}
                <div className="col-span-1 md:col-span-1 flex items-start pt-0.5">
                  <span
                    className="material-symbols-outlined text-primary transition-transform duration-300 group-hover:scale-110"
                    style={{ fontSize: "16px" }}
                  >
                    {item.icon}
                  </span>
                </div>

                {/* Title */}
                <div className="col-span-11 md:col-span-3 flex items-start">
                  <h4 className="font-headline font-bold text-white text-sm md:text-base group-hover:text-primary transition-colors leading-tight">
                    {item.title}
                  </h4>
                </div>

                {/* Description */}
                <div className="col-span-12 md:col-span-5 flex items-start -mt-3 md:mt-0 pl-6 md:pl-0">
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="col-span-12 md:col-span-2 flex flex-wrap gap-1.5 items-start justify-start md:justify-end pl-6 md:pl-0 -mt-2 md:mt-0">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono px-2 py-0.5 bg-surface-container-highest border border-white/5 uppercase tracking-wide"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

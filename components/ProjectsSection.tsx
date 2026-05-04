import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { listPublished, parseTags } from "@/lib/content";

export default async function ProjectsSection() {
  const all = await listPublished("projects", { limit: 4 });
  if (all.length === 0) return null;

  const [primary, ...rest] = all;
  const primaryTags = parseTags(primary.tags);

  return (
    <section id="work" className="bg-background py-20">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-outline mb-2 font-bold">
              Built
            </h2>
            <h3 className="font-headline text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Projects
            </h3>
          </div>
          <Link
            href="/projects"
            className="text-[11px] font-mono uppercase tracking-widest text-outline hover:text-white transition-colors"
          >
            All projects →
          </Link>
        </div>

        <Link
          href={`/projects/${primary.slug}`}
          className="group grid grid-cols-1 md:grid-cols-12 gap-8 border-t border-white/5 pt-10 mb-12"
        >
          <div className="md:col-span-7 relative aspect-[16/10] bg-surface-container-low overflow-hidden">
            {primary.image ? (
              <Image
                src={primary.image}
                alt={primary.imageAlt || primary.title}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover grayscale opacity-70 group-hover:opacity-95 transition-opacity duration-500"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center">
                <span className="font-mono text-[10px] uppercase tracking-widest text-outline-variant">
                  no preview
                </span>
              </div>
            )}
          </div>

          <div className="md:col-span-5 flex flex-col gap-4 justify-end">
            <span className="font-mono text-[11px] text-outline uppercase tracking-widest">
              Latest · #{String(primary.id).padStart(3, "0")}
            </span>
            <h4 className="font-headline text-2xl md:text-3xl font-extrabold text-white group-hover:text-primary transition-colors leading-[1.05] tracking-tight">
              {primary.title}
            </h4>
            <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-3">
              {primary.description}
            </p>
            {primaryTags.length > 0 && (
              <ul className="flex flex-wrap gap-1.5">
                {primaryTags.map((t) => (
                  <li
                    key={t}
                    className="text-[10px] font-mono px-2 py-0.5 border border-white/10 text-on-surface-variant uppercase tracking-wide"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            )}
            <span className="font-mono text-[11px] text-outline group-hover:text-primary transition-colors uppercase tracking-widest inline-flex items-center gap-1.5 mt-2">
              Read details <ArrowUpRight size={12} />
            </span>
          </div>
        </Link>

        {rest.length > 0 && (
          <ol className="border-t border-white/5">
            {rest.map((project, idx) => {
              const tags = parseTags(project.tags);
              return (
                <li key={project.id}>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="grid grid-cols-12 gap-4 md:gap-6 py-5 border-b border-white/5 group hover:bg-white/[0.015] transition-colors -mx-2 px-2"
                  >
                    <span className="hidden md:block col-span-1 font-mono text-[11px] text-outline-variant tabular-nums pt-1">
                      {String(idx + 2).padStart(2, "0")}
                    </span>
                    <span className="col-span-12 md:col-span-4 font-headline text-base font-bold text-white group-hover:text-primary transition-colors leading-snug">
                      {project.title}
                    </span>
                    <span className="col-span-12 md:col-span-5 text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                      {project.description}
                    </span>
                    <span className="col-span-12 md:col-span-2 flex flex-wrap gap-1.5 md:justify-end items-start">
                      {tags.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono px-1.5 py-0.5 border border-white/10 text-outline uppercase tracking-wide"
                        >
                          {t}
                        </span>
                      ))}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}

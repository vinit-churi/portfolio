import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { listPublished, countPublished, parseTags } from "@/lib/content";
import TagList from "@/components/TagList";
import Pagination from "@/components/Pagination";
import EmptyState from "@/components/EmptyState";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";
export const revalidate = 60;

const PAGE_SIZE = 12;

export const metadata: Metadata = buildMetadata({
  title: "Projects",
  description: "Selected work, side projects, and open source.",
  path: "/projects",
});

type SearchParams = Promise<{ page?: string }>;

export default async function ProjectsIndex({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const [items, total] = await Promise.all([
    listPublished("projects", { limit: PAGE_SIZE, offset }),
    countPublished("projects"),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <section className="max-w-7xl mx-auto px-8 py-16">
      <header className="mb-12 flex items-end justify-between gap-6 flex-wrap">
        <div>
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-outline mb-2 font-bold">
            Built
          </h2>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Projects
          </h1>
        </div>
        <span className="font-mono text-[11px] text-outline tabular-nums uppercase tracking-widest">
          {String(total).padStart(3, "0")} shipped
        </span>
      </header>

      {items.length === 0 ? (
        <EmptyState title="No projects yet" hint="Check back soon." />
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((project) => {
            const tags = parseTags(project.tags);
            return (
              <li
                key={project.id}
                className="group border border-white/5 bg-surface-container p-6 hover:border-white/10 transition-all"
              >
                {project.image && (
                  <Link href={`/projects/${project.slug}`} className="block">
                    <div className="aspect-video bg-surface overflow-hidden mb-6 relative">
                      <Image
                        src={project.image}
                        alt={project.imageAlt || project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover grayscale opacity-60 group-hover:scale-105 group-hover:opacity-90 transition-all duration-500"
                      />
                    </div>
                  </Link>
                )}
                <TagList tags={tags} size="xs" />
                <Link href={`/projects/${project.slug}`} className="block mt-3">
                  <h3 className="font-headline font-bold text-white text-lg group-hover:text-primary transition-colors mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed mb-4 line-clamp-3">
                    {project.description}
                  </p>
                </Link>
                <div className="flex gap-4">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="text-xs font-mono text-outline hover:text-primary transition-colors uppercase tracking-widest"
                  >
                    Details →
                  </Link>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-outline hover:text-primary transition-colors uppercase tracking-widest"
                    >
                      GitHub
                    </a>
                  )}
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-outline hover:text-primary transition-colors uppercase tracking-widest"
                    >
                      Live
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Pagination base="/projects" page={page} totalPages={totalPages} />
    </section>
  );
}

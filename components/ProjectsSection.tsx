import Image from "next/image";
import Link from "next/link";
import { listPublished, parseTags } from "@/lib/content";

export default async function ProjectsSection() {
  const all = await listPublished("projects", { limit: 4 });
  if (all.length === 0) return null;

  return (
    <section id="work" className="max-w-7xl mx-auto px-8 py-16 bg-background">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-xs uppercase tracking-[0.3em] text-outline mb-2 font-bold">
            Work
          </h2>
          <h3 className="font-headline text-3xl font-bold text-white tracking-tight">
            Projects
          </h3>
        </div>
        <Link
          href="/projects"
          className="text-xs font-bold uppercase tracking-widest text-primary border-b border-primary/50 pb-1 hover:border-primary transition-all"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {all.map((project) => {
          const tags = parseTags(project.tags);
          return (
            <div
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
                      className="object-cover grayscale opacity-60 group-hover:scale-105 group-hover:opacity-90 transition-all duration-700"
                    />
                  </div>
                </Link>
              )}
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-surface-container-highest border border-white/5 uppercase font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link href={`/projects/${project.slug}`} className="block">
                <h4 className="font-headline font-bold text-white text-lg group-hover:text-primary transition-colors mb-2">
                  {project.title}
                </h4>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
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
            </div>
          );
        })}
      </div>
    </section>
  );
}

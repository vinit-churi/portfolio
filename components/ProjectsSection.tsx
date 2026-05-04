import Image from "next/image";
import { db } from "@/lib/db";
import { projects } from "@/lib/schema";
import { asc, eq } from "drizzle-orm";

export default async function ProjectsSection() {
  const all = await db
    .select()
    .from(projects)
    .where(eq(projects.published, true))
    .orderBy(asc(projects.sortOrder));

  if (all.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-8 py-16 bg-background">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-xs uppercase tracking-[0.3em] text-outline mb-2 font-bold">
            Work
          </h2>
          <h3 className="font-headline text-3xl font-bold text-white tracking-tight">
            Projects
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {all.map((project) => {
          const tags: string[] = JSON.parse(project.tags);
          return (
            <div key={project.id} className="group border border-white/5 bg-surface-container p-6 hover:border-white/10 transition-all">
              {project.image && (
                <div className="aspect-video bg-surface overflow-hidden mb-6 relative">
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    fill
                    className="object-cover grayscale opacity-60 group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              )}
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 bg-surface-container-highest border border-white/5 uppercase font-mono">
                    {tag}
                  </span>
                ))}
              </div>
              <h4 className="font-headline font-bold text-white text-lg group-hover:text-primary transition-colors mb-2">
                {project.title}
              </h4>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                {project.description}
              </p>
              <div className="flex gap-4">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-outline hover:text-primary transition-colors uppercase tracking-widest">
                    GitHub
                  </a>
                )}
                {project.url && (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-outline hover:text-primary transition-colors uppercase tracking-widest">
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

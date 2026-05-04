import { db } from "@/lib/db";
import { workRoles } from "@/lib/schema";
import { asc } from "drizzle-orm";

export default async function EvolutionSection() {
  const roles = await db
    .select()
    .from(workRoles)
    .orderBy(asc(workRoles.sortOrder));

  return (
    <section id="work" className="bg-surface py-16 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-8">
        <h3 className="font-headline text-3xl font-bold text-white mb-10 tracking-tight text-center md:text-left">
          Evolution
        </h3>

        <div className="space-y-1">
          {roles.map((role) => (
            <div
              key={role.id}
              className="flex flex-col md:flex-row group border-b border-white/5 pb-6 pt-6 first:pt-0 last:border-0 hover:bg-white/[0.02] transition-colors px-4"
            >
              <div className="md:w-1/4 text-outline font-mono text-xs pt-1">
                {role.period}
              </div>
              <div className="md:w-3/4">
                <h4 className="font-headline font-bold text-white text-lg group-hover:text-primary transition-colors">
                  {role.title}
                </h4>
                <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                  {role.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

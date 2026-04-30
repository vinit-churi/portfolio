type Role = {
  period: string;
  title: string;
  description: string;
};

const roles: Role[] = [
  {
    period: "2021 — PRESENT",
    title: "Principal Backend Engineer @ QuantLogix",
    description:
      "Spearheading the core matching engine rewrite in Rust, achieving sub-millisecond execution times. Managed a team of 12 engineers across 3 timezones.",
  },
  {
    period: "2018 — 2021",
    title: "Senior Systems Architect @ DataLayer",
    description:
      "Designed and implemented a distributed event-streaming platform handling 50TB of daily telemetry data using Kafka and Go.",
  },
  {
    period: "2015 — 2018",
    title: "Software Engineer @ OpenSource Foundries",
    description:
      "Early contributor to several CNCF projects. Focused on container runtime security and eBPF observability tools.",
  },
];

export default function EvolutionSection() {
  return (
    <section className="bg-surface py-16 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-8">
        <h3 className="font-headline text-3xl font-bold text-white mb-10 tracking-tight text-center md:text-left">
          Evolution
        </h3>

        <div className="space-y-1">
          {roles.map((role) => (
            <div
              key={role.title}
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

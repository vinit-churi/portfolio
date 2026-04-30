type ExpertiseItem = {
  icon: string;
  title: string;
  description: string;
  tags: string[];
  bg: string;
};

const items: ExpertiseItem[] = [
  {
    icon: "hub",
    title: "Distributed Systems",
    description:
      "High-availability microservices architecture with gRPC and event-driven patterns.",
    tags: ["Raft", "Kafka"],
    bg: "bg-surface",
  },
  {
    icon: "speed",
    title: "High Concurrency",
    description:
      "Optimization of data pipelines processing 1M+ req/sec using lock-free structures.",
    tags: ["Goroutines", "Redis"],
    bg: "bg-surface-container-low",
  },
  {
    icon: "database",
    title: "Data Science & Integrations",
    description:
      "Complex ETL processes and vector database implementation for LLM contexts.",
    tags: ["Pinecone", "Spark"],
    bg: "bg-surface",
  },
  {
    icon: "view_quilt",
    title: "Modern Frontend",
    description:
      "Internal tooling using React and Tailwind with deep state management focus.",
    tags: ["Next.js", "Zustand"],
    bg: "bg-surface-container-low",
  },
];

export default function ExpertiseSection() {
  return (
    <section className="bg-surface-container-lowest py-16">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-12 flex justify-between items-end">
          <div>
            <h2 className="text-xs uppercase tracking-[0.3em] text-outline mb-2 font-bold">
              Expertise
            </h2>
            <h3 className="font-headline text-3xl font-bold text-white tracking-tight">
              Technical Verticals
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-white/5">
          {items.map((item) => (
            <div
              key={item.title}
              className={`${item.bg} p-6 hover:bg-surface-container transition-colors`}
            >
              <span className="material-symbols-outlined text-primary mb-4 block">
                {item.icon}
              </span>
              <h4 className="font-headline font-bold text-white mb-2">
                {item.title}
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {item.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] px-2 py-1 bg-surface-container-highest border border-white/5 uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

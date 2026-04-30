import Image from "next/image";

type Article = {
  date: string;
  tag: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
};

const articles: Article[] = [
  {
    date: "May 10, 2024",
    tag: "Scale",
    title: "The Cost of Consistency: Raft vs Paxos in Production",
    excerpt:
      "A deep dive into distributed consensus protocols and their real-world latency trade-offs...",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC5EvBChHpRWd5tR1TY3iBwSyToaxn8KGMW9xBoFKyjN4CCYjRiGbmjTiSUYtskbgr1O4jlGDoeW1JMkaGojOgQnVvHejQTvZ-OjycN5eGOvLxxAgQuuKcV_v91nD80nEWnk_t1rcN2YT06t3FosrP2Gmx2NBY4kDHIgPhvaTGZrG120gAcp647Pj0eSNTQmG-uRZhKRYTjRvqnQL3XosdusQvkbN76tmVm0wXPNGaBCueYn65ZKdtUyWe90wuHBeoIzdQTh9wgOhQ",
    imageAlt:
      "Microscopic view of crystalline structures in black and white",
  },
  {
    date: "April 22, 2024",
    tag: "Optimization",
    title: "Zero-Allocation Data Parsing in Go",
    excerpt:
      "How to leverage buffer pools and unsafe pointers to squeeze every bit of performance from your parsers.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBn9rsjMeElaVF-RtxtlRorA7Tusu_gGegtZedGSDqNzZMLlsFTrqh1AJYt3bJ4LU4PHEJC8yHlLo2e7ujIMPNL2USXAWvGqJ2DE3RzdvaWaNNQiHWyQZPzDvESgCKawjVfeMCEKfJ7ATBLEv9s8Pil3kPkiXy2vPZduT9jt9JOiIFPkwzd4LrzizfLJPcsV_1SCHfjWTA-5-OACPchuetsG3QNV8r6O1xE26E5eMUjskGdPOTb2nGFo1_QJmfw0CWF1To2o_NT2hs",
    imageAlt:
      "Abstract architectural photography of a minimalist concrete building",
  },
  {
    date: "March 05, 2024",
    tag: "Design",
    title: "Designing Resilient API Contracts with ProtoBuf",
    excerpt:
      "The architecture of evolution: avoiding breaking changes in high-velocity microservice environments.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCLaFkIr2RGz9brsUYZSeth89J0TUDhfwWp81NNeaOy4WVmXBHYe3CzULlHYZo0WOyf28r_nXr526sHbEUCeeBiywVoN4430Jh9PeIin3sb3qu1zr4CJqGvkBe9eaE_K-Tb0ePnSkRczvF-DcSAe8xnlKtbSgJwilJTxgHLXwOPx7raAz7ln9EcYWd5ZzTZ2zB8aLbiugyhsaDhmB2fJzIZMfsx_eADLYkpuDcl7PYEv47qrYQCKC474eQLcp2r5NZwvtaIQqHuMcg",
    imageAlt:
      "Macro photo of circuit board paths glowing with faint electrical light",
  },
];

export default function JournalSection() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-16 bg-background">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-xs uppercase tracking-[0.3em] text-outline mb-2 font-bold">
            Insights
          </h2>
          <h3 className="font-headline text-3xl font-bold text-white tracking-tight">
            Journal &amp; Research
          </h3>
        </div>
        <a
          href="#"
          className="text-xs font-bold uppercase tracking-widest text-primary border-b border-primary/50 pb-1 hover:border-primary transition-all"
        >
          View All Entries
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map((article) => (
          <article key={article.title} className="group">
            <div className="aspect-video bg-surface-container overflow-hidden mb-4 border border-white/5 relative">
              <Image
                src={article.image}
                alt={article.imageAlt}
                fill
                className="object-cover grayscale group-hover:scale-105 transition-transform duration-500 opacity-80"
              />
            </div>
            <div className="space-y-2">
              <div className="flex gap-4 text-[10px] text-outline font-mono uppercase">
                <span>{article.date}</span>
                <span>{article.tag}</span>
              </div>
              <h4 className="font-headline font-bold text-white group-hover:text-primary transition-colors leading-snug">
                {article.title}
              </h4>
              <p className="text-xs text-on-surface-variant line-clamp-2">
                {article.excerpt}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

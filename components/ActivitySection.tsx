import ContributionGrid from "./ContributionGrid";

type LedgerEntry = {
  date: string;
  title: string;
  description: string;
  active: boolean;
};

const ledger: LedgerEntry[] = [
  {
    date: "2024-05-12",
    title: "Deployed Sharding Logic",
    description: "Reduced write latency by 45% for global regions.",
    active: true,
  },
  {
    date: "2024-04-28",
    title: "OS Contribution: Go-Raft",
    description: "Merged PR for leader election timeout optimizations.",
    active: false,
  },
  {
    date: "2024-03-15",
    title: "Infrastructure Migrated",
    description: "Completed full EKS transition for core services.",
    active: false,
  },
];

const stats = [
  { label: "Uptime Commit", value: "99.98%" },
  { label: "Pull Requests", value: "412" },
  { label: "Total Stars", value: "1.2k" },
  { label: "System Load", value: "0.02ms" },
];

export default function ActivitySection() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4 space-y-6">
          <h3 className="font-headline text-xl font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">terminal</span>
            Activity Ledger
          </h3>

          <div className="space-y-4 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-white/10">
            {ledger.map((entry) => (
              <div key={entry.date} className="relative pl-6 group">
                <div
                  className={`absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full bg-background border-2 transition-all group-hover:scale-110 ${
                    entry.active
                      ? "border-primary"
                      : "border-outline-variant group-hover:border-primary"
                  }`}
                />
                <span className="text-[10px] text-outline font-mono block">
                  {entry.date}
                </span>
                <p className="text-xs text-white font-medium">{entry.title}</p>
                <p className="text-[11px] text-on-surface-variant">
                  {entry.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h3 className="font-headline text-xl font-bold text-white">
              System Contributions
            </h3>
            <span className="text-[10px] text-outline font-mono">
              github.com/arch-backend
            </span>
          </div>

          <div className="bg-surface-container-low p-6 border border-white/5 rounded-lg overflow-hidden">
            <ContributionGrid />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/5">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <span className="block text-[10px] text-outline uppercase tracking-widest font-bold">
                    {stat.label}
                  </span>
                  <span className="text-lg font-headline font-extrabold text-white">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

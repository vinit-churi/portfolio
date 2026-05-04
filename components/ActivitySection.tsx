import { db } from "@/lib/db";
import { activityLedger, activityStats } from "@/lib/schema";
import { asc } from "drizzle-orm";

export default async function ActivitySection() {
  const [ledger, stats] = await Promise.all([
    db.select().from(activityLedger).orderBy(asc(activityLedger.sortOrder)),
    db.select().from(activityStats).orderBy(asc(activityStats.sortOrder)),
  ]);

  return (
    <section id="activity" className="max-w-7xl mx-auto px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Activity Ledger */}
        <div className="md:col-span-5 space-y-6">
          <h3 className="font-headline text-xl font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">terminal</span>
            Activity Ledger
          </h3>

          <div className="space-y-4 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-white/10">
            {ledger.map((entry) => (
              <div key={entry.id} className="relative pl-6 group">
                <div
                  className={`absolute left-0 top-1.5 w-[15px] h-[15px] bg-background border-2 transition-all group-hover:scale-110 ${
                    entry.active
                      ? "border-primary"
                      : "border-outline-variant group-hover:border-primary"
                  }`}
                />
                <span className="text-xs text-outline font-mono block">
                  {entry.date}
                </span>
                <p className="text-xs text-white font-medium">{entry.title}</p>
                <p className="text-xs text-on-surface-variant">
                  {entry.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* System Metrics */}
        <div className="md:col-span-7 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h3 className="font-headline text-xl font-bold text-white">
              System Metrics
            </h3>
            <a
              href="https://github.com/vinit-churi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-outline font-mono hover:text-primary transition-colors uppercase tracking-widest"
            >
              github.com/vinit-churi ↗
            </a>
          </div>

          <div className="border border-white/5 divide-y divide-white/5">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="grid grid-cols-2 px-6 py-4 hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-xs font-mono text-outline uppercase tracking-widest">
                  {stat.label}
                </span>
                <span className="font-headline font-extrabold text-white text-xl tabular-nums text-right">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

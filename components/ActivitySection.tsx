import { db } from "@/lib/db";
import { activityLedger, activityStats } from "@/lib/schema";
import { asc } from "drizzle-orm";
import { Terminal } from "lucide-react";
import ContributionGrid from "./ContributionGrid";

export default async function ActivitySection() {
  const [ledger, stats] = await Promise.all([
    db.select().from(activityLedger).orderBy(asc(activityLedger.sortOrder)),
    db.select().from(activityStats).orderBy(asc(activityStats.sortOrder)),
  ]);

  return (
    <section id="activity" className="bg-background py-20">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
        <div className="md:col-span-5 space-y-6">
          <h3 className="font-headline text-xl font-bold text-white flex items-center gap-2">
            <Terminal size={14} className="text-primary" />
            Activity ledger
          </h3>

          <ol className="space-y-4 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-white/10">
            {ledger.map((entry) => (
              <li key={entry.id} className="relative pl-6 group">
                <span
                  className={`absolute left-0 top-1.5 w-[15px] h-[15px] bg-background border-2 transition-all group-hover:scale-110 ${
                    entry.active
                      ? "border-primary"
                      : "border-outline-variant group-hover:border-primary"
                  }`}
                />
                <span className="text-[11px] text-outline font-mono tabular-nums uppercase tracking-widest block">
                  {entry.date}
                </span>
                <p className="text-sm text-white font-medium">{entry.title}</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {entry.description}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="md:col-span-7 space-y-8">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h3 className="font-headline text-xl font-bold text-white">
              System metrics
            </h3>
            <a
              href="https://github.com/vinit-churi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-outline font-mono hover:text-primary transition-colors uppercase tracking-widest"
            >
              github.com/vinit-churi ↗
            </a>
          </div>

          <ContributionGrid />

          <div className="border border-white/5 divide-y divide-white/5">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="grid grid-cols-2 px-6 py-4 hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-[11px] font-mono text-outline uppercase tracking-widest">
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

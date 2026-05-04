import { db } from "@/lib/db";
import {
  heroConfig,
  journalArticles,
  activityLedger,
  activityStats,
  workRoles,
  expertiseItems,
  projects,
  research,
} from "@/lib/schema";
import { eq, asc } from "drizzle-orm";
import AdminClient from "../AdminClient";

// CMS-managed vs static — reference for what needs real data:
//
// CMS (update via admin):
//   Hero          → liveStatusText, availabilityLabel, tagline, bio, stacks
//   Roles         → replace QuantLogix/DataLayer/OpenSource Foundries with real companies
//   Stats         → replace fabricated 99.98%/412/1.2k/0.02ms with real numbers
//   Articles      → replace placeholder articles with real writing (no article pages yet)
//   Ledger        → replace with real recent activity entries
//   Projects      → add real projects with GitHub links
//   Research      → add real research entries
//
// Static (hardcoded, edit source):
//   NavBar        → brand name, nav labels (components/NavBar.tsx)
//   Footer        → email, social URLs, location (components/Footer.tsx)
//   Page title    → app/layout.tsx metadata
//   Image URLs    → HeroSection, JournalSection (currently Google CDN images)

const PLACEHOLDER_WARNINGS = [
  { tab: "Roles", warning: "Companies (QuantLogix, DataLayer, OpenSource Foundries) are placeholders — replace with real history" },
  { tab: "Stats", warning: "All 4 metrics are fabricated — update with real numbers or remove" },
  { tab: "Journal", warning: "Seed articles are placeholders — replace with real writing" },
  { tab: "Ledger", warning: "Seed entries are placeholders — replace with real recent activity" },
];

export default async function AdminPage() {
  const [
    hero,
    articles,
    ledger,
    stats,
    roles,
    expertise,
    allProjects,
    allResearch,
  ] = await Promise.all([
    db.select().from(heroConfig).where(eq(heroConfig.id, 1)).then((r) => r[0] ?? null),
    db.select().from(journalArticles).orderBy(asc(journalArticles.sortOrder)),
    db.select().from(activityLedger).orderBy(asc(activityLedger.sortOrder)),
    db.select().from(activityStats).orderBy(asc(activityStats.sortOrder)),
    db.select().from(workRoles).orderBy(asc(workRoles.sortOrder)),
    db.select().from(expertiseItems).orderBy(asc(expertiseItems.sortOrder)),
    db.select().from(projects).orderBy(asc(projects.sortOrder)),
    db.select().from(research).orderBy(asc(research.sortOrder)),
  ]);

  return (
    <AdminClient
      hero={hero}
      articles={articles}
      ledger={ledger}
      stats={stats}
      roles={roles}
      expertise={expertise}
      projects={allProjects}
      research={allResearch}
      placeholderWarnings={PLACEHOLDER_WARNINGS}
    />
  );
}

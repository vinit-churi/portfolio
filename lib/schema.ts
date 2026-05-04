import { integer, text, sqliteTable, uniqueIndex } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const heroConfig = sqliteTable("hero_config", {
  id: integer("id").primaryKey(),
  availabilityLabel: text("availability_label").notNull(),
  isAvailable: integer("is_available", { mode: "boolean" }).notNull().default(true),
  tagline: text("tagline").notNull(),
  bio: text("bio").notNull(),
  infraLabel: text("infra_label").notNull(),
  infraStack: text("infra_stack").notNull(),
  coreLabel: text("core_label").notNull(),
  coreStack: text("core_stack").notNull(),
  liveStatusText: text("live_status_text").notNull(),
  clusterStatusText: text("cluster_status_text").notNull(),
  clusterPercentage: integer("cluster_percentage").notNull().default(80),
});

export const STATUS_VALUES = ["draft", "scheduled", "published"] as const;
export type ContentStatus = (typeof STATUS_VALUES)[number];

export const journalArticles = sqliteTable(
  "journal_articles",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug").notNull(),
    date: text("date").notNull(),
    tags: text("tags").notNull().default("[]"),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
    body: text("body").notNull().default(""),
    image: text("image").notNull().default(""),
    imageAlt: text("image_alt").notNull().default(""),
    status: text("status", { enum: STATUS_VALUES }).notNull().default("draft"),
    publishedAt: integer("published_at", { mode: "timestamp" }),
    readingMinutes: integer("reading_minutes").notNull().default(0),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`)
      .$onUpdate(() => new Date()),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [uniqueIndex("journal_articles_slug_idx").on(t.slug)]
);

export const research = sqliteTable(
  "research",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug").notNull(),
    date: text("date").notNull(),
    tags: text("tags").notNull().default("[]"),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
    body: text("body").notNull().default(""),
    image: text("image").notNull().default(""),
    imageAlt: text("image_alt").notNull().default(""),
    status: text("status", { enum: STATUS_VALUES }).notNull().default("draft"),
    publishedAt: integer("published_at", { mode: "timestamp" }),
    readingMinutes: integer("reading_minutes").notNull().default(0),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`)
      .$onUpdate(() => new Date()),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [uniqueIndex("research_slug_idx").on(t.slug)]
);

export const projects = sqliteTable(
  "projects",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    body: text("body").notNull().default(""),
    tags: text("tags").notNull().default("[]"),
    url: text("url"),
    githubUrl: text("github_url"),
    image: text("image").notNull().default(""),
    imageAlt: text("image_alt").notNull().default(""),
    status: text("status", { enum: STATUS_VALUES }).notNull().default("draft"),
    publishedAt: integer("published_at", { mode: "timestamp" }),
    readingMinutes: integer("reading_minutes").notNull().default(0),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`)
      .$onUpdate(() => new Date()),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [uniqueIndex("projects_slug_idx").on(t.slug)]
);

export const activityLedger = sqliteTable("activity_ledger", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  active: integer("active", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const activityStats = sqliteTable("activity_stats", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  label: text("label").notNull(),
  value: text("value").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const workRoles = sqliteTable("work_roles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  period: text("period").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const expertiseItems = sqliteTable("expertise_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  icon: text("icon").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  tags: text("tags").notNull().default("[]"),
  bg: text("bg").notNull().default("bg-surface"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const subscribers = sqliteTable(
  "subscribers",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    email: text("email").notNull(),
    confirmToken: text("confirm_token"),
    confirmedAt: integer("confirmed_at", { mode: "timestamp" }),
    unsubscribedAt: integer("unsubscribed_at", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => [uniqueIndex("subscribers_email_idx").on(t.email)]
);

export const auditLog = sqliteTable("audit_log", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id"),
  payload: text("payload"),
  ip: text("ip"),
  userAgent: text("user_agent"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export type JournalArticle = typeof journalArticles.$inferSelect;
export type Research = typeof research.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Subscriber = typeof subscribers.$inferSelect;
export type AuditLogEntry = typeof auditLog.$inferSelect;

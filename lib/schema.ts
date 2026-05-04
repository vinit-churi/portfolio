import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";

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

export const journalArticles = sqliteTable("journal_articles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  tag: text("tag").notNull(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  image: text("image").notNull(),
  imageAlt: text("image_alt").notNull(),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

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

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  tags: text("tags").notNull().default("[]"),
  url: text("url"),
  githubUrl: text("github_url"),
  image: text("image").notNull().default(""),
  imageAlt: text("image_alt").notNull().default(""),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const research = sqliteTable("research", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  tag: text("tag").notNull(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  image: text("image").notNull().default(""),
  imageAlt: text("image_alt").notNull().default(""),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

import { db } from "./db";
import {
  journalArticles,
  research,
  projects,
  type JournalArticle,
  type Research,
  type Project,
} from "./schema";
import { and, asc, desc, eq, lte, or, isNull, sql, like } from "drizzle-orm";

export type ContentKind = "journal" | "research" | "projects";

export type RowFor<K extends ContentKind> = K extends "journal"
  ? JournalArticle
  : K extends "research"
  ? Research
  : Project;

const TABLE = {
  journal: journalArticles,
  research,
  projects,
} as const;

const PATH_BASE: Record<ContentKind, string> = {
  journal: "/journal",
  research: "/research",
  projects: "/projects",
};

export function detailPath(kind: ContentKind, slug: string): string {
  return `${PATH_BASE[kind]}/${slug}`;
}

export function listPath(kind: ContentKind): string {
  return PATH_BASE[kind];
}

function publishedFilter<T extends typeof journalArticles | typeof research | typeof projects>(
  table: T
) {
  const now = new Date();
  return and(
    eq(table.status, "published"),
    or(isNull(table.publishedAt), lte(table.publishedAt, now))
  );
}

export async function listPublished<K extends ContentKind>(
  kind: K,
  opts: { limit?: number; offset?: number; tag?: string } = {}
): Promise<RowFor<K>[]> {
  const table = TABLE[kind];
  const where = opts.tag
    ? and(publishedFilter(table), like(table.tags, `%"${opts.tag}"%`))
    : publishedFilter(table);

  const rows = await db
    .select()
    .from(table)
    .where(where)
    .orderBy(desc(table.publishedAt), asc(table.sortOrder))
    .limit(opts.limit ?? 100)
    .offset(opts.offset ?? 0);

  return rows as RowFor<K>[];
}

export async function countPublished(kind: ContentKind, tag?: string): Promise<number> {
  const table = TABLE[kind];
  const where = tag
    ? and(publishedFilter(table), like(table.tags, `%"${tag}"%`))
    : publishedFilter(table);
  const [row] = await db
    .select({ n: sql<number>`count(*)` })
    .from(table)
    .where(where);
  return row?.n ?? 0;
}

export async function getBySlug<K extends ContentKind>(
  kind: K,
  slug: string
): Promise<RowFor<K> | null> {
  const table = TABLE[kind];
  const [row] = await db
    .select()
    .from(table)
    .where(and(eq(table.slug, slug), publishedFilter(table)))
    .limit(1);
  return (row as RowFor<K> | undefined) ?? null;
}

export async function getBySlugIncludingDrafts<K extends ContentKind>(
  kind: K,
  slug: string
): Promise<RowFor<K> | null> {
  const table = TABLE[kind];
  const [row] = await db.select().from(table).where(eq(table.slug, slug)).limit(1);
  return (row as RowFor<K> | undefined) ?? null;
}

export async function listAllSlugs(kind: ContentKind) {
  const table = TABLE[kind];
  return db
    .select({ slug: table.slug, updatedAt: table.updatedAt })
    .from(table)
    .where(publishedFilter(table));
}

export type SearchResult = {
  kind: ContentKind;
  slug: string;
  title: string;
  excerpt: string;
  tags: string;
};

export async function searchAll(q: string, limit = 20): Promise<SearchResult[]> {
  if (!q.trim()) return [];
  const term = `%${q.trim()}%`;

  const [j, r, p] = await Promise.all([
    db
      .select()
      .from(journalArticles)
      .where(
        and(
          publishedFilter(journalArticles),
          or(
            like(journalArticles.title, term),
            like(journalArticles.excerpt, term),
            like(journalArticles.body, term),
            like(journalArticles.tags, term)
          )
        )
      )
      .limit(limit),
    db
      .select()
      .from(research)
      .where(
        and(
          publishedFilter(research),
          or(
            like(research.title, term),
            like(research.excerpt, term),
            like(research.body, term),
            like(research.tags, term)
          )
        )
      )
      .limit(limit),
    db
      .select()
      .from(projects)
      .where(
        and(
          publishedFilter(projects),
          or(
            like(projects.title, term),
            like(projects.description, term),
            like(projects.body, term),
            like(projects.tags, term)
          )
        )
      )
      .limit(limit),
  ]);

  return [
    ...j.map((row): SearchResult => ({ kind: "journal", slug: row.slug, title: row.title, excerpt: row.excerpt, tags: row.tags })),
    ...r.map((row): SearchResult => ({ kind: "research", slug: row.slug, title: row.title, excerpt: row.excerpt, tags: row.tags })),
    ...p.map((row): SearchResult => ({ kind: "projects", slug: row.slug, title: row.title, excerpt: row.description, tags: row.tags })),
  ];
}

export async function listRelated<K extends ContentKind>(
  kind: K,
  excludeId: number,
  tags: string[],
  limit = 3
): Promise<RowFor<K>[]> {
  if (tags.length === 0) return [];
  const table = TABLE[kind];
  const tagFilters = tags.map((t) => like(table.tags, `%"${t}"%`));
  const rows = await db
    .select()
    .from(table)
    .where(
      and(
        publishedFilter(table),
        sql`${table.id} != ${excludeId}`,
        or(...tagFilters)
      )
    )
    .orderBy(desc(table.publishedAt))
    .limit(limit);
  return rows as RowFor<K>[];
}

export function parseTags(json: string): string[] {
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) return parsed.filter((t): t is string => typeof t === "string");
    return [];
  } catch {
    return [];
  }
}

export async function listAllTags(): Promise<{ tag: string; count: number }[]> {
  const rows = await Promise.all([
    db.select({ tags: journalArticles.tags }).from(journalArticles).where(publishedFilter(journalArticles)),
    db.select({ tags: research.tags }).from(research).where(publishedFilter(research)),
    db.select({ tags: projects.tags }).from(projects).where(publishedFilter(projects)),
  ]);

  const counts = new Map<string, number>();
  for (const set of rows) {
    for (const r of set) {
      for (const t of parseTags(r.tags)) {
        counts.set(t, (counts.get(t) ?? 0) + 1);
      }
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

import { z } from "zod";
import { eq, ne, type SQL } from "drizzle-orm";
import { db } from "./db";
import { journalArticles, projects, research, STATUS_VALUES } from "./schema";
import { sanitizeBody } from "./sanitize";
import { estimateReadingMinutes } from "./reading";
import { ensureUniqueSlug, slugify } from "./slug";
import type { ContentKind } from "./content";

const StatusSchema = z.enum(STATUS_VALUES);

const TagsArray = z.array(z.string().min(1).max(40)).max(20);

const TagsField = z
  .union([TagsArray, z.string()])
  .transform((v) => {
    const arr = Array.isArray(v)
      ? v
      : (() => {
          try {
            const parsed = JSON.parse(v);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        })();
    return JSON.stringify(arr.map((t) => String(t).trim()).filter(Boolean));
  });

const PublishedAt = z
  .union([z.string(), z.number(), z.null(), z.undefined()])
  .transform((v) => {
    if (v == null || v === "") return null;
    const d = typeof v === "number" ? new Date(v) : new Date(v);
    return isNaN(d.getTime()) ? null : d;
  });

const ImageField = z.string().max(2048).default("");
const StringField = (max: number) => z.string().min(1).max(max);

const JournalSchema = z.object({
  slug: z.string().min(1).max(120).optional(),
  title: StringField(200),
  date: z.string().min(1).max(60),
  excerpt: z.string().min(1).max(500),
  body: z.string().default(""),
  image: ImageField.optional(),
  imageAlt: z.string().max(300).optional().default(""),
  tags: TagsField.optional().default("[]"),
  status: StatusSchema.optional().default("draft"),
  publishedAt: PublishedAt.optional(),
  sortOrder: z.coerce.number().int().optional().default(0),
});

const ResearchSchema = JournalSchema;

const ProjectSchema = z.object({
  slug: z.string().min(1).max(120).optional(),
  title: StringField(200),
  description: z.string().min(1).max(500),
  body: z.string().default(""),
  tags: TagsField.optional().default("[]"),
  url: z.string().max(2048).nullable().optional(),
  githubUrl: z.string().max(2048).nullable().optional(),
  image: ImageField.optional(),
  imageAlt: z.string().max(300).optional().default(""),
  status: StatusSchema.optional().default("draft"),
  publishedAt: PublishedAt.optional(),
  sortOrder: z.coerce.number().int().optional().default(0),
});

export type JournalInput = z.infer<typeof JournalSchema>;
export type ResearchInput = z.infer<typeof ResearchSchema>;
export type ProjectInput = z.infer<typeof ProjectSchema>;

const TABLE = {
  journal: journalArticles,
  research,
  projects,
} as const;

function schemaFor(kind: ContentKind) {
  if (kind === "projects") return ProjectSchema;
  if (kind === "research") return ResearchSchema;
  return JournalSchema;
}

async function existingSlugs(kind: ContentKind, excludeId?: number): Promise<string[]> {
  const table = TABLE[kind];
  const where: SQL | undefined = excludeId == null ? undefined : ne(table.id, excludeId);
  const rows = await db.select({ slug: table.slug }).from(table).where(where);
  return rows.map((r) => r.slug);
}

function normalize(kind: ContentKind, raw: unknown) {
  const schema = schemaFor(kind);
  return schema.parse(raw);
}

async function buildSlug(
  kind: ContentKind,
  proposedRaw: string | undefined,
  fallback: string,
  excludeId?: number
): Promise<string> {
  const base = slugify((proposedRaw && proposedRaw.trim()) || fallback);
  if (!base) throw new Error("Could not derive slug");
  const existing = await existingSlugs(kind, excludeId);
  return ensureUniqueSlug(base, existing);
}

type CreateResult<T> = T;

export async function createContent(
  kind: ContentKind,
  raw: unknown
): Promise<CreateResult<unknown>> {
  const data = normalize(kind, raw);
  const cleanBody = sanitizeBody(data.body ?? "");
  const reading = estimateReadingMinutes(cleanBody);
  const slug = await buildSlug(kind, data.slug, (data as { title: string }).title);

  if (kind === "projects") {
    const p = data as ProjectInput;
    const [row] = await db
      .insert(projects)
      .values({
        slug,
        title: p.title,
        description: p.description,
        body: cleanBody,
        tags: p.tags ?? "[]",
        url: p.url ?? null,
        githubUrl: p.githubUrl ?? null,
        image: p.image ?? "",
        imageAlt: p.imageAlt ?? "",
        status: p.status ?? "draft",
        publishedAt: p.publishedAt ?? null,
        readingMinutes: reading,
        sortOrder: p.sortOrder ?? 0,
      })
      .returning();
    return row;
  }

  const table = kind === "journal" ? journalArticles : research;
  const j = data as JournalInput;
  const [row] = await db
    .insert(table)
    .values({
      slug,
      title: j.title,
      date: j.date,
      excerpt: j.excerpt,
      body: cleanBody,
      tags: j.tags ?? "[]",
      image: j.image ?? "",
      imageAlt: j.imageAlt ?? "",
      status: j.status ?? "draft",
      publishedAt: j.publishedAt ?? null,
      readingMinutes: reading,
      sortOrder: j.sortOrder ?? 0,
    })
    .returning();
  return row;
}

export async function updateContent(kind: ContentKind, id: number, raw: unknown) {
  const data = normalize(kind, raw);
  const cleanBody = sanitizeBody(data.body ?? "");
  const reading = estimateReadingMinutes(cleanBody);

  const slug =
    data.slug && data.slug.trim()
      ? await buildSlug(kind, data.slug, (data as { title: string }).title, id)
      : undefined;

  if (kind === "projects") {
    const p = data as ProjectInput;
    await db
      .update(projects)
      .set({
        ...(slug ? { slug } : {}),
        title: p.title,
        description: p.description,
        body: cleanBody,
        tags: p.tags ?? "[]",
        url: p.url ?? null,
        githubUrl: p.githubUrl ?? null,
        image: p.image ?? "",
        imageAlt: p.imageAlt ?? "",
        status: p.status ?? "draft",
        publishedAt: p.publishedAt ?? null,
        readingMinutes: reading,
        sortOrder: p.sortOrder ?? 0,
      })
      .where(eq(projects.id, id));
    const [updated] = await db.select().from(projects).where(eq(projects.id, id));
    return updated;
  }

  const table = kind === "journal" ? journalArticles : research;
  const j = data as JournalInput;
  await db
    .update(table)
    .set({
      ...(slug ? { slug } : {}),
      title: j.title,
      date: j.date,
      excerpt: j.excerpt,
      body: cleanBody,
      tags: j.tags ?? "[]",
      image: j.image ?? "",
      imageAlt: j.imageAlt ?? "",
      status: j.status ?? "draft",
      publishedAt: j.publishedAt ?? null,
      readingMinutes: reading,
      sortOrder: j.sortOrder ?? 0,
    })
    .where(eq(table.id, id));
  const [updated] = await db.select().from(table).where(eq(table.id, id));
  return updated;
}

export async function deleteContent(kind: ContentKind, id: number) {
  const table = TABLE[kind];
  await db.delete(table).where(eq(table.id, id));
}

export async function reorderContent(
  kind: ContentKind,
  order: { id: number; sortOrder: number }[]
) {
  const table = TABLE[kind];
  await db.transaction(async (tx) => {
    for (const item of order) {
      await tx.update(table).set({ sortOrder: item.sortOrder }).where(eq(table.id, item.id));
    }
  });
}

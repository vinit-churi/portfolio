import type { MetadataRoute } from "next";
import { listAllSlugs } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [journal, research, projects] = await Promise.all([
    listAllSlugs("journal"),
    listAllSlugs("research"),
    listAllSlugs("projects"),
  ]);

  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/journal"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/research"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/projects"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/tags"), lastModified: now, changeFrequency: "weekly", priority: 0.5 },
  ];

  const journalEntries: MetadataRoute.Sitemap = journal.map((row) => ({
    url: absoluteUrl(`/journal/${row.slug}`),
    lastModified: row.updatedAt ?? now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const researchEntries: MetadataRoute.Sitemap = research.map((row) => ({
    url: absoluteUrl(`/research/${row.slug}`),
    lastModified: row.updatedAt ?? now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map((row) => ({
    url: absoluteUrl(`/projects/${row.slug}`),
    lastModified: row.updatedAt ?? now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...journalEntries, ...researchEntries, ...projectEntries];
}

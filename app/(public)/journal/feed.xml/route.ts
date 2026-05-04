import { listPublished } from "@/lib/content";
import { buildRss } from "@/lib/feed";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  const items = await listPublished("journal", { limit: 50 });
  const xml = buildRss({
    title: `${SITE_NAME} — Journal`,
    description: "Notes, essays, and findings.",
    feedPath: "/journal/feed.xml",
    link: absoluteUrl("/journal"),
    items: items.map((it) => ({
      title: it.title,
      description: it.excerpt,
      link: absoluteUrl(`/journal/${it.slug}`),
      pubDate: it.publishedAt ?? it.createdAt,
    })),
  });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

import { listPublished } from "@/lib/content";
import { buildRss } from "@/lib/feed";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  const items = await listPublished("research", { limit: 50 });
  const xml = buildRss({
    title: `${SITE_NAME} — Research`,
    description: "Long-form research.",
    feedPath: "/research/feed.xml",
    link: absoluteUrl("/research"),
    items: items.map((it) => ({
      title: it.title,
      description: it.excerpt,
      link: absoluteUrl(`/research/${it.slug}`),
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

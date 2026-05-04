import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";
import { getBySlug, parseTags } from "@/lib/content";

export const alt = "Project";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

type Params = Promise<{ slug: string }>;

export default async function Image({ params }: { params: Params }) {
  const { slug } = await params;
  const row = await getBySlug("projects", slug);
  const title = row?.title ?? "Project";
  const tags = row ? parseTags(row.tags) : [];
  return renderOgImage({
    eyebrow: "Project",
    title,
    meta: tags.length > 0 ? tags.slice(0, 3).join(" · ") : undefined,
  });
}

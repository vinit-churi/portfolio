import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";
import { getBySlug } from "@/lib/content";

export const alt = "Research entry";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

type Params = Promise<{ slug: string }>;

export default async function Image({ params }: { params: Params }) {
  const { slug } = await params;
  const row = await getBySlug("research", slug);
  const title = row?.title ?? "Research";
  const date = row?.publishedAt ?? row?.createdAt;
  return renderOgImage({
    eyebrow: "Research",
    title,
    meta: date
      ? new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : undefined,
  });
}

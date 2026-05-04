import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";
import { getBySlug } from "@/lib/content";

export const alt = "Journal entry";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

type Params = Promise<{ slug: string }>;

export default async function Image({ params }: { params: Params }) {
  const { slug } = await params;
  const row = await getBySlug("journal", slug);
  const title = row?.title ?? "Journal";
  const date = row?.publishedAt ?? row?.createdAt;
  return renderOgImage({
    eyebrow: "Journal",
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

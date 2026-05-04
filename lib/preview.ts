import { signPreview, verifyPreview } from "./tokens";
import {
  getBySlug,
  getBySlugIncludingDrafts,
  type ContentKind,
  type RowFor,
} from "./content";

const PREVIEW_TTL_SECONDS = 60 * 60 * 24 * 7;

export function buildPreviewToken(kind: ContentKind, slug: string): string {
  return signPreview({
    kind,
    slug,
    exp: Math.floor(Date.now() / 1000) + PREVIEW_TTL_SECONDS,
  });
}

export function buildPreviewPath(kind: ContentKind, slug: string, token: string): string {
  return `/${kind}/${slug}?preview=${encodeURIComponent(token)}`;
}

export async function resolveForView<K extends ContentKind>(
  kind: K,
  slug: string,
  previewToken?: string | null
): Promise<RowFor<K> | null> {
  if (previewToken) {
    const verified = verifyPreview(previewToken);
    if (verified && verified.kind === kind && verified.slug === slug) {
      return getBySlugIncludingDrafts(kind, slug);
    }
  }
  return getBySlug(kind, slug);
}

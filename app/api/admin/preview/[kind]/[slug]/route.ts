import { isAuthenticated, unauthorizedResponse } from "@/lib/auth";
import { buildPreviewToken } from "@/lib/preview";
import { absoluteUrl } from "@/lib/site";
import type { ContentKind } from "@/lib/content";

const KINDS: ContentKind[] = ["journal", "research", "projects"];

type Params = Promise<{ kind: string; slug: string }>;

export async function GET(_: Request, { params }: { params: Params }) {
  if (!(await isAuthenticated())) return unauthorizedResponse();

  const { kind, slug } = await params;
  if (!KINDS.includes(kind as ContentKind)) {
    return Response.json({ error: "Invalid kind" }, { status: 400 });
  }

  const token = buildPreviewToken(kind as ContentKind, slug);
  const url = absoluteUrl(`/${kind}/${slug}?preview=${encodeURIComponent(token)}`);
  return Response.json({ token, url });
}

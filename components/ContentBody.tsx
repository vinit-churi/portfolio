import { sanitizeBody } from "@/lib/sanitize";

export default function ContentBody({ html }: { html: string }) {
  if (!html?.trim()) {
    return (
      <p className="text-sm font-mono text-outline italic">
        No content yet.
      </p>
    );
  }
  const clean = sanitizeBody(html);
  return (
    <div
      className="prose-body max-w-none"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}

import readingTime from "reading-time";

export function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function estimateReadingMinutes(html: string): number {
  const text = htmlToText(html);
  if (!text) return 0;
  const stats = readingTime(text);
  return Math.max(1, Math.round(stats.minutes));
}

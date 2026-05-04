import { absoluteUrl, SITE_AUTHOR, SITE_NAME } from "./site";

type Item = {
  title: string;
  description: string;
  link: string;
  pubDate: Date;
  guid?: string;
};

function escape(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&apos;");
}

export function buildRss(opts: {
  title: string;
  description: string;
  feedPath: string;
  link: string;
  items: Item[];
}): string {
  const now = new Date().toUTCString();
  const itemsXml = opts.items
    .map(
      (it) => `
    <item>
      <title>${escape(it.title)}</title>
      <link>${escape(it.link)}</link>
      <guid isPermaLink="true">${escape(it.guid ?? it.link)}</guid>
      <description>${escape(it.description)}</description>
      <pubDate>${it.pubDate.toUTCString()}</pubDate>
    </item>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(opts.title)}</title>
    <link>${escape(opts.link)}</link>
    <description>${escape(opts.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <managingEditor>${escape(SITE_AUTHOR.email)} (${escape(SITE_NAME)})</managingEditor>
    <atom:link href="${escape(absoluteUrl(opts.feedPath))}" rel="self" type="application/rss+xml" />${itemsXml}
  </channel>
</rss>`;
}

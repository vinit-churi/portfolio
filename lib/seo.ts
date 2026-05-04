import type { Metadata } from "next";
import {
  SITE_NAME,
  SITE_URL,
  SITE_DESCRIPTION,
  SITE_AUTHOR,
  absoluteUrl,
} from "./site";

type BuildMetadataOpts = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: Date | null;
  modifiedTime?: Date | null;
  tags?: string[];
};

export function buildMetadata(opts: BuildMetadataOpts): Metadata {
  const url = absoluteUrl(opts.path);
  const ogImage = opts.image
    ? absoluteUrl(opts.image)
    : absoluteUrl("/og?title=" + encodeURIComponent(opts.title));
  const fullTitle = opts.path === "/" ? opts.title : `${opts.title} — ${SITE_NAME}`;

  return {
    title: fullTitle,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description: opts.description,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: opts.title }],
      locale: "en_US",
      type: opts.type ?? "website",
      publishedTime: opts.publishedTime?.toISOString(),
      modifiedTime: opts.modifiedTime?.toISOString(),
      tags: opts.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: opts.description,
      images: [ogImage],
      creator: SITE_AUTHOR.twitter,
    },
  };
}

export function articleJsonLd(opts: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: Date | null;
  dateModified?: Date | null;
  tags?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    image: opts.image ? [absoluteUrl(opts.image)] : undefined,
    datePublished: opts.datePublished?.toISOString(),
    dateModified: (opts.dateModified ?? opts.datePublished)?.toISOString(),
    keywords: opts.tags?.join(", "),
    author: {
      "@type": "Person",
      name: SITE_AUTHOR.name,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: SITE_AUTHOR.name,
      url: SITE_URL,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": opts.url },
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_AUTHOR.name,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    sameAs: [
      `https://github.com/${SITE_AUTHOR.github}`,
      `https://twitter.com/${SITE_AUTHOR.twitter.replace(/^@/, "")}`,
    ],
  };
}

export function softwareJsonLd(opts: {
  title: string;
  description: string;
  url: string;
  image?: string;
  codeRepository?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: opts.title,
    description: opts.description,
    url: opts.url,
    image: opts.image ? absoluteUrl(opts.image) : undefined,
    codeRepository: opts.codeRepository ?? undefined,
    author: {
      "@type": "Person",
      name: SITE_AUTHOR.name,
      url: SITE_URL,
    },
  };
}

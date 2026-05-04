import type { Metadata } from "next";
import { Manrope, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "sonner";
import JsonLd from "@/components/JsonLd";
import { personJsonLd } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — vinit.dev`, template: `%s — ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — vinit.dev`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
  alternates: {
    canonical: SITE_URL,
    types: {
      "application/rss+xml": [
        { url: `${SITE_URL}/journal/feed.xml`, title: "Journal" },
        { url: `${SITE_URL}/research/feed.xml`, title: "Research" },
      ],
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  return (
    <html
      lang="en"
      className={`${manrope.variable} ${geistMono.variable}`}
    >
      <body className="bg-background text-on-surface font-body antialiased selection:bg-primary selection:text-on-primary min-h-screen flex flex-col">
        <JsonLd data={personJsonLd()} />
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{ className: "font-mono text-xs" }}
        />
        {umamiSrc && umamiId && (
          <Script
            src={umamiSrc}
            data-website-id={umamiId}
            strategy="afterInteractive"
            async
            defer
          />
        )}
      </body>
    </html>
  );
}

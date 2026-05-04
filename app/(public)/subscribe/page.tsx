import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import SubscribeForm from "@/components/SubscribeForm";

export const dynamic = "force-static";

export const metadata: Metadata = buildMetadata({
  title: "Subscribe",
  description: "Get notified when I publish.",
  path: "/subscribe",
});

const STATUS_MAP: Record<string, { title: string; body: string }> = {
  confirmed: {
    title: "You're confirmed.",
    body: "Thanks for subscribing — you'll get an email next time I publish.",
  },
  unsubscribed: {
    title: "You're unsubscribed.",
    body: "Sorry to see you go. You won't receive any more emails.",
  },
  invalid: {
    title: "Link expired.",
    body: "That confirmation link is invalid or has already been used.",
  },
};

type SearchParams = Promise<{ status?: string }>;

export default async function SubscribePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const status = sp.status ? STATUS_MAP[sp.status] : null;

  return (
    <section className="max-w-xl mx-auto px-8 py-24">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-extrabold text-white tracking-tight">
          Subscribe
        </h1>
        <p className="text-on-surface-variant mt-3">
          Occasional notes when I publish something new. No spam, unsubscribe anytime.
        </p>
      </header>

      {status ? (
        <div className="border border-white/10 bg-surface-container px-6 py-8 mb-8">
          <h2 className="font-headline text-xl font-bold text-white mb-2">
            {status.title}
          </h2>
          <p className="text-sm text-on-surface-variant">{status.body}</p>
          <Link
            href="/"
            className="inline-block mt-6 text-xs font-mono uppercase tracking-widest text-outline hover:text-white"
          >
            ← Back home
          </Link>
        </div>
      ) : (
        <SubscribeForm size="lg" />
      )}
    </section>
  );
}

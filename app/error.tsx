"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const name = error.name || "Error";
  const message = error.message || "Unhandled exception during render.";

  return (
    <section className="max-w-3xl mx-auto px-8 py-32">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-error mb-6">
        Runtime · Server-rendered failure
      </p>
      <h1 className="font-headline text-[clamp(2.5rem,7vw,4.5rem)] font-extrabold tracking-[-0.04em] leading-[0.95] text-white mb-8">
        {name}
      </h1>
      <pre className="font-mono text-xs md:text-sm text-on-surface-variant whitespace-pre-wrap leading-relaxed border-l-0 border border-white/10 bg-surface-container px-4 py-3 mb-8 overflow-x-auto">
        {message}
      </pre>
      <dl className="font-mono text-[11px] uppercase tracking-widest text-outline space-y-1 mb-10">
        {error.digest && (
          <div className="flex gap-3">
            <dt className="w-20 shrink-0">Digest</dt>
            <dd className="text-on-surface-variant tabular-nums">{error.digest}</dd>
          </div>
        )}
        <div className="flex gap-3">
          <dt className="w-20 shrink-0">Time</dt>
          <dd className="text-on-surface-variant tabular-nums">
            {new Date().toISOString()}
          </dd>
        </div>
      </dl>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="bg-primary text-on-primary px-5 py-2 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
        >
          Retry
        </button>
        <a
          href="mailto:vinitchuri0312@gmail.com?subject=Site%20error&body=Digest%3A%20"
          className="border border-white/10 text-outline hover:text-white hover:border-white/20 px-5 py-2 text-xs font-mono uppercase tracking-widest transition-colors"
        >
          Report
        </a>
      </div>
    </section>
  );
}

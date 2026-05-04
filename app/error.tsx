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

  return (
    <section className="max-w-3xl mx-auto px-8 py-32 text-center">
      <p className="text-xs font-mono uppercase tracking-[0.3em] text-error mb-4">
        Something broke
      </p>
      <h1 className="font-headline text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
        That didn&apos;t go as planned.
      </h1>
      <p className="text-on-surface-variant mb-2">
        An unexpected error occurred while rendering this page.
      </p>
      {error.digest && (
        <p className="text-xs font-mono text-outline mb-10">digest: {error.digest}</p>
      )}
      <button
        onClick={reset}
        className="bg-primary text-on-primary px-5 py-2 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
      >
        Try again
      </button>
    </section>
  );
}

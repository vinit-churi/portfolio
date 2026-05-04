import Link from "next/link";

export default function NotFound() {
  return (
    <section className="max-w-3xl mx-auto px-8 py-32 text-center">
      <p className="text-xs font-mono uppercase tracking-[0.3em] text-outline mb-4">
        404 / not found
      </p>
      <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6">
        Lost in the void.
      </h1>
      <p className="text-on-surface-variant mb-10">
        The page you&apos;re looking for has moved, was deleted, or never existed.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="bg-primary text-on-primary px-5 py-2 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
        >
          Home
        </Link>
        <Link
          href="/journal"
          className="border border-white/10 text-outline hover:text-white hover:border-white/20 px-5 py-2 text-xs font-mono uppercase tracking-widest transition-colors"
        >
          Browse Journal
        </Link>
      </div>
    </section>
  );
}

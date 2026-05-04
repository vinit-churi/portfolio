import Link from "next/link";

export default function NotFound() {
  return (
    <section className="max-w-3xl mx-auto px-8 py-32">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-outline mb-6">
        HTTP 404 · Not Found
      </p>
      <h1 className="font-headline text-[clamp(4rem,15vw,9rem)] font-extrabold tracking-[-0.05em] leading-[0.85] text-white mb-10 tabular-nums">
        404
      </h1>
      <p className="text-on-surface-variant max-w-xl text-base leading-relaxed mb-10">
        That route does not exist on this site. It may have moved, or it never did.
      </p>
      <ul className="font-mono text-xs uppercase tracking-widest space-y-2">
        <li>
          <Link href="/" className="text-outline hover:text-white transition-colors">
            → /
          </Link>
        </li>
        <li>
          <Link
            href="/projects"
            className="text-outline hover:text-white transition-colors"
          >
            → /projects
          </Link>
        </li>
        <li>
          <Link
            href="/journal"
            className="text-outline hover:text-white transition-colors"
          >
            → /journal
          </Link>
        </li>
        <li>
          <Link
            href="/research"
            className="text-outline hover:text-white transition-colors"
          >
            → /research
          </Link>
        </li>
        <li>
          <Link
            href="/search"
            className="text-outline hover:text-white transition-colors"
          >
            → /search
          </Link>
        </li>
      </ul>
    </section>
  );
}

import Link from "next/link";

type Props = {
  base: string;
  page: number;
  totalPages: number;
  query?: Record<string, string | undefined>;
};

function buildHref(base: string, page: number, query?: Props["query"]) {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v) params.set(k, v);
    }
  }
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export default function Pagination({ base, page, totalPages, query }: Props) {
  if (totalPages <= 1) return null;

  const prev = page > 1 ? buildHref(base, page - 1, query) : null;
  const next = page < totalPages ? buildHref(base, page + 1, query) : null;

  return (
    <nav className="flex items-center justify-between mt-16 border-t border-white/5 pt-8">
      {prev ? (
        <Link
          href={prev}
          className="text-xs font-mono uppercase tracking-widest text-outline hover:text-white transition-colors"
        >
          ← Newer
        </Link>
      ) : (
        <span />
      )}
      <span className="text-xs font-mono text-outline">
        {page} / {totalPages}
      </span>
      {next ? (
        <Link
          href={next}
          className="text-xs font-mono uppercase tracking-widest text-outline hover:text-white transition-colors"
        >
          Older →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

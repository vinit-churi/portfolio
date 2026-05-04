"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { detailPath, type ContentKind, parseTags } from "@/lib/content";

type Result = {
  kind: ContentKind;
  slug: string;
  title: string;
  excerpt: string;
  tags: string;
};

const LABEL: Record<ContentKind, string> = {
  journal: "Journal",
  research: "Research",
  projects: "Project",
};

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const lastReq = useRef(0);

  useEffect(() => {
    const trimmed = q.trim();
    if (trimmed.length < 2) return;
    const reqId = ++lastReq.current;
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: ctrl.signal,
        });
        const data = await res.json();
        if (reqId === lastReq.current) {
          setResults(data.results ?? []);
        }
      } catch {
        /* aborted */
      } finally {
        if (reqId === lastReq.current) setLoading(false);
      }
    }, 200);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={wrapRef} className="relative w-full max-w-md">
      <label className="flex items-center gap-2 border border-white/10 bg-surface-container px-3 py-2 focus-within:border-white/30 transition-colors">
        <Search size={14} className="text-outline" aria-hidden />
        <input
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search journal, research, projects…"
          aria-label="Search content"
          className="bg-transparent flex-1 text-sm font-mono text-white placeholder:text-outline focus:outline-none"
        />
        {loading && <span className="text-[10px] text-outline font-mono">…</span>}
      </label>

      {open && q.trim().length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 border border-white/10 bg-surface-container-low max-h-96 overflow-y-auto z-40">
          {results.length === 0 && !loading ? (
            <p className="px-4 py-6 text-xs font-mono text-outline">No matches.</p>
          ) : (
            <ul>
              {results.map((r) => (
                <li key={`${r.kind}-${r.slug}`}>
                  <Link
                    href={detailPath(r.kind, r.slug)}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-headline text-sm text-white truncate">
                        {r.title}
                      </span>
                      <span className="text-[10px] font-mono text-outline uppercase tracking-widest shrink-0">
                        {LABEL[r.kind]}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant line-clamp-1 mt-0.5">
                      {r.excerpt}
                    </p>
                    {parseTags(r.tags).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {parseTags(r.tags).slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="text-[9px] px-1 py-0.5 border border-white/5 font-mono text-outline"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

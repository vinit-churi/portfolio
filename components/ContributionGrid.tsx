"use client";

import { useEffect, useState } from "react";

const CELL_CLASSES = [
  "bg-neutral-900",
  "bg-neutral-800",
  "bg-white/20",
  "bg-white/40",
  "bg-white/60",
  "bg-white",
];

function pickClass(seed: number): string {
  const r = ((seed * 1664525 + 1013904223) & 0xffffffff) >>> 0;
  const n = r / 0xffffffff;
  if (n > 0.7) return CELL_CLASSES[0];
  if (n > 0.5) return CELL_CLASSES[1];
  if (n > 0.35) return CELL_CLASSES[2];
  if (n > 0.2) return CELL_CLASSES[3];
  if (n > 0.08) return CELL_CLASSES[4];
  return CELL_CLASSES[5];
}

export default function ContributionGrid() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="flex flex-wrap gap-1 mb-8 min-h-[4rem]" />;
  }

  return (
    <div className="flex flex-wrap gap-1 mb-8">
      {Array.from({ length: 126 }, (_, i) => (
        <div key={i} className={`w-3 h-3 rounded-sm ${pickClass(i + 7)}`} />
      ))}
    </div>
  );
}

const CELL_CLASSES = [
  "bg-white/[0.04]",
  "bg-white/[0.08]",
  "bg-white/20",
  "bg-white/40",
  "bg-white/65",
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
  return (
    <div className="space-y-2">
      <div
        className="grid grid-flow-col grid-rows-7 gap-[2px]"
        role="img"
        aria-label="Contribution density grid (visual texture)"
      >
        {Array.from({ length: 182 }, (_, i) => (
          <span key={i} className={`w-[8px] h-[8px] ${pickClass(i + 7)}`} />
        ))}
      </div>
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-outline">
        <span>26 weeks</span>
        <span className="flex items-center gap-1">
          less
          <span className="flex gap-[2px]">
            {CELL_CLASSES.map((c) => (
              <span key={c} className={`w-[8px] h-[8px] ${c}`} />
            ))}
          </span>
          more
        </span>
      </div>
    </div>
  );
}

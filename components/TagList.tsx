import Link from "next/link";

export default function TagList({
  tags,
  size = "sm",
}: {
  tags: string[];
  size?: "sm" | "xs";
}) {
  if (!tags.length) return null;
  const cls =
    size === "xs"
      ? "text-[10px] px-1.5 py-0.5"
      : "text-xs px-2 py-1";
  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <li key={t}>
          <Link
            href={`/tags/${encodeURIComponent(t)}`}
            className={`${cls} bg-surface-container-highest border border-white/5 uppercase font-mono text-on-surface-variant hover:text-white hover:border-white/20 transition-colors`}
          >
            {t}
          </Link>
        </li>
      ))}
    </ul>
  );
}

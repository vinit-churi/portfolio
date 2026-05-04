import GithubSlugger from "github-slugger";

export function slugify(input: string): string {
  return new GithubSlugger().slug(input);
}

export function ensureUniqueSlug(
  base: string,
  existing: ReadonlyArray<string>
): string {
  const taken = new Set(existing);
  if (!taken.has(base)) return base;
  let i = 2;
  while (taken.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

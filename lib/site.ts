export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const SITE_NAME = "Vinit Churi";
export const SITE_HANDLE = "vinit.dev";
export const SITE_DESCRIPTION =
  "Curiosity-driven engineering. Building for resilience and precision.";
export const SITE_AUTHOR = {
  name: "Vinit Churi",
  email: "vinitchuri0312@gmail.com",
  twitter: "@vinitchuri0312",
  github: "vinit-churi",
};

export function absoluteUrl(path: string): string {
  if (!path) return SITE_URL;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

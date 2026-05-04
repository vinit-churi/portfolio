import { Mail } from "lucide-react";
import SubscribeForm from "./SubscribeForm";

const socialLinks = [
  { label: "GitHub", href: "https://github.com/vinit-churi" },
  { label: "Twitter", href: "https://x.com/vinitchuri0312" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/vinit-churi-1491b6192/" },
  { label: "RSS", href: "/journal/feed.xml" },
];

const stack = ["Next 16", "Bun", "Drizzle", "Turso", "Tailwind v4"];

const buildId =
  process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ??
  process.env.NEXT_PUBLIC_BUILD_ID ??
  "dev";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      id="contact"
      className="bg-surface-container-lowest border-t border-white/5 mt-auto"
    >
      <div className="max-w-7xl mx-auto px-8 py-14 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
        <div className="md:col-span-7 space-y-8">
          <a
            href="mailto:vinitchuri0312@gmail.com"
            className="group inline-flex items-center gap-3"
          >
            <span className="w-9 h-9 bg-white/5 flex items-center justify-center group-hover:bg-primary transition-colors">
              <Mail size={15} className="text-on-surface group-hover:text-on-primary" />
            </span>
            <span className="font-headline font-bold text-base md:text-lg text-white">
              vinitchuri0312@gmail.com
            </span>
          </a>

          <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-widest">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="text-outline hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-5">
          <SubscribeForm />
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 font-mono text-[11px] text-outline uppercase tracking-widest">
          <span>© {year} Vinit Churi · MIT</span>
          <ul className="flex flex-wrap gap-x-3 gap-y-1">
            {stack.map((s, i) => (
              <li key={s} className="flex items-center gap-3">
                <span>{s}</span>
                {i < stack.length - 1 && <span className="text-outline-variant">/</span>}
              </li>
            ))}
          </ul>
          <span className="tabular-nums">build {buildId}</span>
        </div>
      </div>
    </footer>
  );
}

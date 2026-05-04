"use client";

import { Link2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  url: string;
  title: string;
};

function XLogo({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInLogo({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.05-1.86-3.05-1.86 0-2.15 1.45-2.15 2.95v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.86 3.37-1.86 3.6 0 4.27 2.37 4.27 5.45zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13M3.56 20.45h3.56V9H3.56zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0" />
    </svg>
  );
}

export default function ShareButtons({ url, title }: Props) {
  const [copied, setCopied] = useState(false);

  const enc = (s: string) => encodeURIComponent(s);
  const twitter = `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`;
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy failed");
    }
  }

  const itemClass =
    "inline-flex items-center gap-1.5 px-3 py-1.5 border border-white/10 text-xs font-mono uppercase tracking-widest text-outline hover:text-white hover:border-white/20 transition-colors";

  return (
    <div className="flex flex-wrap gap-2">
      <a className={itemClass} href={twitter} target="_blank" rel="noopener noreferrer">
        <XLogo /> Post
      </a>
      <a className={itemClass} href={linkedin} target="_blank" rel="noopener noreferrer">
        <LinkedInLogo /> Share
      </a>
      <button type="button" className={itemClass} onClick={copy}>
        {copied ? <Check size={12} /> : <Link2 size={12} />} {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}

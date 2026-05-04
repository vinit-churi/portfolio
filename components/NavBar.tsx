"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Projects", href: "/projects", section: "work" },
  { label: "Writing", href: "/journal", section: "writing" },
  { label: "Research", href: "/research", section: "writing" },
  { label: "Activity", href: "/#activity", section: "activity" },
];

const HOME_SECTIONS = ["work", "writing", "activity", "evolution", "expertise", "hero"];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (pathname !== "/") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    HOME_SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function isActive(link: (typeof navLinks)[number]) {
    if (link.href.startsWith("/#")) {
      return pathname === "/" && activeSection === link.section;
    }
    if (pathname === "/" && activeSection === link.section) return true;
    return pathname === link.href || pathname.startsWith(link.href + "/");
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface-container-lowest/70 backdrop-blur-xl">
      <div className="flex justify-between items-center px-8 py-5 w-full max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-xl font-bold tracking-tighter text-white font-headline"
        >
          VINIT.DEV
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`font-headline tracking-tight text-sm uppercase transition-colors ${
                isActive(link)
                  ? "text-white"
                  : "text-on-surface-variant hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a
            href="mailto:vinitchuri0312@gmail.com"
            className="hidden md:block bg-primary text-on-primary px-5 py-2 text-xs font-bold uppercase tracking-widest hover:bg-surface-bright transition-colors"
          >
            Email
          </a>

          <button
            ref={triggerRef}
            onClick={() => setOpen((o) => !o)}
            className="md:hidden flex flex-col gap-[5px] p-2"
            aria-label="Toggle navigation"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span
              className={`block w-5 h-px bg-white transition-all duration-200 origin-center ${
                open ? "translate-y-[6px] rotate-45" : ""
              }`}
            />
            <span
              className={`block w-5 h-px bg-white transition-all duration-200 ${
                open ? "opacity-0 scale-x-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-px bg-white transition-all duration-200 origin-center ${
                open ? "-translate-y-[6px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="border-t border-white/5 bg-surface-container-lowest/95 backdrop-blur-xl px-8 py-6 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 font-headline text-sm uppercase tracking-widest text-on-surface-variant hover:text-white transition-colors"
            >
              {link.label}
              <span className="text-outline text-xs">→</span>
            </Link>
          ))}
          <a
            href="mailto:vinitchuri0312@gmail.com"
            onClick={() => setOpen(false)}
            className="block mt-4 bg-primary text-on-primary px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-surface-bright transition-colors text-center"
          >
            Email
          </a>
        </div>
      </div>
    </nav>
  );
}

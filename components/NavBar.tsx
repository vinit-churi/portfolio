"use client";

import { useState } from "react";

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Expertise", href: "#expertise" },
  { label: "Activity", href: "#activity" },
  { label: "Journal", href: "#journal" },
  { label: "Contact", href: "#contact" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface-container-lowest/70 backdrop-blur-xl transition-all duration-300 ease-in-out">
      <div className="flex justify-between items-center px-8 py-6 w-full max-w-7xl mx-auto">
        <a
          href="#hero"
          className="text-xl font-bold tracking-tighter text-white font-headline"
        >
          VINIT.DEV
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-headline tracking-tight text-sm uppercase transition-colors text-on-surface-variant hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a
            href="#contact"
            className="hidden md:block bg-primary text-on-primary px-5 py-2 text-xs font-bold uppercase tracking-widest hover:bg-surface-bright transition-colors"
          >
            Let&apos;s Build
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="md:hidden flex flex-col gap-[5px] p-2"
            aria-label="Toggle navigation"
            aria-expanded={open}
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

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="border-t border-white/5 bg-surface-container-lowest/95 backdrop-blur-xl px-8 py-6 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 font-headline text-sm uppercase tracking-widest text-on-surface-variant hover:text-white transition-colors"
            >
              {link.label}
              <span className="text-outline text-xs">→</span>
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="block mt-4 bg-primary text-on-primary px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-surface-bright transition-colors text-center"
          >
            Let&apos;s Build
          </a>
        </div>
      </div>
    </nav>
  );
}

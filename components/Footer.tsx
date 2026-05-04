const socialLinks = [
  { label: "GitHub", href: "https://github.com/vinit-churi" },
  { label: "Twitter", href: "https://x.com/vinitchuri0312" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/vinit-churi-1491b6192/" },
];

export default function Footer() {
  return (
    <footer id="contact" className="bg-surface-container-lowest border-t border-white/5 py-12 px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="space-y-4 text-center md:text-left">
          <h2 className="font-headline text-3xl font-extrabold text-white tracking-tighter">
            Let&apos;s build the future
          </h2>

          <div className="flex flex-col md:flex-row gap-6">
            <a
              href="mailto:vinitchuri0312@gmail.com"
              className="group flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-white/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                <span className="material-symbols-outlined text-sm group-hover:text-on-primary">
                  mail
                </span>
              </div>
              <span className="font-headline font-bold text-lg text-white">
                vinitchuri0312@gmail.com
              </span>
            </a>

            <div className="hidden md:block w-px h-10 bg-white/10 self-center" />

            <div className="flex gap-4 items-center justify-center">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-outline hover:text-white transition-colors font-label text-xs font-medium uppercase tracking-widest"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="font-headline font-black text-lg tracking-widest text-white">
            VINIT.DEV
          </div>
          <p className="text-outline text-xs uppercase tracking-widest">
            © 2026 Vinit Churi
          </p>
          <div className="flex gap-4 mt-2">
            <span className="text-xs text-primary/40 uppercase tracking-tighter">
              Lat: 19.0760° N
            </span>
            <span className="text-xs text-primary/40 uppercase tracking-tighter">
              Long: 72.8777° E
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

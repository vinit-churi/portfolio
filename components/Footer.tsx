const socialLinks = ["LinkedIn", "GitHub", "Twitter"];

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-white/5 py-12 px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="space-y-4 text-center md:text-left">
          <h2 className="font-headline text-3xl font-extrabold text-white tracking-tighter">
            Let&apos;s build the future
          </h2>

          <div className="flex flex-col md:flex-row gap-6">
            <a
              href="mailto:hello@architect.io"
              className="group flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                <span className="material-symbols-outlined text-sm group-hover:text-on-primary">
                  mail
                </span>
              </div>
              <span className="font-headline font-bold text-lg text-white">
                hello@architect.io
              </span>
            </a>

            <div className="hidden md:block w-px h-10 bg-white/10 self-center" />

            <div className="flex gap-4 items-center justify-center">
              {socialLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-outline hover:text-white transition-colors font-label text-xs font-medium uppercase tracking-widest"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="font-headline font-black text-lg tracking-widest text-white">
            ARCHITECT.IO
          </div>
          <p className="text-outline text-[10px] uppercase tracking-widest">
            © 2024 The Monochrome Architect
          </p>
          <div className="flex gap-4 mt-2">
            <span className="text-[10px] text-primary/40 uppercase tracking-tighter">
              Lat: 40.7128° N
            </span>
            <span className="text-[10px] text-primary/40 uppercase tracking-tighter">
              Long: 74.0060° W
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

const navLinks = [
  { label: "Work", active: false },
  { label: "Expertise", active: true },
  { label: "Activity", active: false },
  { label: "Journal", active: false },
  { label: "Contact", active: false },
];

export default function NavBar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-surface-container-lowest/70 backdrop-blur-xl transition-all duration-300 ease-in-out">
      <div className="flex justify-between items-center px-8 py-6 w-full max-w-7xl mx-auto">
        <div className="text-xl font-bold tracking-tighter text-white font-headline">
          ARCHITECT.IO
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href="#"
              className={`font-headline tracking-tight text-sm uppercase transition-colors ${
                link.active
                  ? "text-white border-b-2 border-white pb-1"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <button className="bg-primary text-on-primary px-5 py-2 text-xs font-bold uppercase tracking-widest hover:bg-surface-bright transition-colors">
          Let&apos;s Build
        </button>
      </div>
    </nav>
  );
}

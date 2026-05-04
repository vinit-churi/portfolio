import Image from "next/image";
import { db } from "@/lib/db";
import { heroConfig } from "@/lib/schema";
import { eq } from "drizzle-orm";

export default async function HeroSection() {
  const [hero] = await db.select().from(heroConfig).where(eq(heroConfig.id, 1));

  if (!hero) return null;

  return (
    <section
      id="hero"
      className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-surface"
    >
      <div className="md:col-span-7 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-highest text-xs uppercase tracking-[0.2em] font-bold">
          <span
            className={`w-2 h-2 rounded-full animate-pulse ${
              hero.isAvailable ? "bg-primary" : "bg-red-500"
            }`}
          />
          {hero.availabilityLabel}
        </div>

        <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter leading-[0.9] text-white">
          {hero.tagline}
        </h1>

        <p className="text-on-surface-variant max-w-lg text-sm leading-relaxed font-medium">
          {hero.bio}
        </p>

        <div className="flex gap-4 pt-4">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest text-outline mb-1">
              {hero.infraLabel}
            </span>
            <span className="font-mono text-sm text-primary">
              {hero.infraStack}
            </span>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest text-outline mb-1">
              {hero.coreLabel}
            </span>
            <span className="font-mono text-sm text-primary">
              {hero.coreStack}
            </span>
          </div>
        </div>
      </div>

      <div className="md:col-span-5 h-[400px] bg-surface-container-low overflow-hidden relative group">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdU8YMj_mDIpAdWkOkZ5ztGvPcDP3Cwy4JqvtRScmBw1qwZraLbZaIXNcmOaBXU2Sd8rwBGjVWHPzbCafPNFG2TW2r35nFgcksHFANehmC6_2-qlfWmhBK9XOC1PdZa3HIwXSouVgXnvPTBrDAmNHkawNhea58hqhjs4n2sNsVX9iVenV9MtslhmbAORzuzWbfbsyblMipdogjv0CzDXHZbRtCs7M8dbceBFxOOl_1d5HisoUfI2_bjEEblWOUSev_uSTLTL9Q5h8"
          alt="Abstract technical isometric grid representing server architecture"
          fill
          className="object-cover grayscale opacity-60 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />

        {/* Single Live Status panel — one is distinctive, two is template */}
        <div className="absolute top-6 left-6 right-6 p-4 glass-panel border border-white/10 z-20">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs font-mono text-white/60 uppercase tracking-widest">
              Live Status
            </span>
          </div>
          <div className="font-mono text-xs text-primary/90 leading-relaxed">
            <span className="text-primary">$</span> {hero.liveStatusText}
            <span className="inline-block w-1.5 h-3 bg-primary/50 ml-1 animate-pulse align-middle" />
          </div>
        </div>
      </div>
    </section>
  );
}

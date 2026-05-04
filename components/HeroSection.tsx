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
      className="relative max-w-7xl mx-auto px-8 pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden"
    >
      {hero.liveStatusText && (
        <div className="absolute inset-0 -z-10 opacity-40 pointer-events-none">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdU8YMj_mDIpAdWkOkZ5ztGvPcDP3Cwy4JqvtRScmBw1qwZraLbZaIXNcmOaBXU2Sd8rwBGjVWHPzbCafPNFG2TW2r35nFgcksHFANehmC6_2-qlfWmhBK9XOC1PdZa3HIwXSouVgXnvPTBrDAmNHkawNhea58hqhjs4n2sNsVX9iVenV9MtslhmbAORzuzWbfbsyblMipdogjv0CzDXHZbRtCs7M8dbceBFxOOl_1d5HisoUfI2_bjEEblWOUSev_uSTLTL9Q5h8"
            alt=""
            fill
            sizes="100vw"
            className="object-cover grayscale mix-blend-luminosity"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-10 items-end">
        <div className="md:col-span-9 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-highest text-[11px] uppercase tracking-[0.2em] font-bold">
            <span
              className={`w-2 h-2 rounded-full animate-pulse ${
                hero.isAvailable ? "bg-primary" : "bg-red-500"
              }`}
            />
            {hero.availabilityLabel}
          </div>

          <h1 className="font-headline text-[clamp(2.75rem,8vw,6rem)] font-extrabold tracking-[-0.04em] leading-[0.92] text-white max-w-5xl">
            {hero.tagline}
          </h1>

          <p className="text-on-surface-variant max-w-xl text-base leading-relaxed">
            {hero.bio}
          </p>
        </div>

        <div className="md:col-span-3 md:justify-self-end space-y-6 font-mono text-xs">
          <div className="space-y-1">
            <span className="block text-outline uppercase tracking-widest text-[10px]">
              {hero.infraLabel}
            </span>
            <span className="block text-white">{hero.infraStack}</span>
          </div>
          <div className="space-y-1">
            <span className="block text-outline uppercase tracking-widest text-[10px]">
              {hero.coreLabel}
            </span>
            <span className="block text-white">{hero.coreStack}</span>
          </div>
        </div>
      </div>

      {hero.liveStatusText && (
        <div className="mt-12 border-t border-white/10 pt-4 flex items-center gap-3 font-mono text-xs">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shrink-0" />
          <span className="text-outline uppercase tracking-widest shrink-0 hidden sm:inline">
            Live
          </span>
          <span className="text-on-surface-variant truncate">
            <span className="text-primary">$</span> {hero.liveStatusText}
            <span className="inline-block w-1.5 h-3 bg-primary/50 ml-1 animate-pulse align-middle" />
          </span>
        </div>
      )}
    </section>
  );
}

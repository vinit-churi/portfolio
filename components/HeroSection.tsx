import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-surface">
      <div className="md:col-span-7 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-highest text-[10px] uppercase tracking-[0.2em] font-bold">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          Available for complex scale
        </div>

        <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter leading-[0.9] text-white">
          Curiosity-driven engineering. Building for resilience and precision.
        </h1>

        <p className="text-on-surface-variant max-w-lg text-sm leading-relaxed font-medium">
          Specializing in low-latency infrastructure and distributed data
          orchestration. I architect systems that don&apos;t just function—they
          endure.
        </p>

        <div className="flex gap-4 pt-4">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest text-outline mb-1">
              Infrastructure
            </span>
            <span className="font-mono text-sm text-primary">
              AWS / K8s / Terraform
            </span>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest text-outline mb-1">
              Core Stack
            </span>
            <span className="font-mono text-sm text-primary">
              Go / Rust / PostgreSQL
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

        <div className="absolute bottom-6 left-6 right-6 p-4 glass-panel border border-white/10 z-20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-white/40 uppercase">
              Cluster Status
            </span>
            <span className="text-[10px] font-mono text-primary uppercase">
              All Systems Nominal
            </span>
          </div>
          <div className="mt-2 h-1 bg-white/5 w-full">
            <div className="h-full bg-primary w-4/5" />
          </div>
        </div>

        <div className="absolute top-6 left-6 right-6 p-4 glass-panel border border-white/10 z-20">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">
              Live Status
            </span>
          </div>
          <div className="font-mono text-[11px] text-primary/90 leading-relaxed">
            <span className="text-primary">$</span> Currently building:
            High-performance distributed key-value store in Rust
            <span className="inline-block w-1.5 h-3 bg-primary/50 ml-1 animate-pulse align-middle" />
          </div>
        </div>
      </div>
    </section>
  );
}

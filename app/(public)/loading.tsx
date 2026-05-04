export default function Loading() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-16">
      <div className="space-y-4 mb-12">
        <div className="h-3 w-24 bg-surface-container animate-pulse" />
        <div className="h-12 w-72 bg-surface-container animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-video bg-surface-container animate-pulse" />
            <div className="h-3 w-1/3 bg-surface-container animate-pulse" />
            <div className="h-5 w-5/6 bg-surface-container animate-pulse" />
            <div className="h-3 w-full bg-surface-container animate-pulse" />
          </div>
        ))}
      </div>
    </section>
  );
}

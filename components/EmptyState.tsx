export default function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="border border-dashed border-white/10 px-8 py-20 text-center">
      <p className="font-headline text-lg text-white mb-2">{title}</p>
      {hint && <p className="text-sm text-outline font-mono">{hint}</p>}
    </div>
  );
}

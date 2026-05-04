"use client";

import type { ReactNode } from "react";

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-mono text-outline uppercase tracking-widest block mb-1">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="text-[10px] font-mono text-outline mt-1">{hint}</p>
      )}
      {error && (
        <p className="text-[10px] font-mono text-error mt-1">{error}</p>
      )}
    </div>
  );
}

export function Input({
  value,
  onChange,
  type = "text",
  placeholder,
  disabled,
  required,
}: {
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      className="w-full bg-surface-container border border-white/10 px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
    />
  );
}

export function Textarea({
  value,
  onChange,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full bg-surface-container border border-white/10 px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-primary transition-colors resize-none"
    />
  );
}

export function Select<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: ReadonlyArray<{ label: string; value: T }>;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="w-full bg-surface-container border border-white/10 px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-primary transition-colors"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <span
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onClick={() => onChange(!checked)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onChange(!checked);
          }
        }}
        className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
          checked ? "bg-primary" : "bg-white/10"
        }`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </span>
      <span className="text-xs text-on-surface-variant font-mono">{label}</span>
    </label>
  );
}

export function SaveBtn({ onClick, loading, label = "Save" }: { onClick: () => void; loading: boolean; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="px-4 py-2 bg-primary text-background text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
    >
      {loading ? "Saving…" : label}
    </button>
  );
}

export function DeleteBtn({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="px-4 py-2 border border-red-500/30 text-red-400 text-xs font-mono uppercase tracking-widest hover:bg-red-500/10 transition-colors disabled:opacity-50"
    >
      {loading ? "…" : "Delete"}
    </button>
  );
}

export function SectionHeader({ title, onAdd }: { title: string; onAdd?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="font-headline text-xl font-bold text-white">{title}</h2>
      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          className="px-4 py-2 border border-white/10 text-xs font-mono text-outline hover:text-white hover:border-white/20 transition-colors uppercase tracking-widest"
        >
          + Add
        </button>
      )}
    </div>
  );
}

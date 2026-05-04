"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type HeroConfig = {
  id: number;
  availabilityLabel: string;
  isAvailable: boolean;
  tagline: string;
  bio: string;
  infraLabel: string;
  infraStack: string;
  coreLabel: string;
  coreStack: string;
  liveStatusText: string;
  clusterStatusText: string;
  clusterPercentage: number;
};

type Article = {
  id: number;
  date: string;
  tag: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  published: boolean;
  sortOrder: number;
};

type LedgerEntry = {
  id: number;
  date: string;
  title: string;
  description: string;
  active: boolean;
  sortOrder: number;
};

type Stat = {
  id: number;
  label: string;
  value: string;
  sortOrder: number;
};

type Role = {
  id: number;
  period: string;
  title: string;
  description: string;
  sortOrder: number;
};

type ExpertiseItem = {
  id: number;
  icon: string;
  title: string;
  description: string;
  tags: string;
  bg: string;
  sortOrder: number;
};

type Project = {
  id: number;
  title: string;
  description: string;
  tags: string;
  url: string | null;
  githubUrl: string | null;
  image: string;
  imageAlt: string;
  published: boolean;
  sortOrder: number;
};

type Research = {
  id: number;
  date: string;
  tag: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  published: boolean;
  sortOrder: number;
};

type PlaceholderWarning = { tab: string; warning: string };

type Props = {
  hero: HeroConfig | null;
  articles: Article[];
  ledger: LedgerEntry[];
  stats: Stat[];
  roles: Role[];
  expertise: ExpertiseItem[];
  projects: Project[];
  research: Research[];
  placeholderWarnings?: PlaceholderWarning[];
};

const TABS = ["Hero", "Articles", "Ledger", "Stats", "Roles", "Expertise", "Projects", "Research"] as const;
type Tab = (typeof TABS)[number];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-mono text-outline uppercase tracking-widest block mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ value, onChange, type = "text", placeholder }: {
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-surface-container border border-white/10 px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-primary transition-colors"
    />
  );
}

function Textarea({ value, onChange, rows = 3 }: {
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

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onClick={() => onChange(!checked)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onChange(!checked); } }}
        className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${checked ? "bg-primary" : "bg-white/10"}`}
      >
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
      </div>
      <span className="text-xs text-on-surface-variant font-mono">{label}</span>
    </label>
  );
}

function SaveBtn({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="px-4 py-2 bg-primary text-background text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
    >
      {loading ? "Saving..." : "Save"}
    </button>
  );
}

function DeleteBtn({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="px-4 py-2 border border-red-500/30 text-red-400 text-xs font-mono uppercase tracking-widest hover:bg-red-500/10 transition-colors disabled:opacity-50"
    >
      {loading ? "..." : "Delete"}
    </button>
  );
}

function SectionHeader({ title, onAdd }: { title: string; onAdd?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="font-headline text-xl font-bold text-white">{title}</h2>
      {onAdd && (
        <button
          onClick={onAdd}
          className="px-4 py-2 border border-white/10 text-xs font-mono text-outline hover:text-white hover:border-white/20 transition-colors uppercase tracking-widest"
        >
          + Add
        </button>
      )}
    </div>
  );
}

// ── Hero ───────────────────────────────────────────────
function HeroPanel({ hero }: { hero: HeroConfig | null }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState<HeroConfig>(
    hero ?? {
      id: 1,
      availabilityLabel: "",
      isAvailable: true,
      tagline: "",
      bio: "",
      infraLabel: "Infrastructure",
      infraStack: "",
      coreLabel: "Core Stack",
      coreStack: "",
      liveStatusText: "",
      clusterStatusText: "",
      clusterPercentage: 80,
    }
  );

  function set(key: keyof HeroConfig, value: string | boolean | number) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function save() {
    startTransition(async () => {
      await fetch("/api/hero", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      router.refresh();
    });
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <SectionHeader title="Hero Section" />
      <Toggle checked={form.isAvailable} onChange={(v) => set("isAvailable", v)} label="Available for work" />
      <Field label="Availability Label">
        <Input value={form.availabilityLabel} onChange={(v) => set("availabilityLabel", v)} placeholder="Available for complex scale" />
      </Field>
      <Field label="Tagline">
        <Textarea value={form.tagline} onChange={(v) => set("tagline", v)} rows={2} />
      </Field>
      <Field label="Bio">
        <Textarea value={form.bio} onChange={(v) => set("bio", v)} rows={3} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Infra Label">
          <Input value={form.infraLabel} onChange={(v) => set("infraLabel", v)} />
        </Field>
        <Field label="Infra Stack">
          <Input value={form.infraStack} onChange={(v) => set("infraStack", v)} placeholder="AWS / K8s / Terraform" />
        </Field>
        <Field label="Core Label">
          <Input value={form.coreLabel} onChange={(v) => set("coreLabel", v)} />
        </Field>
        <Field label="Core Stack">
          <Input value={form.coreStack} onChange={(v) => set("coreStack", v)} placeholder="Go / Rust / PostgreSQL" />
        </Field>
      </div>
      <Field label="Live Status Text">
        <Input value={form.liveStatusText} onChange={(v) => set("liveStatusText", v)} placeholder="Currently building: ..." />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Cluster Status Text">
          <Input value={form.clusterStatusText} onChange={(v) => set("clusterStatusText", v)} placeholder="All Systems Nominal" />
        </Field>
        <Field label="Cluster % (0-100)">
          <Input value={form.clusterPercentage} onChange={(v) => set("clusterPercentage", Number(v))} type="number" />
        </Field>
      </div>
      <SaveBtn onClick={save} loading={pending} />
    </div>
  );
}

// ── Articles ───────────────────────────────────────────
const BLANK_ARTICLE: Omit<Article, "id"> = {
  date: "", tag: "", title: "", excerpt: "", image: "", imageAlt: "", published: true, sortOrder: 0,
};

function ArticleRow({ article, onSaved, onDeleted }: {
  article: Article;
  onSaved: () => void;
  onDeleted: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(article);
  const [savePending, startSave] = useTransition();
  const [delPending, startDel] = useTransition();

  function set(key: keyof Article, value: string | boolean | number) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function save() {
    startSave(async () => {
      await fetch(`/api/articles/${article.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      onSaved();
    });
  }

  function del() {
    if (!window.confirm("Delete this item? This cannot be undone.")) return;
    startDel(async () => {
      await fetch(`/api/articles/${article.id}`, { method: "DELETE" });
      onDeleted();
    });
  }

  return (
    <div className="border border-white/5 bg-surface-container">
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/[0.02]"
        onClick={() => setOpen((o) => !o)}
      >
        <div>
          <span className="text-xs font-mono text-outline mr-3">{form.date}</span>
          <span className="text-sm text-white font-medium">{form.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono uppercase px-2 py-0.5 ${form.published ? "bg-primary/10 text-primary" : "bg-white/5 text-outline"}`}>
            {form.published ? "live" : "draft"}
          </span>
          <span className="text-outline text-xs">{open ? "▲" : "▼"}</span>
        </div>
      </div>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date"><Input value={form.date} onChange={(v) => set("date", v)} /></Field>
            <Field label="Tag"><Input value={form.tag} onChange={(v) => set("tag", v)} /></Field>
          </div>
          <Field label="Title"><Input value={form.title} onChange={(v) => set("title", v)} /></Field>
          <Field label="Excerpt"><Textarea value={form.excerpt} onChange={(v) => set("excerpt", v)} /></Field>
          <Field label="Image URL"><Input value={form.image} onChange={(v) => set("image", v)} /></Field>
          <Field label="Image Alt"><Input value={form.imageAlt} onChange={(v) => set("imageAlt", v)} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Sort Order"><Input value={form.sortOrder} onChange={(v) => set("sortOrder", Number(v))} type="number" /></Field>
          </div>
          <Toggle checked={form.published} onChange={(v) => set("published", v)} label="Published" />
          <div className="flex gap-3 pt-2">
            <SaveBtn onClick={save} loading={savePending} />
            <DeleteBtn onClick={del} loading={delPending} />
          </div>
        </div>
      )}
    </div>
  );
}

function ArticlesPanel({ initial }: { initial: Article[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [adding, setAdding] = useState(false);
  const [newForm, setNewForm] = useState({ ...BLANK_ARTICLE });
  const [addPending, startAdd] = useTransition();

  function setNew(key: keyof typeof BLANK_ARTICLE, value: string | boolean | number) {
    setNewForm((f) => ({ ...f, [key]: value }));
  }

  function add() {
    startAdd(async () => {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newForm),
      });
      const created = await res.json();
      setItems((i) => [...i, created]);
      setAdding(false);
      setNewForm({ ...BLANK_ARTICLE });
    });
  }

  return (
    <div className="space-y-4">
      <SectionHeader title="Journal Articles" onAdd={() => setAdding(true)} />

      {adding && (
        <div className="border border-primary/20 bg-surface-container p-4 space-y-3">
          <p className="text-xs font-mono text-primary uppercase tracking-widest mb-3">New Article</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date"><Input value={newForm.date} onChange={(v) => setNew("date", v)} placeholder="May 10, 2024" /></Field>
            <Field label="Tag"><Input value={newForm.tag} onChange={(v) => setNew("tag", v)} /></Field>
          </div>
          <Field label="Title"><Input value={newForm.title} onChange={(v) => setNew("title", v)} /></Field>
          <Field label="Excerpt"><Textarea value={newForm.excerpt} onChange={(v) => setNew("excerpt", v)} /></Field>
          <Field label="Image URL"><Input value={newForm.image} onChange={(v) => setNew("image", v)} /></Field>
          <Field label="Image Alt"><Input value={newForm.imageAlt} onChange={(v) => setNew("imageAlt", v)} /></Field>
          <Toggle checked={newForm.published} onChange={(v) => setNew("published", v)} label="Published" />
          <div className="flex gap-3 pt-2">
            <SaveBtn onClick={add} loading={addPending} />
            <button onClick={() => setAdding(false)} className="px-4 py-2 text-xs font-mono text-outline hover:text-white transition-colors uppercase">Cancel</button>
          </div>
        </div>
      )}

      {items.map((a) => (
        <ArticleRow
          key={a.id}
          article={a}
          onSaved={() => router.refresh()}
          onDeleted={() => setItems((i) => i.filter((x) => x.id !== a.id))}
        />
      ))}
    </div>
  );
}

// ── Ledger ─────────────────────────────────────────────
const BLANK_LEDGER: Omit<LedgerEntry, "id"> = { date: "", title: "", description: "", active: false, sortOrder: 0 };

function LedgerRow({ entry, onSaved, onDeleted }: { entry: LedgerEntry; onSaved: () => void; onDeleted: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setFormState] = useState(entry);
  const [savePending, startSave] = useTransition();
  const [delPending, startDel] = useTransition();

  function set(key: keyof LedgerEntry, value: string | boolean | number) {
    setFormState((f) => ({ ...f, [key]: value }));
  }

  function save() {
    startSave(async () => {
      await fetch(`/api/ledger/${entry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      onSaved();
    });
  }

  function del() {
    if (!window.confirm("Delete this item? This cannot be undone.")) return;
    startDel(async () => {
      await fetch(`/api/ledger/${entry.id}`, { method: "DELETE" });
      onDeleted();
    });
  }

  return (
    <div className="border border-white/5 bg-surface-container">
      <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/[0.02]" onClick={() => setOpen((o) => !o)}>
        <div>
          <span className="text-xs font-mono text-outline mr-3">{form.date}</span>
          <span className="text-sm text-white">{form.title}</span>
        </div>
        <div className="flex items-center gap-2">
          {form.active && <span className="w-2 h-2 bg-primary rounded-full" />}
          <span className="text-outline text-xs">{open ? "▲" : "▼"}</span>
        </div>
      </div>
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date"><Input value={form.date} onChange={(v) => set("date", v)} /></Field>
            <Field label="Sort Order"><Input value={form.sortOrder} onChange={(v) => set("sortOrder", Number(v))} type="number" /></Field>
          </div>
          <Field label="Title"><Input value={form.title} onChange={(v) => set("title", v)} /></Field>
          <Field label="Description"><Textarea value={form.description} onChange={(v) => set("description", v)} /></Field>
          <Toggle checked={form.active} onChange={(v) => set("active", v)} label="Active (highlighted)" />
          <div className="flex gap-3 pt-2">
            <SaveBtn onClick={save} loading={savePending} />
            <DeleteBtn onClick={del} loading={delPending} />
          </div>
        </div>
      )}
    </div>
  );
}

function LedgerPanel({ initial }: { initial: LedgerEntry[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [adding, setAdding] = useState(false);
  const [newForm, setNewForm] = useState({ ...BLANK_LEDGER });
  const [addPending, startAdd] = useTransition();

  function setNew(key: keyof typeof BLANK_LEDGER, value: string | boolean | number) {
    setNewForm((f) => ({ ...f, [key]: value }));
  }

  function add() {
    startAdd(async () => {
      const res = await fetch("/api/ledger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newForm),
      });
      const created = await res.json();
      setItems((i) => [...i, created]);
      setAdding(false);
      setNewForm({ ...BLANK_LEDGER });
    });
  }

  return (
    <div className="space-y-4">
      <SectionHeader title="Activity Ledger" onAdd={() => setAdding(true)} />
      {adding && (
        <div className="border border-primary/20 bg-surface-container p-4 space-y-3">
          <p className="text-xs font-mono text-primary uppercase tracking-widest mb-3">New Entry</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date"><Input value={newForm.date} onChange={(v) => setNew("date", v)} placeholder="2024-05-12" /></Field>
          </div>
          <Field label="Title"><Input value={newForm.title} onChange={(v) => setNew("title", v)} /></Field>
          <Field label="Description"><Textarea value={newForm.description} onChange={(v) => setNew("description", v)} /></Field>
          <Toggle checked={newForm.active} onChange={(v) => setNew("active", v)} label="Active" />
          <div className="flex gap-3 pt-2">
            <SaveBtn onClick={add} loading={addPending} />
            <button onClick={() => setAdding(false)} className="px-4 py-2 text-xs font-mono text-outline hover:text-white transition-colors uppercase">Cancel</button>
          </div>
        </div>
      )}
      {items.map((e) => (
        <LedgerRow key={e.id} entry={e} onSaved={() => router.refresh()} onDeleted={() => setItems((i) => i.filter((x) => x.id !== e.id))} />
      ))}
    </div>
  );
}

// ── Stats ──────────────────────────────────────────────
function StatsPanel({ initial }: { initial: Stat[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [adding, setAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("");
  const [addPending, startAdd] = useTransition();
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Stat | null>(null);
  const [savePending, startSave] = useTransition();
  const [delPending, startDel] = useTransition();

  function add() {
    startAdd(async () => {
      const res = await fetch("/api/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newLabel, value: newValue, sortOrder: items.length }),
      });
      const created = await res.json();
      setItems((i) => [...i, created]);
      setAdding(false);
      setNewLabel(""); setNewValue("");
    });
  }

  function startEdit(s: Stat) { setEditId(s.id); setEditForm({ ...s }); }

  function saveEdit() {
    if (!editForm) return;
    startSave(async () => {
      await fetch(`/api/stats/${editForm.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      setItems((i) => i.map((x) => x.id === editForm.id ? editForm : x));
      setEditId(null);
      router.refresh();
    });
  }

  function del(id: number) {
    if (!window.confirm("Delete this item? This cannot be undone.")) return;
    startDel(async () => {
      await fetch(`/api/stats/${id}`, { method: "DELETE" });
      setItems((i) => i.filter((x) => x.id !== id));
    });
  }

  return (
    <div className="space-y-4 max-w-lg">
      <SectionHeader title="Activity Stats" onAdd={() => setAdding(true)} />
      {adding && (
        <div className="border border-primary/20 bg-surface-container p-4 space-y-3">
          <p className="text-xs font-mono text-primary uppercase tracking-widest mb-3">New Stat</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Label"><Input value={newLabel} onChange={setNewLabel} placeholder="Uptime Commit" /></Field>
            <Field label="Value"><Input value={newValue} onChange={setNewValue} placeholder="99.98%" /></Field>
          </div>
          <div className="flex gap-3 pt-2">
            <SaveBtn onClick={add} loading={addPending} />
            <button onClick={() => setAdding(false)} className="px-4 py-2 text-xs font-mono text-outline hover:text-white transition-colors uppercase">Cancel</button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        {items.map((s) => (
          <div key={s.id} className="border border-white/5 bg-surface-container p-4">
            {editId === s.id && editForm ? (
              <div className="space-y-2">
                <Field label="Label"><Input value={editForm.label} onChange={(v) => setEditForm((f) => f ? { ...f, label: v } : f)} /></Field>
                <Field label="Value"><Input value={editForm.value} onChange={(v) => setEditForm((f) => f ? { ...f, value: v } : f)} /></Field>
                <div className="flex gap-2 pt-1">
                  <SaveBtn onClick={saveEdit} loading={savePending} />
                  <button onClick={() => setEditId(null)} className="text-xs font-mono text-outline hover:text-white">Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <span className="text-xs text-outline uppercase tracking-widest font-bold block">{s.label}</span>
                <span className="text-xl font-headline font-extrabold text-white">{s.value}</span>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => startEdit(s)} className="text-xs font-mono text-outline hover:text-white uppercase tracking-widest">Edit</button>
                  <button onClick={() => del(s.id)} disabled={delPending} className="text-xs font-mono text-red-400/60 hover:text-red-400 uppercase tracking-widest">Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Roles ──────────────────────────────────────────────
const BLANK_ROLE: Omit<Role, "id"> = { period: "", title: "", description: "", sortOrder: 0 };

function RoleRow({ role, onSaved, onDeleted }: { role: Role; onSaved: () => void; onDeleted: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setFormState] = useState(role);
  const [savePending, startSave] = useTransition();
  const [delPending, startDel] = useTransition();

  function set(key: keyof Role, value: string | number) { setFormState((f) => ({ ...f, [key]: value })); }

  function save() {
    startSave(async () => {
      await fetch(`/api/roles/${role.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      onSaved();
    });
  }

  function del() {
    if (!window.confirm("Delete this item? This cannot be undone.")) return;
    startDel(async () => {
      await fetch(`/api/roles/${role.id}`, { method: "DELETE" });
      onDeleted();
    });
  }

  return (
    <div className="border border-white/5 bg-surface-container">
      <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/[0.02]" onClick={() => setOpen((o) => !o)}>
        <div>
          <span className="text-xs font-mono text-outline mr-3">{form.period}</span>
          <span className="text-sm text-white">{form.title}</span>
        </div>
        <span className="text-outline text-xs">{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-4">
          <Field label="Period"><Input value={form.period} onChange={(v) => set("period", v)} placeholder="2021 — PRESENT" /></Field>
          <Field label="Title"><Input value={form.title} onChange={(v) => set("title", v)} /></Field>
          <Field label="Description"><Textarea value={form.description} onChange={(v) => set("description", v)} rows={4} /></Field>
          <Field label="Sort Order"><Input value={form.sortOrder} onChange={(v) => set("sortOrder", Number(v))} type="number" /></Field>
          <div className="flex gap-3 pt-2">
            <SaveBtn onClick={save} loading={savePending} />
            <DeleteBtn onClick={del} loading={delPending} />
          </div>
        </div>
      )}
    </div>
  );
}

function RolesPanel({ initial }: { initial: Role[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [adding, setAdding] = useState(false);
  const [newForm, setNewForm] = useState({ ...BLANK_ROLE });
  const [addPending, startAdd] = useTransition();

  function setNew(key: keyof typeof BLANK_ROLE, value: string | number) { setNewForm((f) => ({ ...f, [key]: value })); }

  function add() {
    startAdd(async () => {
      const res = await fetch("/api/roles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newForm) });
      const created = await res.json();
      setItems((i) => [...i, created]);
      setAdding(false);
      setNewForm({ ...BLANK_ROLE });
    });
  }

  return (
    <div className="space-y-4">
      <SectionHeader title="Work Roles" onAdd={() => setAdding(true)} />
      {adding && (
        <div className="border border-primary/20 bg-surface-container p-4 space-y-3">
          <p className="text-xs font-mono text-primary uppercase tracking-widest mb-3">New Role</p>
          <Field label="Period"><Input value={newForm.period} onChange={(v) => setNew("period", v)} placeholder="2021 — PRESENT" /></Field>
          <Field label="Title"><Input value={newForm.title} onChange={(v) => setNew("title", v)} /></Field>
          <Field label="Description"><Textarea value={newForm.description} onChange={(v) => setNew("description", v)} rows={4} /></Field>
          <div className="flex gap-3 pt-2">
            <SaveBtn onClick={add} loading={addPending} />
            <button onClick={() => setAdding(false)} className="px-4 py-2 text-xs font-mono text-outline hover:text-white transition-colors uppercase">Cancel</button>
          </div>
        </div>
      )}
      {items.map((r) => (
        <RoleRow key={r.id} role={r} onSaved={() => router.refresh()} onDeleted={() => setItems((i) => i.filter((x) => x.id !== r.id))} />
      ))}
    </div>
  );
}

// ── Expertise ──────────────────────────────────────────
const BLANK_EXPERTISE: Omit<ExpertiseItem, "id"> = { icon: "", title: "", description: "", tags: "[]", bg: "bg-surface", sortOrder: 0 };

function ExpertiseRow({ item, onSaved, onDeleted }: { item: ExpertiseItem; onSaved: () => void; onDeleted: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setFormState] = useState(item);
  const [tagsStr, setTagsStr] = useState(() => {
    try { return JSON.parse(item.tags).join(", "); } catch { return ""; }
  });
  const [savePending, startSave] = useTransition();
  const [delPending, startDel] = useTransition();

  function set(key: keyof ExpertiseItem, value: string | number) { setFormState((f) => ({ ...f, [key]: value })); }

  function save() {
    const tags = JSON.stringify(tagsStr.split(",").map((t: string) => t.trim()).filter(Boolean));
    const payload = { ...form, tags };
    startSave(async () => {
      await fetch(`/api/expertise/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      onSaved();
    });
  }

  function del() {
    if (!window.confirm("Delete this item? This cannot be undone.")) return;
    startDel(async () => {
      await fetch(`/api/expertise/${item.id}`, { method: "DELETE" });
      onDeleted();
    });
  }

  return (
    <div className="border border-white/5 bg-surface-container">
      <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/[0.02]" onClick={() => setOpen((o) => !o)}>
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-sm text-primary">{form.icon}</span>
          <span className="text-sm text-white">{form.title}</span>
        </div>
        <span className="text-outline text-xs">{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Icon (Material Symbol)"><Input value={form.icon} onChange={(v) => set("icon", v)} placeholder="hub" /></Field>
            <Field label="Title"><Input value={form.title} onChange={(v) => set("title", v)} /></Field>
          </div>
          <Field label="Description"><Textarea value={form.description} onChange={(v) => set("description", v)} /></Field>
          <Field label="Tags (comma-separated)"><Input value={tagsStr} onChange={setTagsStr} placeholder="Raft, Kafka" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="BG Class"><Input value={form.bg} onChange={(v) => set("bg", v)} placeholder="bg-surface" /></Field>
            <Field label="Sort Order"><Input value={form.sortOrder} onChange={(v) => set("sortOrder", Number(v))} type="number" /></Field>
          </div>
          <div className="flex gap-3 pt-2">
            <SaveBtn onClick={save} loading={savePending} />
            <DeleteBtn onClick={del} loading={delPending} />
          </div>
        </div>
      )}
    </div>
  );
}

function ExpertisePanel({ initial }: { initial: ExpertiseItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [adding, setAdding] = useState(false);
  const [newForm, setNewForm] = useState({ ...BLANK_EXPERTISE });
  const [newTagsStr, setNewTagsStr] = useState("");
  const [addPending, startAdd] = useTransition();

  function setNew(key: keyof typeof BLANK_EXPERTISE, value: string | number) { setNewForm((f) => ({ ...f, [key]: value })); }

  function add() {
    const tags = JSON.stringify(newTagsStr.split(",").map((t: string) => t.trim()).filter(Boolean));
    startAdd(async () => {
      const res = await fetch("/api/expertise", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...newForm, tags }) });
      const created = await res.json();
      setItems((i) => [...i, created]);
      setAdding(false);
      setNewForm({ ...BLANK_EXPERTISE });
      setNewTagsStr("");
    });
  }

  return (
    <div className="space-y-4">
      <SectionHeader title="Expertise Items" onAdd={() => setAdding(true)} />
      {adding && (
        <div className="border border-primary/20 bg-surface-container p-4 space-y-3">
          <p className="text-xs font-mono text-primary uppercase tracking-widest mb-3">New Item</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Icon"><Input value={newForm.icon} onChange={(v) => setNew("icon", v)} placeholder="hub" /></Field>
            <Field label="Title"><Input value={newForm.title} onChange={(v) => setNew("title", v)} /></Field>
          </div>
          <Field label="Description"><Textarea value={newForm.description} onChange={(v) => setNew("description", v)} /></Field>
          <Field label="Tags (comma-separated)"><Input value={newTagsStr} onChange={setNewTagsStr} placeholder="Raft, Kafka" /></Field>
          <div className="flex gap-3 pt-2">
            <SaveBtn onClick={add} loading={addPending} />
            <button onClick={() => setAdding(false)} className="px-4 py-2 text-xs font-mono text-outline hover:text-white transition-colors uppercase">Cancel</button>
          </div>
        </div>
      )}
      {items.map((e) => (
        <ExpertiseRow key={e.id} item={e} onSaved={() => router.refresh()} onDeleted={() => setItems((i) => i.filter((x) => x.id !== e.id))} />
      ))}
    </div>
  );
}

// ── Projects ───────────────────────────────────────────
const BLANK_PROJECT: Omit<Project, "id"> = { title: "", description: "", tags: "[]", url: null, githubUrl: null, image: "", imageAlt: "", published: true, sortOrder: 0 };

function ProjectRow({ project, onSaved, onDeleted }: { project: Project; onSaved: () => void; onDeleted: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setFormState] = useState(project);
  const [tagsStr, setTagsStr] = useState(() => { try { return JSON.parse(project.tags).join(", "); } catch { return ""; } });
  const [savePending, startSave] = useTransition();
  const [delPending, startDel] = useTransition();

  function set(key: keyof Project, value: string | boolean | number | null) { setFormState((f) => ({ ...f, [key]: value })); }

  function save() {
    const tags = JSON.stringify(tagsStr.split(",").map((t: string) => t.trim()).filter(Boolean));
    startSave(async () => {
      await fetch(`/api/projects/${project.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, tags }) });
      onSaved();
    });
  }

  function del() {
    if (!window.confirm("Delete this item? This cannot be undone.")) return;
    startDel(async () => {
      await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
      onDeleted();
    });
  }

  return (
    <div className="border border-white/5 bg-surface-container">
      <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/[0.02]" onClick={() => setOpen((o) => !o)}>
        <div>
          <span className="text-sm text-white">{form.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono uppercase px-2 py-0.5 ${form.published ? "bg-primary/10 text-primary" : "bg-white/5 text-outline"}`}>
            {form.published ? "live" : "draft"}
          </span>
          <span className="text-outline text-xs">{open ? "▲" : "▼"}</span>
        </div>
      </div>
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-4">
          <Field label="Title"><Input value={form.title} onChange={(v) => set("title", v)} /></Field>
          <Field label="Description"><Textarea value={form.description} onChange={(v) => set("description", v)} rows={4} /></Field>
          <Field label="Tags (comma-separated)"><Input value={tagsStr} onChange={setTagsStr} placeholder="Rust, Distributed Systems" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="GitHub URL"><Input value={form.githubUrl ?? ""} onChange={(v) => set("githubUrl", v || null)} /></Field>
            <Field label="Live URL"><Input value={form.url ?? ""} onChange={(v) => set("url", v || null)} /></Field>
          </div>
          <Field label="Image URL"><Input value={form.image} onChange={(v) => set("image", v)} /></Field>
          <Field label="Image Alt"><Input value={form.imageAlt} onChange={(v) => set("imageAlt", v)} /></Field>
          <Field label="Sort Order"><Input value={form.sortOrder} onChange={(v) => set("sortOrder", Number(v))} type="number" /></Field>
          <Toggle checked={form.published} onChange={(v) => set("published", v)} label="Published" />
          <div className="flex gap-3 pt-2">
            <SaveBtn onClick={save} loading={savePending} />
            <DeleteBtn onClick={del} loading={delPending} />
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectsPanel({ initial }: { initial: Project[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [adding, setAdding] = useState(false);
  const [newForm, setNewForm] = useState({ ...BLANK_PROJECT });
  const [newTagsStr, setNewTagsStr] = useState("");
  const [addPending, startAdd] = useTransition();

  function setNew(key: keyof typeof BLANK_PROJECT, value: string | boolean | number | null) { setNewForm((f) => ({ ...f, [key]: value })); }

  function add() {
    const tags = JSON.stringify(newTagsStr.split(",").map((t: string) => t.trim()).filter(Boolean));
    startAdd(async () => {
      const res = await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...newForm, tags }) });
      const created = await res.json();
      setItems((i) => [...i, created]);
      setAdding(false);
      setNewForm({ ...BLANK_PROJECT });
      setNewTagsStr("");
    });
  }

  return (
    <div className="space-y-4">
      <SectionHeader title="Projects" onAdd={() => setAdding(true)} />
      {adding && (
        <div className="border border-primary/20 bg-surface-container p-4 space-y-3">
          <p className="text-xs font-mono text-primary uppercase tracking-widest mb-3">New Project</p>
          <Field label="Title"><Input value={newForm.title} onChange={(v) => setNew("title", v)} /></Field>
          <Field label="Description"><Textarea value={newForm.description} onChange={(v) => setNew("description", v)} rows={4} /></Field>
          <Field label="Tags (comma-separated)"><Input value={newTagsStr} onChange={setNewTagsStr} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="GitHub URL"><Input value={newForm.githubUrl ?? ""} onChange={(v) => setNew("githubUrl", v || null)} /></Field>
            <Field label="Live URL"><Input value={newForm.url ?? ""} onChange={(v) => setNew("url", v || null)} /></Field>
          </div>
          <Toggle checked={newForm.published} onChange={(v) => setNew("published", v)} label="Published" />
          <div className="flex gap-3 pt-2">
            <SaveBtn onClick={add} loading={addPending} />
            <button onClick={() => setAdding(false)} className="px-4 py-2 text-xs font-mono text-outline hover:text-white transition-colors uppercase">Cancel</button>
          </div>
        </div>
      )}
      {items.map((p) => (
        <ProjectRow key={p.id} project={p} onSaved={() => router.refresh()} onDeleted={() => setItems((i) => i.filter((x) => x.id !== p.id))} />
      ))}
    </div>
  );
}

// ── Research ───────────────────────────────────────────
const BLANK_RESEARCH: Omit<Research, "id"> = { date: "", tag: "", title: "", excerpt: "", image: "", imageAlt: "", published: true, sortOrder: 0 };

function ResearchRow({ entry, onSaved, onDeleted }: { entry: Research; onSaved: () => void; onDeleted: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setFormState] = useState(entry);
  const [savePending, startSave] = useTransition();
  const [delPending, startDel] = useTransition();

  function set(key: keyof Research, value: string | boolean | number) { setFormState((f) => ({ ...f, [key]: value })); }

  function save() {
    startSave(async () => {
      await fetch(`/api/research/${entry.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      onSaved();
    });
  }

  function del() {
    if (!window.confirm("Delete this item? This cannot be undone.")) return;
    startDel(async () => {
      await fetch(`/api/research/${entry.id}`, { method: "DELETE" });
      onDeleted();
    });
  }

  return (
    <div className="border border-white/5 bg-surface-container">
      <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/[0.02]" onClick={() => setOpen((o) => !o)}>
        <div>
          <span className="text-xs font-mono text-outline mr-3">{form.date}</span>
          <span className="text-sm text-white">{form.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono uppercase px-2 py-0.5 ${form.published ? "bg-primary/10 text-primary" : "bg-white/5 text-outline"}`}>
            {form.published ? "live" : "draft"}
          </span>
          <span className="text-outline text-xs">{open ? "▲" : "▼"}</span>
        </div>
      </div>
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date"><Input value={form.date} onChange={(v) => set("date", v)} placeholder="May 10, 2024" /></Field>
            <Field label="Tag"><Input value={form.tag} onChange={(v) => set("tag", v)} /></Field>
          </div>
          <Field label="Title"><Input value={form.title} onChange={(v) => set("title", v)} /></Field>
          <Field label="Excerpt"><Textarea value={form.excerpt} onChange={(v) => set("excerpt", v)} /></Field>
          <Field label="Image URL"><Input value={form.image} onChange={(v) => set("image", v)} /></Field>
          <Field label="Image Alt"><Input value={form.imageAlt} onChange={(v) => set("imageAlt", v)} /></Field>
          <Field label="Sort Order"><Input value={form.sortOrder} onChange={(v) => set("sortOrder", Number(v))} type="number" /></Field>
          <Toggle checked={form.published} onChange={(v) => set("published", v)} label="Published" />
          <div className="flex gap-3 pt-2">
            <SaveBtn onClick={save} loading={savePending} />
            <DeleteBtn onClick={del} loading={delPending} />
          </div>
        </div>
      )}
    </div>
  );
}

function ResearchPanel({ initial }: { initial: Research[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [adding, setAdding] = useState(false);
  const [newForm, setNewForm] = useState({ ...BLANK_RESEARCH });
  const [addPending, startAdd] = useTransition();

  function setNew(key: keyof typeof BLANK_RESEARCH, value: string | boolean | number) { setNewForm((f) => ({ ...f, [key]: value })); }

  function add() {
    startAdd(async () => {
      const res = await fetch("/api/research", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newForm) });
      const created = await res.json();
      setItems((i) => [...i, created]);
      setAdding(false);
      setNewForm({ ...BLANK_RESEARCH });
    });
  }

  return (
    <div className="space-y-4">
      <SectionHeader title="Research Entries" onAdd={() => setAdding(true)} />
      {adding && (
        <div className="border border-primary/20 bg-surface-container p-4 space-y-3">
          <p className="text-xs font-mono text-primary uppercase tracking-widest mb-3">New Research</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date"><Input value={newForm.date} onChange={(v) => setNew("date", v)} placeholder="May 10, 2024" /></Field>
            <Field label="Tag"><Input value={newForm.tag} onChange={(v) => setNew("tag", v)} /></Field>
          </div>
          <Field label="Title"><Input value={newForm.title} onChange={(v) => setNew("title", v)} /></Field>
          <Field label="Excerpt"><Textarea value={newForm.excerpt} onChange={(v) => setNew("excerpt", v)} /></Field>
          <Field label="Image URL"><Input value={newForm.image} onChange={(v) => setNew("image", v)} /></Field>
          <Field label="Image Alt"><Input value={newForm.imageAlt} onChange={(v) => setNew("imageAlt", v)} /></Field>
          <Toggle checked={newForm.published} onChange={(v) => setNew("published", v)} label="Published" />
          <div className="flex gap-3 pt-2">
            <SaveBtn onClick={add} loading={addPending} />
            <button onClick={() => setAdding(false)} className="px-4 py-2 text-xs font-mono text-outline hover:text-white transition-colors uppercase">Cancel</button>
          </div>
        </div>
      )}
      {items.map((e) => (
        <ResearchRow key={e.id} entry={e} onSaved={() => router.refresh()} onDeleted={() => setItems((i) => i.filter((x) => x.id !== e.id))} />
      ))}
    </div>
  );
}

// ── Root ───────────────────────────────────────────────
export default function AdminClient(props: Props) {
  const [tab, setTab] = useState<Tab>("Hero");
  const activeWarning = props.placeholderWarnings?.find((w) => w.tab === tab);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-headline text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-xs text-outline font-mono">Manage portfolio content</p>
      </div>

      <div className="flex gap-1 mb-0 border-b border-white/5 pb-0 overflow-x-auto">
        {TABS.map((t) => {
          const hasWarning = props.placeholderWarnings?.some((w) => w.tab === t);
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-4 py-2.5 text-xs font-mono uppercase tracking-widest whitespace-nowrap transition-colors border-b-2 -mb-px ${
                tab === t
                  ? "text-white border-primary"
                  : "text-outline border-transparent hover:text-white hover:border-white/20"
              }`}
            >
              {t}
              {hasWarning && (
                <span className="absolute top-1.5 right-1 w-1.5 h-1.5 bg-yellow-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {activeWarning && (
        <div className="flex items-start gap-3 border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 mb-6 mt-4">
          <span className="text-yellow-500 text-xs font-mono uppercase tracking-widest shrink-0">
            Placeholder
          </span>
          <p className="text-xs text-yellow-400/80 font-mono">{activeWarning.warning}</p>
        </div>
      )}

      <div className="mt-6">
        {tab === "Hero" && <HeroPanel hero={props.hero} />}
        {tab === "Articles" && <ArticlesPanel initial={props.articles} />}
        {tab === "Ledger" && <LedgerPanel initial={props.ledger} />}
        {tab === "Stats" && <StatsPanel initial={props.stats} />}
        {tab === "Roles" && <RolesPanel initial={props.roles} />}
        {tab === "Expertise" && <ExpertisePanel initial={props.expertise} />}
        {tab === "Projects" && <ProjectsPanel initial={props.projects} />}
        {tab === "Research" && <ResearchPanel initial={props.research} />}
      </div>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Field,
  Input,
  Textarea,
  Toggle,
  SaveBtn,
  DeleteBtn,
  SectionHeader,
} from "@/components/admin/ui";
import ContentPanel, {
  type JournalLike,
  type ProjectLike,
} from "@/components/admin/ContentPanel";
import { iconFor, ICON_OPTIONS } from "@/lib/icons";

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

type LedgerEntry = {
  id: number;
  date: string;
  title: string;
  description: string;
  active: boolean;
  sortOrder: number;
};

type Stat = { id: number; label: string; value: string; sortOrder: number };

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

type PlaceholderWarning = { tab: string; warning: string };

type Props = {
  hero: HeroConfig | null;
  articles: JournalLike[];
  ledger: LedgerEntry[];
  stats: Stat[];
  roles: Role[];
  expertise: ExpertiseItem[];
  projects: ProjectLike[];
  research: JournalLike[];
  placeholderWarnings?: PlaceholderWarning[];
};

const TABS = [
  "Hero",
  "Journal",
  "Research",
  "Projects",
  "Ledger",
  "Stats",
  "Roles",
  "Expertise",
] as const;
type Tab = (typeof TABS)[number];

async function api(url: string, init?: RequestInit) {
  const res = await fetch(url, init);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Request failed");
  }
  return res.json();
}

// ── Hero ─────────────────────────────────────────────────
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

  function set<K extends keyof HeroConfig>(key: K, value: HeroConfig[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function save() {
    startTransition(async () => {
      try {
        await api("/api/hero", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        toast.success("Hero saved");
        router.refresh();
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Save failed");
      }
    });
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <SectionHeader title="Hero Section" />
      <Toggle
        checked={form.isAvailable}
        onChange={(v) => set("isAvailable", v)}
        label="Available for work"
      />
      <Field label="Availability Label">
        <Input
          value={form.availabilityLabel}
          onChange={(v) => set("availabilityLabel", v)}
          placeholder="Available for complex scale"
        />
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
          <Input
            value={form.infraStack}
            onChange={(v) => set("infraStack", v)}
            placeholder="AWS / K8s / Terraform"
          />
        </Field>
        <Field label="Core Label">
          <Input value={form.coreLabel} onChange={(v) => set("coreLabel", v)} />
        </Field>
        <Field label="Core Stack">
          <Input
            value={form.coreStack}
            onChange={(v) => set("coreStack", v)}
            placeholder="Go / Rust / PostgreSQL"
          />
        </Field>
      </div>
      <Field label="Live Status Text">
        <Input
          value={form.liveStatusText}
          onChange={(v) => set("liveStatusText", v)}
          placeholder="Currently building: ..."
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Cluster Status Text">
          <Input
            value={form.clusterStatusText}
            onChange={(v) => set("clusterStatusText", v)}
            placeholder="All Systems Nominal"
          />
        </Field>
        <Field label="Cluster % (0-100)">
          <Input
            value={form.clusterPercentage}
            onChange={(v) => set("clusterPercentage", Number(v))}
            type="number"
          />
        </Field>
      </div>
      <SaveBtn onClick={save} loading={pending} />
    </div>
  );
}

// ── Ledger ───────────────────────────────────────────────
function LedgerRow({
  entry,
  onSaved,
  onDeleted,
}: {
  entry: LedgerEntry;
  onSaved: (e: LedgerEntry) => void;
  onDeleted: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(entry);
  const [savePending, startSave] = useTransition();
  const [delPending, startDel] = useTransition();

  function save() {
    startSave(async () => {
      try {
        const data = await api(`/api/ledger/${entry.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        toast.success("Saved");
        onSaved(data);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Save failed");
      }
    });
  }

  function del() {
    if (!window.confirm("Delete this item?")) return;
    startDel(async () => {
      try {
        await api(`/api/ledger/${entry.id}`, { method: "DELETE" });
        toast.success("Deleted");
        onDeleted();
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Delete failed");
      }
    });
  }

  return (
    <div className="border border-white/5 bg-surface-container">
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <div>
          <span className="text-xs font-mono text-outline mr-3">{form.date}</span>
          <span className="text-sm text-white">{form.title}</span>
        </div>
        <div className="flex items-center gap-2">
          {form.active && <span className="w-2 h-2 bg-primary rounded-full" />}
          <span className="text-outline text-xs">{open ? "▲" : "▼"}</span>
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date">
              <Input value={form.date} onChange={(v) => setForm((f) => ({ ...f, date: v }))} />
            </Field>
            <Field label="Sort Order">
              <Input
                value={form.sortOrder}
                onChange={(v) => setForm((f) => ({ ...f, sortOrder: Number(v) }))}
                type="number"
              />
            </Field>
          </div>
          <Field label="Title">
            <Input value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} />
          </Field>
          <Field label="Description">
            <Textarea
              value={form.description}
              onChange={(v) => setForm((f) => ({ ...f, description: v }))}
            />
          </Field>
          <Toggle
            checked={form.active}
            onChange={(v) => setForm((f) => ({ ...f, active: v }))}
            label="Active (highlighted)"
          />
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
  const [newForm, setNewForm] = useState<Omit<LedgerEntry, "id">>({
    date: "",
    title: "",
    description: "",
    active: false,
    sortOrder: 0,
  });
  const [addPending, startAdd] = useTransition();

  function add() {
    if (!newForm.title || !newForm.date) {
      toast.error("Date and title required");
      return;
    }
    startAdd(async () => {
      try {
        const created = await api("/api/ledger", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newForm),
        });
        setItems((i) => [...i, created]);
        toast.success("Added");
        setAdding(false);
        setNewForm({ date: "", title: "", description: "", active: false, sortOrder: 0 });
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Add failed");
      }
    });
  }

  return (
    <div className="space-y-4">
      <SectionHeader title="Activity Ledger" onAdd={() => setAdding(true)} />
      {adding && (
        <div className="border border-primary/20 bg-surface-container p-4 space-y-3">
          <p className="text-xs font-mono text-primary uppercase tracking-widest mb-3">
            New Entry
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date">
              <Input
                value={newForm.date}
                onChange={(v) => setNewForm((f) => ({ ...f, date: v }))}
                placeholder="2024-05-12"
              />
            </Field>
          </div>
          <Field label="Title">
            <Input
              value={newForm.title}
              onChange={(v) => setNewForm((f) => ({ ...f, title: v }))}
            />
          </Field>
          <Field label="Description">
            <Textarea
              value={newForm.description}
              onChange={(v) => setNewForm((f) => ({ ...f, description: v }))}
            />
          </Field>
          <Toggle
            checked={newForm.active}
            onChange={(v) => setNewForm((f) => ({ ...f, active: v }))}
            label="Active"
          />
          <div className="flex gap-3 pt-2">
            <SaveBtn onClick={add} loading={addPending} label="Create" />
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="px-4 py-2 text-xs font-mono text-outline hover:text-white transition-colors uppercase"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {items.map((e) => (
        <LedgerRow
          key={e.id}
          entry={e}
          onSaved={(updated) => {
            setItems((i) => i.map((x) => (x.id === updated.id ? updated : x)));
            router.refresh();
          }}
          onDeleted={() => {
            setItems((i) => i.filter((x) => x.id !== e.id));
            router.refresh();
          }}
        />
      ))}
    </div>
  );
}

// ── Stats ────────────────────────────────────────────────
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

  function add() {
    if (!newLabel.trim() || !newValue.trim()) {
      toast.error("Label and value required");
      return;
    }
    startAdd(async () => {
      try {
        const created = await api("/api/stats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ label: newLabel, value: newValue, sortOrder: items.length }),
        });
        setItems((i) => [...i, created]);
        toast.success("Added");
        setAdding(false);
        setNewLabel("");
        setNewValue("");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Add failed");
      }
    });
  }

  function startEdit(s: Stat) {
    setEditId(s.id);
    setEditForm({ ...s });
  }

  function saveEdit() {
    if (!editForm) return;
    startSave(async () => {
      try {
        await api(`/api/stats/${editForm.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        });
        setItems((i) => i.map((x) => (x.id === editForm.id ? editForm : x)));
        setEditId(null);
        toast.success("Saved");
        router.refresh();
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Save failed");
      }
    });
  }

  function del(id: number) {
    if (!window.confirm("Delete this item?")) return;
    (async () => {
      try {
        await api(`/api/stats/${id}`, { method: "DELETE" });
        setItems((i) => i.filter((x) => x.id !== id));
        toast.success("Deleted");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Delete failed");
      }
    })();
  }

  return (
    <div className="space-y-4 max-w-lg">
      <SectionHeader title="Activity Stats" onAdd={() => setAdding(true)} />
      {adding && (
        <div className="border border-primary/20 bg-surface-container p-4 space-y-3">
          <p className="text-xs font-mono text-primary uppercase tracking-widest mb-3">
            New Stat
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Label">
              <Input value={newLabel} onChange={setNewLabel} placeholder="Uptime Commit" />
            </Field>
            <Field label="Value">
              <Input value={newValue} onChange={setNewValue} placeholder="99.98%" />
            </Field>
          </div>
          <div className="flex gap-3 pt-2">
            <SaveBtn onClick={add} loading={addPending} label="Create" />
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="px-4 py-2 text-xs font-mono text-outline hover:text-white transition-colors uppercase"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        {items.map((s) => (
          <div key={s.id} className="border border-white/5 bg-surface-container p-4">
            {editId === s.id && editForm ? (
              <div className="space-y-2">
                <Field label="Label">
                  <Input
                    value={editForm.label}
                    onChange={(v) => setEditForm((f) => (f ? { ...f, label: v } : f))}
                  />
                </Field>
                <Field label="Value">
                  <Input
                    value={editForm.value}
                    onChange={(v) => setEditForm((f) => (f ? { ...f, value: v } : f))}
                  />
                </Field>
                <div className="flex gap-2 pt-1">
                  <SaveBtn onClick={saveEdit} loading={savePending} />
                  <button
                    type="button"
                    onClick={() => setEditId(null)}
                    className="text-xs font-mono text-outline hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <span className="text-xs text-outline uppercase tracking-widest font-bold block">
                  {s.label}
                </span>
                <span className="text-xl font-headline font-extrabold text-white">
                  {s.value}
                </span>
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => startEdit(s)}
                    className="text-xs font-mono text-outline hover:text-white uppercase tracking-widest"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => del(s.id)}
                    className="text-xs font-mono text-red-400/60 hover:text-red-400 uppercase tracking-widest"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Roles ────────────────────────────────────────────────
function RolesPanel({ initial }: { initial: Role[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [adding, setAdding] = useState(false);
  const [newForm, setNewForm] = useState<Omit<Role, "id">>({
    period: "",
    title: "",
    description: "",
    sortOrder: 0,
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Role | null>(null);
  const [addPending, startAdd] = useTransition();
  const [savePending, startSave] = useTransition();

  function add() {
    startAdd(async () => {
      try {
        const created = await api("/api/roles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newForm),
        });
        setItems((i) => [...i, created]);
        setAdding(false);
        setNewForm({ period: "", title: "", description: "", sortOrder: 0 });
        toast.success("Added");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Add failed");
      }
    });
  }

  function startEdit(r: Role) {
    setEditId(r.id);
    setEditForm({ ...r });
  }

  function saveEdit() {
    if (!editForm) return;
    startSave(async () => {
      try {
        await api(`/api/roles/${editForm.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        });
        setItems((i) => i.map((x) => (x.id === editForm.id ? editForm : x)));
        setEditId(null);
        toast.success("Saved");
        router.refresh();
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Save failed");
      }
    });
  }

  function del(id: number) {
    if (!window.confirm("Delete this item?")) return;
    (async () => {
      try {
        await api(`/api/roles/${id}`, { method: "DELETE" });
        setItems((i) => i.filter((x) => x.id !== id));
        toast.success("Deleted");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Delete failed");
      }
    })();
  }

  return (
    <div className="space-y-4">
      <SectionHeader title="Work Roles" onAdd={() => setAdding(true)} />
      {adding && (
        <div className="border border-primary/20 bg-surface-container p-4 space-y-3">
          <p className="text-xs font-mono text-primary uppercase tracking-widest mb-3">
            New Role
          </p>
          <Field label="Period">
            <Input
              value={newForm.period}
              onChange={(v) => setNewForm((f) => ({ ...f, period: v }))}
              placeholder="2021 — PRESENT"
            />
          </Field>
          <Field label="Title">
            <Input
              value={newForm.title}
              onChange={(v) => setNewForm((f) => ({ ...f, title: v }))}
            />
          </Field>
          <Field label="Description">
            <Textarea
              value={newForm.description}
              onChange={(v) => setNewForm((f) => ({ ...f, description: v }))}
              rows={4}
            />
          </Field>
          <div className="flex gap-3 pt-2">
            <SaveBtn onClick={add} loading={addPending} label="Create" />
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="px-4 py-2 text-xs font-mono text-outline hover:text-white transition-colors uppercase"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {items.map((r) => (
        <div key={r.id} className="border border-white/5 bg-surface-container p-4">
          {editId === r.id && editForm ? (
            <div className="space-y-3">
              <Field label="Period">
                <Input
                  value={editForm.period}
                  onChange={(v) => setEditForm((f) => (f ? { ...f, period: v } : f))}
                />
              </Field>
              <Field label="Title">
                <Input
                  value={editForm.title}
                  onChange={(v) => setEditForm((f) => (f ? { ...f, title: v } : f))}
                />
              </Field>
              <Field label="Description">
                <Textarea
                  value={editForm.description}
                  onChange={(v) =>
                    setEditForm((f) => (f ? { ...f, description: v } : f))
                  }
                  rows={4}
                />
              </Field>
              <div className="flex gap-2">
                <SaveBtn onClick={saveEdit} loading={savePending} />
                <button
                  type="button"
                  onClick={() => setEditId(null)}
                  className="text-xs font-mono text-outline hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs font-mono text-outline">{r.period}</p>
              <p className="text-sm text-white font-bold">{r.title}</p>
              <p className="text-sm text-on-surface-variant mt-1">{r.description}</p>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => startEdit(r)}
                  className="text-xs font-mono text-outline hover:text-white uppercase tracking-widest"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => del(r.id)}
                  className="text-xs font-mono text-red-400/60 hover:text-red-400 uppercase tracking-widest"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Expertise ────────────────────────────────────────────
function ExpertisePanel({ initial }: { initial: ExpertiseItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [adding, setAdding] = useState(false);
  const [newForm, setNewForm] = useState({
    icon: "",
    title: "",
    description: "",
    bg: "bg-surface",
    sortOrder: 0,
  });
  const [newTags, setNewTags] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<ExpertiseItem | null>(null);
  const [editTags, setEditTags] = useState("");
  const [addPending, startAdd] = useTransition();
  const [savePending, startSave] = useTransition();

  function jsonTags(s: string) {
    return JSON.stringify(
      s
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    );
  }

  function add() {
    startAdd(async () => {
      try {
        const created = await api("/api/expertise", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...newForm, tags: jsonTags(newTags) }),
        });
        setItems((i) => [...i, created]);
        setAdding(false);
        setNewForm({ icon: "", title: "", description: "", bg: "bg-surface", sortOrder: 0 });
        setNewTags("");
        toast.success("Added");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Add failed");
      }
    });
  }

  function startEdit(it: ExpertiseItem) {
    setEditId(it.id);
    setEditForm({ ...it });
    try {
      setEditTags((JSON.parse(it.tags) as string[]).join(", "));
    } catch {
      setEditTags("");
    }
  }

  function saveEdit() {
    if (!editForm) return;
    startSave(async () => {
      try {
        await api(`/api/expertise/${editForm.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...editForm, tags: jsonTags(editTags) }),
        });
        setItems((i) =>
          i.map((x) => (x.id === editForm.id ? { ...editForm, tags: jsonTags(editTags) } : x))
        );
        setEditId(null);
        toast.success("Saved");
        router.refresh();
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Save failed");
      }
    });
  }

  function del(id: number) {
    if (!window.confirm("Delete this item?")) return;
    (async () => {
      try {
        await api(`/api/expertise/${id}`, { method: "DELETE" });
        setItems((i) => i.filter((x) => x.id !== id));
        toast.success("Deleted");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Delete failed");
      }
    })();
  }

  return (
    <div className="space-y-4">
      <SectionHeader title="Expertise Items" onAdd={() => setAdding(true)} />
      {adding && (
        <div className="border border-primary/20 bg-surface-container p-4 space-y-3">
          <p className="text-xs font-mono text-primary uppercase tracking-widest mb-3">
            New Item
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Field label={`Icon (${ICON_OPTIONS.slice(0, 4).join(", ")}, …)`}>
              <Input
                value={newForm.icon}
                onChange={(v) => setNewForm((f) => ({ ...f, icon: v }))}
                placeholder="hub"
              />
            </Field>
            <Field label="Title">
              <Input
                value={newForm.title}
                onChange={(v) => setNewForm((f) => ({ ...f, title: v }))}
              />
            </Field>
          </div>
          <Field label="Description">
            <Textarea
              value={newForm.description}
              onChange={(v) => setNewForm((f) => ({ ...f, description: v }))}
            />
          </Field>
          <Field label="Tags (comma separated)">
            <Input value={newTags} onChange={setNewTags} placeholder="Raft, Kafka" />
          </Field>
          <div className="flex gap-3 pt-2">
            <SaveBtn onClick={add} loading={addPending} label="Create" />
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="px-4 py-2 text-xs font-mono text-outline hover:text-white transition-colors uppercase"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {items.map((it) => (
        <div key={it.id} className="border border-white/5 bg-surface-container p-4">
          {editId === it.id && editForm ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Icon">
                  <Input
                    value={editForm.icon}
                    onChange={(v) => setEditForm((f) => (f ? { ...f, icon: v } : f))}
                  />
                </Field>
                <Field label="Title">
                  <Input
                    value={editForm.title}
                    onChange={(v) => setEditForm((f) => (f ? { ...f, title: v } : f))}
                  />
                </Field>
              </div>
              <Field label="Description">
                <Textarea
                  value={editForm.description}
                  onChange={(v) =>
                    setEditForm((f) => (f ? { ...f, description: v } : f))
                  }
                />
              </Field>
              <Field label="Tags">
                <Input value={editTags} onChange={setEditTags} />
              </Field>
              <div className="flex gap-2">
                <SaveBtn onClick={saveEdit} loading={savePending} />
                <button
                  type="button"
                  onClick={() => setEditId(null)}
                  className="text-xs font-mono text-outline hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {(() => {
                    const Icon = iconFor(it.icon);
                    return <Icon size={14} className="text-primary" />;
                  })()}
                  <span className="text-sm text-white font-bold">{it.title}</span>
                </div>
                <p className="text-xs text-on-surface-variant">{it.description}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => startEdit(it)}
                  className="text-xs font-mono text-outline hover:text-white uppercase tracking-widest"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => del(it.id)}
                  className="text-xs font-mono text-red-400/60 hover:text-red-400 uppercase tracking-widest"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Root ─────────────────────────────────────────────────
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
              type="button"
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
        {tab === "Journal" && (
          <ContentPanel kind="journal" sectionTitle="Journal Articles" items={props.articles} />
        )}
        {tab === "Research" && (
          <ContentPanel
            kind="research"
            sectionTitle="Research Entries"
            items={props.research}
          />
        )}
        {tab === "Projects" && (
          <ContentPanel kind="projects" sectionTitle="Projects" items={props.projects} />
        )}
        {tab === "Ledger" && <LedgerPanel initial={props.ledger} />}
        {tab === "Stats" && <StatsPanel initial={props.stats} />}
        {tab === "Roles" && <RolesPanel initial={props.roles} />}
        {tab === "Expertise" && <ExpertisePanel initial={props.expertise} />}
      </div>
    </div>
  );
}

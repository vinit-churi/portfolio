"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, Link2 } from "lucide-react";
import {
  Field,
  Input,
  Textarea,
  Select,
  SaveBtn,
  DeleteBtn,
  SectionHeader,
} from "./ui";
import TiptapEditor from "./TiptapEditor";
import CloudinaryButton from "./CloudinaryButton";
import SortableList from "./SortableList";
import { slugify } from "@/lib/slug";
import type { ContentKind } from "@/lib/content";

type Common = {
  id: number;
  slug: string;
  title: string;
  body: string;
  tags: string;
  image: string;
  imageAlt: string;
  status: "draft" | "scheduled" | "published";
  publishedAt: Date | string | null;
  readingMinutes: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  sortOrder: number;
};

export type JournalLike = Common & {
  date: string;
  excerpt: string;
};

export type ProjectLike = Common & {
  description: string;
  url: string | null;
  githubUrl: string | null;
};

type Props =
  | { kind: "journal"; items: JournalLike[]; sectionTitle: string }
  | { kind: "research"; items: JournalLike[]; sectionTitle: string }
  | { kind: "projects"; items: ProjectLike[]; sectionTitle: string };

const STATUS_OPTIONS = [
  { value: "draft" as const, label: "Draft" },
  { value: "scheduled" as const, label: "Scheduled" },
  { value: "published" as const, label: "Published" },
];

const ENDPOINT: Record<ContentKind, string> = {
  journal: "/api/articles",
  research: "/api/research",
  projects: "/api/projects",
};

function tagsToString(json: string): string {
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr.join(", ") : "";
  } catch {
    return "";
  }
}

function tagsToJson(s: string): string {
  return JSON.stringify(
    s
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
  );
}

function dateInputValue(d: Date | string | null): string {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  if (isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

type AnyItem = JournalLike | ProjectLike;

function isProject(item: AnyItem): item is ProjectLike {
  return "description" in item;
}

export default function ContentPanel(props: Props) {
  const { kind, items: initial, sectionTitle } = props;
  const router = useRouter();
  const [items, setItems] = useState<AnyItem[]>(initial as AnyItem[]);
  const [adding, setAdding] = useState(false);
  const [reorderPending, setReorderPending] = useState(false);

  function refresh() {
    router.refresh();
  }

  async function persistOrder(next: AnyItem[]) {
    setItems(next);
    const order = next.map((it, i) => ({ id: it.id, sortOrder: i }));
    setReorderPending(true);
    try {
      const res = await fetch("/api/admin/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, order }),
      });
      if (!res.ok) throw new Error();
      toast.success("Order saved");
    } catch {
      toast.error("Reorder failed");
    } finally {
      setReorderPending(false);
    }
  }

  async function copyPreviewLink(slug: string) {
    try {
      const res = await fetch(`/api/admin/preview/${kind}/${slug}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      await navigator.clipboard.writeText(data.url);
      toast.success("Preview link copied");
    } catch {
      toast.error("Couldn't generate preview link");
    }
  }

  return (
    <div className="space-y-4">
      <SectionHeader title={sectionTitle} onAdd={() => setAdding(true)} />

      {adding && (
        <ItemForm
          kind={kind}
          mode="create"
          onSaved={(created) => {
            setItems((arr) => [...arr, created]);
            setAdding(false);
            refresh();
          }}
          onCancel={() => setAdding(false)}
        />
      )}

      {reorderPending && (
        <p className="text-xs font-mono text-outline">Saving order…</p>
      )}

      <SortableList
        items={items}
        onReorder={persistOrder}
        renderItem={(item, handle) => (
          <Row
            kind={kind}
            handle={handle}
            item={item}
            onSaved={(updated) => {
              setItems((arr) => arr.map((x) => (x.id === updated.id ? updated : x)));
              refresh();
            }}
            onDeleted={() => {
              setItems((arr) => arr.filter((x) => x.id !== item.id));
              refresh();
            }}
            onPreview={() => copyPreviewLink(item.slug)}
          />
        )}
      />
    </div>
  );
}

function Row({
  kind,
  item,
  handle,
  onSaved,
  onDeleted,
  onPreview,
}: {
  kind: ContentKind;
  item: AnyItem;
  handle: React.ReactNode;
  onSaved: (item: AnyItem) => void;
  onDeleted: () => void;
  onPreview: () => void;
}) {
  const [open, setOpen] = useState(false);

  const detailHref =
    kind === "journal"
      ? `/journal/${item.slug}`
      : kind === "research"
      ? `/research/${item.slug}`
      : `/projects/${item.slug}`;

  return (
    <div className="border border-white/5 bg-surface-container">
      <div className="flex items-center justify-between px-3 py-3 hover:bg-white/[0.02]">
        <div className="flex items-center gap-2 min-w-0">
          {handle}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="text-left flex-1 min-w-0"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xs font-mono text-outline shrink-0 truncate max-w-[12ch]">
                {item.slug}
              </span>
              <span className="text-sm text-white truncate">{item.title}</span>
            </div>
          </button>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`text-xs font-mono uppercase px-2 py-0.5 ${
              item.status === "published"
                ? "bg-primary/10 text-primary"
                : item.status === "scheduled"
                ? "bg-yellow-500/10 text-yellow-400"
                : "bg-white/5 text-outline"
            }`}
          >
            {item.status}
          </span>
          <a
            href={detailHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-outline hover:text-white"
            title="View detail"
          >
            <Eye size={14} />
          </a>
          <button
            type="button"
            onClick={onPreview}
            className="text-outline hover:text-white"
            title="Copy preview link"
          >
            <Link2 size={14} />
          </button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="text-outline text-xs"
          >
            {open ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {open && (
        <div className="px-4 pb-4 border-t border-white/5 pt-4">
          <ItemForm
            kind={kind}
            mode="update"
            initial={item}
            onSaved={(updated) => {
              onSaved(updated);
              setOpen(false);
            }}
            onCancel={() => setOpen(false)}
            onDeleted={onDeleted}
          />
        </div>
      )}
    </div>
  );
}

type FormState = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  description: string;
  body: string;
  tags: string;
  image: string;
  imageAlt: string;
  url: string;
  githubUrl: string;
  status: "draft" | "scheduled" | "published";
  publishedAtLocal: string;
};

function blankFormState(): FormState {
  return {
    slug: "",
    title: "",
    date: "",
    excerpt: "",
    description: "",
    body: "",
    tags: "",
    image: "",
    imageAlt: "",
    url: "",
    githubUrl: "",
    status: "draft",
    publishedAtLocal: "",
  };
}

function fromItem(item: AnyItem): FormState {
  return {
    slug: item.slug ?? "",
    title: item.title ?? "",
    date: isProject(item) ? "" : item.date ?? "",
    excerpt: isProject(item) ? "" : item.excerpt ?? "",
    description: isProject(item) ? item.description ?? "" : "",
    body: item.body ?? "",
    tags: tagsToString(item.tags ?? "[]"),
    image: item.image ?? "",
    imageAlt: item.imageAlt ?? "",
    url: isProject(item) ? item.url ?? "" : "",
    githubUrl: isProject(item) ? item.githubUrl ?? "" : "",
    status: (item.status ?? "draft") as FormState["status"],
    publishedAtLocal: dateInputValue(item.publishedAt),
  };
}

function ItemForm({
  kind,
  mode,
  initial,
  onSaved,
  onCancel,
  onDeleted,
}: {
  kind: ContentKind;
  mode: "create" | "update";
  initial?: AnyItem;
  onSaved: (item: AnyItem) => void;
  onCancel: () => void;
  onDeleted?: () => void;
}) {
  const [form, setForm] = useState<FormState>(initial ? fromItem(initial) : blankFormState());
  const [saving, startSave] = useTransition();
  const [deleting, startDelete] = useTransition();

  const isProjects = kind === "projects";

  const slugSuggestion = useMemo(() => slugify(form.title), [form.title]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function buildPayload() {
    const publishedAt = form.publishedAtLocal
      ? new Date(form.publishedAtLocal).toISOString()
      : null;

    if (isProjects) {
      return {
        slug: form.slug || slugify(form.title),
        title: form.title,
        description: form.description,
        body: form.body,
        tags: tagsToJson(form.tags),
        url: form.url.trim() || null,
        githubUrl: form.githubUrl.trim() || null,
        image: form.image,
        imageAlt: form.imageAlt,
        status: form.status,
        publishedAt,
      };
    }
    return {
      slug: form.slug || slugify(form.title),
      title: form.title,
      date: form.date,
      excerpt: form.excerpt,
      body: form.body,
      tags: tagsToJson(form.tags),
      image: form.image,
      imageAlt: form.imageAlt,
      status: form.status,
      publishedAt,
    };
  }

  function save() {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!isProjects && !form.excerpt.trim()) {
      toast.error("Excerpt is required");
      return;
    }
    if (isProjects && !form.description.trim()) {
      toast.error("Description is required");
      return;
    }

    const payload = buildPayload();
    const base = ENDPOINT[kind];
    const url = mode === "create" ? base : `${base}/${initial!.id}`;
    const method = mode === "create" ? "POST" : "PATCH";

    startSave(async () => {
      try {
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Save failed");
        toast.success(mode === "create" ? "Created" : "Saved");
        onSaved(data as AnyItem);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Save failed");
      }
    });
  }

  function del() {
    if (!initial) return;
    if (!window.confirm("Delete this item? This cannot be undone.")) return;
    startDelete(async () => {
      try {
        const res = await fetch(`${ENDPOINT[kind]}/${initial.id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error();
        toast.success("Deleted");
        onDeleted?.();
      } catch {
        toast.error("Delete failed");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Title">
          <Input value={form.title} onChange={(v) => set("title", v)} />
        </Field>
        <Field
          label="Slug"
          hint={!form.slug && slugSuggestion ? `Auto: ${slugSuggestion}` : undefined}
        >
          <div className="flex gap-2">
            <Input
              value={form.slug}
              onChange={(v) => set("slug", v)}
              placeholder={slugSuggestion || "my-post"}
            />
            <button
              type="button"
              onClick={() => set("slug", slugify(form.title))}
              disabled={!form.title.trim()}
              className="px-3 py-2 border border-white/10 text-[10px] font-mono uppercase tracking-widest text-outline hover:text-white hover:border-white/20 transition-colors disabled:opacity-30"
            >
              Auto
            </button>
          </div>
        </Field>
      </div>

      {!isProjects ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Display Date">
            <Input
              value={form.date}
              onChange={(v) => set("date", v)}
              placeholder="May 10, 2024"
            />
          </Field>
          <Field label="Status">
            <Select
              value={form.status}
              onChange={(v) => set("status", v)}
              options={STATUS_OPTIONS}
            />
          </Field>
        </div>
      ) : (
        <Field label="Status">
          <Select
            value={form.status}
            onChange={(v) => set("status", v)}
            options={STATUS_OPTIONS}
          />
        </Field>
      )}

      <Field
        label="Publish Date"
        hint={
          form.status === "scheduled"
            ? "Will go live at this time."
            : form.status === "draft"
            ? "Saved but will not be visible."
            : "Currently live."
        }
      >
        <Input
          type="datetime-local"
          value={form.publishedAtLocal}
          onChange={(v) => set("publishedAtLocal", v)}
        />
      </Field>

      {!isProjects ? (
        <Field label="Excerpt">
          <Textarea value={form.excerpt} onChange={(v) => set("excerpt", v)} rows={2} />
        </Field>
      ) : (
        <Field label="Short description">
          <Textarea
            value={form.description}
            onChange={(v) => set("description", v)}
            rows={3}
          />
        </Field>
      )}

      <Field label="Body">
        <TiptapEditor
          value={form.body}
          onChange={(v) => set("body", v)}
          placeholder="Write something worth reading…"
          imageUploader={(insert) => (
            <CloudinaryButton
              size="sm"
              label="Image"
              onUploaded={(url) => insert(url)}
              className="p-1.5 transition-colors text-outline hover:text-white"
            />
          )}
        />
      </Field>

      <Field label="Tags (comma separated)">
        <Input
          value={form.tags}
          onChange={(v) => set("tags", v)}
          placeholder="rust, distributed-systems"
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
        <Field label="Cover Image URL">
          <Input value={form.image} onChange={(v) => set("image", v)} />
        </Field>
        <CloudinaryButton onUploaded={(url) => set("image", url)} label="Upload cover" />
      </div>

      <Field label="Cover Image Alt">
        <Input value={form.imageAlt} onChange={(v) => set("imageAlt", v)} />
      </Field>

      {isProjects && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="GitHub URL">
            <Input
              value={form.githubUrl}
              onChange={(v) => set("githubUrl", v)}
              placeholder="https://github.com/…"
            />
          </Field>
          <Field label="Live URL">
            <Input
              value={form.url}
              onChange={(v) => set("url", v)}
              placeholder="https://…"
            />
          </Field>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <SaveBtn onClick={save} loading={saving} label={mode === "create" ? "Create" : "Save"} />
        {mode === "update" && onDeleted && <DeleteBtn onClick={del} loading={deleting} />}
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-xs font-mono text-outline hover:text-white transition-colors uppercase"
        >
          {mode === "create" ? "Cancel" : "Close"}
        </button>
      </div>
    </div>
  );
}

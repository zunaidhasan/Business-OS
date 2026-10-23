"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { BoardColumn, BoardItem } from "@/lib/queries";
import { Avatar, Badge, EmptyState, Modal } from "@/components/ui";
import { cn, compactCurrency, currency } from "@/lib/format";

export type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "date" | "textarea";
  options?: string[];
  required?: boolean;
  placeholder?: string;
  half?: boolean;
};

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export function Board({
  resource,
  label,
  columns,
  items,
  fields,
  accent,
  emptyHint,
}: {
  resource: string;
  label: string;
  columns: BoardColumn[];
  items: BoardItem[];
  fields: FieldConfig[];
  accent: string;
  emptyHint?: string;
}) {
  const router = useRouter();
  const [local, setLocal] = useState<BoardItem[]>(items);
  const [dragId, setDragId] = useState<number | null>(null);
  const [overCol, setOverCol] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const dragNode = useRef<HTMLDivElement | null>(null);

  useEffect(() => setLocal(items), [items]);

  const notify = (msg: string) => {
    setToast(msg);
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => setToast(null), 2600);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return local;
    return local.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        (i.subtitle ?? "").toLowerCase().includes(q) ||
        (i.details ?? []).some((d) => d.value.toLowerCase().includes(q)),
    );
  }, [local, query]);

  const byColumn = useMemo(() => {
    const map = new Map<string, BoardItem[]>();
    columns.forEach((c) => map.set(c.id, []));
    filtered.forEach((i) => {
      const list = map.get(i.stage);
      if (list) list.push(i);
      else map.set(i.stage, [i]);
    });
    return map;
  }, [filtered, columns]);

  async function moveItem(id: number, stage: string) {
    const prev = local;
    setLocal((cur) => cur.map((i) => (i.id === id ? { ...i, stage } : i)));
    try {
      const res = await fetch(`/api/${resource}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage }),
      });
      if (!res.ok) throw new Error("failed");
      const col = columns.find((c) => c.id === stage);
      notify(`Moved to ${col?.label ?? stage}`);
      router.refresh();
    } catch {
      setLocal(prev);
      notify("Could not update — reverted");
    }
  }

  async function createItem(payload: Record<string, string>) {
    setSaving(true);
    try {
      const res = await fetch(`/api/${resource}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("failed");
      setCreating(false);
      notify(`${label} created`);
      router.refresh();
    } catch {
      notify("Could not create item");
    } finally {
      setSaving(false);
    }
  }

  const openItem = local.find((i) => i.id === openId) ?? null;

  return (
    <div className="space-y-4">
      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1 sm:max-w-xs">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${label.toLowerCase()}…`}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden text-xs text-slate-500 sm:inline">
            {filtered.length} of {local.length} shown · drag cards between columns
          </span>
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 active:scale-[0.98]"
          >
            <span className="text-base leading-none">+</span> New {label.replace(/s$/, "")}
          </button>
        </div>
      </div>

      {/* board */}
      <div className="flex gap-4 overflow-x-auto pb-3">
        {columns.map((col) => {
          const list = byColumn.get(col.id) ?? [];
          const total = list.reduce((s, i) => s + (i.value ?? 0), 0);
          const isOver = overCol === col.id;
          return (
            <section
              key={col.id}
              onDragOver={(e) => {
                e.preventDefault();
                setOverCol(col.id);
              }}
              onDragLeave={() => setOverCol((c) => (c === col.id ? null : c))}
              onDrop={(e) => {
                e.preventDefault();
                setOverCol(null);
                const raw = e.dataTransfer.getData("text/plain");
                const id = Number(raw);
                const item = local.find((i) => i.id === id);
                if (item && item.stage !== col.id) void moveItem(id, col.id);
              }}
              className={cn(
                "flex w-[290px] shrink-0 flex-col rounded-2xl border bg-slate-50/80 transition-colors",
                isOver ? "border-indigo-300 bg-indigo-50/60" : "border-slate-200/80",
              )}
            >
              <header className="px-3.5 pb-2.5 pt-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: col.tone }} />
                  <h2 className="text-sm font-semibold text-slate-800">{col.label}</h2>
                  <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                    {list.length}
                  </span>
                </div>
                <p className="mt-1 truncate text-[11px] text-slate-400">
                  {col.hint}
                  {total > 0 ? ` · ${compactCurrency(total)}` : ""}
                </p>
              </header>
              <div className="flex-1 space-y-2.5 px-2.5 pb-2.5">
                {list.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-white/50 px-3 py-6 text-center text-[11px] text-slate-400">
                    Drop cards here
                  </div>
                ) : (
                  list.map((item) => (
                    <article
                      key={item.id}
                      draggable
                      onDragStart={(e) => {
                        setDragId(item.id);
                        dragNode.current = e.currentTarget as HTMLDivElement;
                        e.dataTransfer.setData("text/plain", String(item.id));
                        e.dataTransfer.effectAllowed = "move";
                      }}
                      onDragEnd={() => {
                        setDragId(null);
                        setOverCol(null);
                      }}
                      onClick={() => setOpenId(item.id)}
                      className={cn(
                        "cursor-grab rounded-xl border border-slate-200 bg-white p-3 shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing",
                        dragId === item.id && "opacity-40",
                      )}
                    >
                      <div className="flex items-start gap-2">
                        {item.initials ? (
                          <Avatar name={item.initials} color={item.color} size={28} />
                        ) : (
                          <span
                            className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white"
                            style={{ backgroundColor: accent }}
                          >
                            {item.title.slice(0, 1)}
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-sm font-semibold text-slate-900">{item.title}</h3>
                          {item.subtitle ? (
                            <p className="truncate text-xs text-slate-500">{item.subtitle}</p>
                          ) : null}
                        </div>
                        {item.badge ? <Badge tone={item.badge.tone}>{item.badge.label}</Badge> : null}
                      </div>

                      {typeof item.progress === "number" ? (
                        <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full" style={{ width: `${item.progress}%`, backgroundColor: col.tone }} />
                        </div>
                      ) : null}

                      <div className="mt-2.5 flex items-end justify-between gap-2">
                        <div className="min-w-0">
                          {(item.meta ?? []).map((m, idx) => (
                            <p key={idx} className="truncate text-[11px] text-slate-400">
                              {m.label}
                            </p>
                          ))}
                          {item.tags?.length ? (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {item.tags.map((t) => (
                                <span key={t} className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                                  {t}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </div>
                        {typeof item.value === "number" ? (
                          <span className="shrink-0 text-sm font-semibold text-slate-900">{currency(item.value)}</span>
                        ) : null}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          );
        })}
      </div>

      {local.length === 0 ? <EmptyState title={`No ${label.toLowerCase()} yet`} hint={emptyHint} /> : null}

      {/* detail drawer */}
      <Modal
        open={!!openItem}
        onClose={() => setOpenId(null)}
        title={openItem?.title ?? ""}
        subtitle={openItem?.subtitle}
        width="max-w-2xl"
      >
        {openItem ? (
          <div className="grid gap-6 sm:grid-cols-5">
            <div className="sm:col-span-3">
              <div className="flex flex-wrap items-center gap-2">
                {openItem.badge ? <Badge tone={openItem.badge.tone}>{openItem.badge.label}</Badge> : null}
                <Badge tone="slate">
                  {columns.find((c) => c.id === openItem.stage)?.label ?? openItem.stage}
                </Badge>
                {typeof openItem.value === "number" ? (
                  <span className="text-sm font-semibold text-slate-900">{currency(openItem.value)}</span>
                ) : null}
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
                {(openItem.details ?? []).map((d) => (
                  <div key={d.label} className="min-w-0">
                    <dt className="text-[11px] uppercase tracking-wide text-slate-400">{d.label}</dt>
                    <dd className="truncate text-sm font-medium text-slate-800" title={d.value}>
                      {d.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Move to stage</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {columns.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      void moveItem(openItem.id, c.id);
                      setOpenId(null);
                    }}
                    className={cn(
                      "rounded-lg px-2.5 py-1.5 text-xs font-medium ring-1 transition",
                      c.id === openItem.stage
                        ? "bg-slate-900 text-white ring-slate-900"
                        : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50",
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-400">Activity</p>
              <ol className="mt-2 space-y-3">
                {(openItem.activities ?? []).map((a, i) => (
                  <li key={`${a.id}-${i}`} className="relative pl-4">
                    <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-indigo-400" />
                    <p className="text-xs text-slate-700">{a.text}</p>
                    <p className="text-[11px] text-slate-400">{a.time}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* create modal */}
      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title={`New ${label.replace(/s$/, "")}`}
        subtitle="Demo data is written straight to PostgreSQL."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
            void createItem(data);
          }}
          className="grid grid-cols-2 gap-3"
        >
          {fields.map((f) => (
            <label key={f.name} className={cn("block", f.half === false && "col-span-2")}>
              <span className="text-xs font-medium text-slate-600">
                {f.label}
                {f.required ? <span className="text-rose-500"> *</span> : null}
              </span>
              {f.type === "select" ? (
                <select
                  name={f.name}
                  required={f.required}
                  defaultValue={f.options?.[0] ?? ""}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                >
                  {f.options?.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : f.type === "textarea" ? (
                <textarea
                  name={f.name}
                  rows={3}
                  placeholder={f.placeholder}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                />
              ) : (
                <input
                  name={f.name}
                  type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                  required={f.required}
                  placeholder={f.placeholder}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                />
              )}
            </label>
          ))}
          <div className="col-span-2 mt-1 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      {toast ? (
        <div className="fixed bottom-5 right-5 z-[60] rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      ) : null}
    </div>
  );
}

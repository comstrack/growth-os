"use client";

import { useEffect, useState, useTransition, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Creator } from "@/lib/types";
import { QG_CHECKLIST, QG_PHASES, stageLabel } from "@/lib/types";
import { toggleChecklistAction, updateCreatorAction } from "@/app/actions";
import { CreatorDialog } from "./CreatorDialog";

function eur(n: number): string {
  return n.toLocaleString("fr-FR") + " €";
}

export function QGClient({ creator }: { creator: Creator }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState(creator.notes);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setNotes(creator.notes);
  }, [creator.notes, creator.updated_at]);

  const total = QG_CHECKLIST.length;
  const done = QG_CHECKLIST.filter((i) => creator.checklist?.[i.id]).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const toggle = (key: string, value: boolean) =>
    startTransition(async () => {
      await toggleChecklistAction(creator.id, key, value);
      router.refresh();
    });

  const saveNotes = () =>
    startTransition(async () => {
      await updateCreatorAction(creator.id, { notes });
      router.refresh();
    });

  const notesDirty = notes !== creator.notes;

  const details: { label: string; value: ReactNode }[] = [];
  if (creator.offer_price > 0) details.push({ label: "Prix de l'offre", value: eur(creator.offer_price) });
  if (creator.baseline_revenue > 0) details.push({ label: "CA mensuel actuel", value: eur(creator.baseline_revenue) });
  if (creator.contact) details.push({ label: "Contact", value: creator.contact });
  if (creator.links)
    details.push({
      label: "Liens",
      value: (
        <a href={creator.links} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">
          {creator.links}
        </a>
      ),
    });

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-8">
      <Link href="/board" className="text-sm text-stone-500 hover:text-emerald-600 dark:text-stone-400">← Pipeline</Link>

      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">{creator.name}</h1>
            {creator.owner && (
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${creator.owner === "robin" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" : "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"}`}>
                {creator.owner === "robin" ? "Robin" : "Laura"}
              </span>
            )}
          </div>
          <div className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            {[stageLabel(creator.stage), creator.niche, creator.offer].filter(Boolean).join(" · ")}
          </div>
          {creator.instagram_url && (
            <a href={creator.instagram_url} target="_blank" rel="noreferrer" className="mt-1 inline-block text-sm text-emerald-600 hover:underline">Instagram ↗</a>
          )}
        </div>
        <button onClick={() => setOpen(true)} className="shrink-0 rounded-lg border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800">Éditer</button>
      </div>

      {details.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {details.map((d) => (
            <div key={d.label} className="rounded-lg border border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-stone-900">
              <div className="text-[11px] uppercase tracking-wide text-stone-400">{d.label}</div>
              <div className="mt-0.5 truncate text-sm font-medium">{d.value}</div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
          <div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs tabular-nums text-stone-500 dark:text-stone-400">{done}/{total}</span>
      </div>

      <div className="mt-6 grid gap-5">
        {QG_PHASES.map((phase) => {
          const items = QG_CHECKLIST.filter((i) => i.phase === phase);
          return (
            <section key={phase}>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">{phase}</h2>
              <div className="overflow-hidden rounded-xl border border-stone-200 dark:border-stone-800">
                {items.map((item, idx) => {
                  const checked = !!creator.checklist?.[item.id];
                  return (
                    <label key={item.id} className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 hover:bg-stone-50 dark:hover:bg-stone-900 ${idx > 0 ? "border-t border-stone-200 dark:border-stone-800" : ""}`}>
                      <input type="checkbox" checked={checked} onChange={(e) => toggle(item.id, e.target.checked)} className="h-4 w-4 accent-emerald-600" />
                      <span className={`text-sm ${checked ? "text-stone-400 line-through" : ""}`}>{item.label}</span>
                    </label>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <section className="mt-6">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">Notes</h2>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-32 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:border-stone-700 dark:bg-stone-950" placeholder="Contexte, historique des échanges, ce qu'il laisse sur la table…" />
        {notesDirty && (
          <div className="mt-2 flex gap-2">
            <button onClick={saveNotes} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700">Enregistrer</button>
            <button onClick={() => setNotes(creator.notes)} className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800">Annuler</button>
          </div>
        )}
      </section>

      <CreatorDialog open={open} onClose={() => setOpen(false)} creator={creator} />
    </div>
  );
}

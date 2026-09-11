"use client";

import { useEffect, useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { STAGES, EMPTY_CREATOR } from "@/lib/types";
import type { Creator, CreatorInput, Owner, StageKey } from "@/lib/types";
import {
  addCreatorAction,
  updateCreatorAction,
  deleteCreatorAction,
} from "@/app/actions";

const inp =
  "w-full rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1">
      <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
        {label}
      </span>
      {children}
    </label>
  );
}

export function CreatorDialog({
  open,
  onClose,
  creator,
}: {
  open: boolean;
  onClose: () => void;
  creator?: Creator;
}) {
  const router = useRouter();
  const [form, setForm] = useState<CreatorInput>(EMPTY_CREATOR);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (open) setForm(creator ? { ...creator } : EMPTY_CREATOR);
  }, [open, creator]);

  if (!open) return null;

  const set = <K extends keyof CreatorInput>(k: K, v: CreatorInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.name.trim()) return;
    startTransition(async () => {
      if (creator) await updateCreatorAction(creator.id, form);
      else await addCreatorAction(form);
      router.refresh();
      onClose();
    });
  };

  const remove = () => {
    if (!creator || !confirm("Supprimer ce créateur ?")) return;
    startTransition(async () => {
      await deleteCreatorAction(creator.id);
      router.refresh();
      onClose();
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-stone-200 bg-white shadow-xl dark:border-stone-800 dark:bg-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4 dark:border-stone-800">
          <h2 className="font-semibold">
            {creator ? "Modifier le créateur" : "Nouveau créateur"}
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200" aria-label="Fermer">✕</button>
        </div>

        <div className="grid gap-3 p-5">
          <Field label="Nom">
            <input className={inp} value={form.name} onChange={(e) => set("name", e.target.value)} autoFocus placeholder="Nom du créateur" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Instagram">
              <input className={inp} value={form.instagram_url} onChange={(e) => set("instagram_url", e.target.value)} placeholder="https://instagram.com/…" />
            </Field>
            <Field label="Contact (email / WhatsApp)">
              <input className={inp} value={form.contact} onChange={(e) => set("contact", e.target.value)} placeholder="…" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Niche">
              <input className={inp} value={form.niche} onChange={(e) => set("niche", e.target.value)} placeholder="Ex : running" />
            </Field>
            <Field label="Responsable">
              <select className={inp} value={form.owner} onChange={(e) => set("owner", e.target.value as Owner)}>
                <option value="">—</option>
                <option value="robin">Robin</option>
                <option value="laura">Laura</option>
              </select>
            </Field>
          </div>
          <Field label="Offre">
            <input className={inp} value={form.offer} onChange={(e) => set("offer", e.target.value)} placeholder="Ex : accompagnement 3 mois" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Prix de l'offre (€)">
              <input type="number" min="0" className={inp} value={form.offer_price || ""} onChange={(e) => set("offer_price", Number(e.target.value) || 0)} placeholder="2500" />
            </Field>
            <Field label="CA mensuel actuel (€)">
              <input type="number" min="0" className={inp} value={form.baseline_revenue || ""} onChange={(e) => set("baseline_revenue", Number(e.target.value) || 0)} placeholder="baseline" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Étape">
              <select className={inp} value={form.stage} onChange={(e) => set("stage", e.target.value as StageKey)}>
                {STAGES.map((s) => (<option key={s.key} value={s.key}>{s.label}</option>))}
              </select>
            </Field>
            <Field label="Prochaine action (date)">
              <input type="date" className={inp} value={form.next_action_at} onChange={(e) => set("next_action_at", e.target.value)} />
            </Field>
          </div>
          <Field label="Prochaine action (note)">
            <input className={inp} value={form.next_action_note} onChange={(e) => set("next_action_note", e.target.value)} placeholder="Ex : envoyer le Loom" />
          </Field>
          <Field label="Liens (VSL, contrat, page de vente…)">
            <input className={inp} value={form.links} onChange={(e) => set("links", e.target.value)} placeholder="https://…" />
          </Field>
          <Field label="Notes">
            <textarea className={`${inp} min-h-24`} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Contexte, ce qu'il laisse sur la table…" />
          </Field>
        </div>

        <div className="flex items-center gap-3 border-t border-stone-200 px-5 py-4 dark:border-stone-800">
          {creator && (
            <button onClick={remove} disabled={pending} className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50">Supprimer</button>
          )}
          <div className="ml-auto flex gap-2">
            <button onClick={onClose} className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800">Annuler</button>
            <button onClick={submit} disabled={pending || !form.name.trim()} className="rounded-lg bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50">
              {pending ? "…" : creator ? "Enregistrer" : "Ajouter"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

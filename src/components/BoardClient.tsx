"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { STAGES } from "@/lib/types";
import type { Creator, StageKey } from "@/lib/types";
import { moveStageAction } from "@/app/actions";
import { formatDateFR, isOverdue, isToday } from "@/lib/format";

export function BoardClient({ creators }: { creators: Creator[] }) {
  const router = useRouter();
  const [dragId, setDragId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<StageKey | null>(null);
  const [, startTransition] = useTransition();

  const move = (id: string, stage: StageKey) => {
    const current = creators.find((c) => c.id === id);
    if (!current || current.stage === stage) return;
    startTransition(async () => {
      await moveStageAction(id, stage);
      router.refresh();
    });
  };

  const drop = (stage: StageKey) => {
    if (dragId) move(dragId, stage);
    setDragId(null);
    setOverStage(null);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Pipeline de prospection</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {creators.length} créateur{creators.length > 1 ? "s" : ""} ·
          glisse-dépose une carte d&apos;une colonne à l&apos;autre · clique un
          nom pour ouvrir sa fiche.
        </p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4">
        {STAGES.map((s) => {
          const list = creators.filter((c) => c.stage === s.key);
          const isOver = overStage === s.key;
          return (
            <div
              key={s.key}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                if (overStage !== s.key) setOverStage(s.key);
              }}
              onDrop={(e) => {
                e.preventDefault();
                drop(s.key);
              }}
              className={`w-64 shrink-0 rounded-xl p-1 transition-colors ${
                isOver
                  ? "bg-emerald-500/10 ring-2 ring-emerald-500/60"
                  : "ring-2 ring-transparent"
              }`}
            >
              <div className="mb-2 flex items-center justify-between px-1 pt-1">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
                  {s.label}
                </h2>
                <span className="text-xs text-stone-400">{list.length}</span>
              </div>
              <div className="grid gap-2">
                {list.map((c) => (
                  <Card
                    key={c.id}
                    c={c}
                    dragging={dragId === c.id}
                    onMove={(st) => move(c.id, st)}
                    onDragStart={() => setDragId(c.id)}
                    onDragEnd={() => {
                      setDragId(null);
                      setOverStage(null);
                    }}
                  />
                ))}
                {list.length === 0 && (
                  <div className="rounded-lg border border-dashed border-stone-300 p-3 text-center text-xs text-stone-400 dark:border-stone-700">
                    {isOver ? "Déposer ici" : "—"}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Card({
  c,
  dragging,
  onMove,
  onDragStart,
  onDragEnd,
}: {
  c: Creator;
  dragging: boolean;
  onMove: (s: StageKey) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  const due = c.next_action_at;
  const dueClass = isOverdue(due)
    ? "text-red-600"
    : isToday(due)
      ? "text-emerald-600"
      : "text-stone-400";

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", c.id);
        e.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      className={`cursor-grab rounded-xl border border-stone-200 bg-white p-3 shadow-sm active:cursor-grabbing dark:border-stone-800 dark:bg-stone-900 ${
        dragging ? "opacity-40" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/createur/${c.id}`}
          draggable={false}
          className="text-left text-sm font-medium hover:text-emerald-600"
        >
          {c.name}
        </Link>
        {c.owner && (
          <span
            className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${
              c.owner === "robin"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                : "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
            }`}
          >
            {c.owner === "robin" ? "Robin" : "Laura"}
          </span>
        )}
      </div>
      {c.niche && (
        <div className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
          {c.niche}
        </div>
      )}
      {due && (
        <div className={`mt-2 text-xs ${dueClass}`}>
          ▸ {c.next_action_note || "action"} · {formatDateFR(due)}
        </div>
      )}
      <select
        value={c.stage}
        onChange={(e) => onMove(e.target.value as StageKey)}
        className="mt-2 w-full rounded-md border border-stone-200 bg-stone-50 px-2 py-1 text-xs text-stone-600 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-300"
      >
        {STAGES.map((s) => (
          <option key={s.key} value={s.key}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}

"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Creator } from "@/lib/types";
import { stageLabel } from "@/lib/types";
import { updateCreatorAction } from "@/app/actions";
import { formatDateFR, isOverdue, relativeFR } from "@/lib/format";

export function TodayClient({ creators }: { creators: Creator[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const done = (c: Creator) =>
    startTransition(async () => {
      await updateCreatorAction(c.id, { next_action_at: "" });
      router.refresh();
    });

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-xl font-semibold">À relancer aujourd&apos;hui</h1>
      <p className="mb-4 text-sm text-stone-500 dark:text-stone-400">
        {creators.length} action{creators.length > 1 ? "s" : ""} en attente.
      </p>

      {creators.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 p-8 text-center text-stone-400 dark:border-stone-700">
          Rien à relancer aujourd&apos;hui 🎉
        </div>
      ) : (
        <div className="grid gap-2">
          {creators.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900"
            >
              <button
                onClick={() => done(c)}
                title="Marquer comme fait (retire la date)"
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-emerald-500 text-xs text-transparent hover:bg-emerald-500 hover:text-white"
              >
                ✓
              </button>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/createur/${c.id}`}
                  className="text-sm font-medium hover:text-emerald-600"
                >
                  {c.name}
                </Link>
                <div className="truncate text-xs text-stone-500 dark:text-stone-400">
                  {c.next_action_note || "Action"} · {stageLabel(c.stage)}
                  {c.niche ? ` · ${c.niche}` : ""}
                </div>
              </div>
              <div
                className={`shrink-0 text-xs font-medium ${
                  isOverdue(c.next_action_at)
                    ? "text-red-600"
                    : "text-emerald-600"
                }`}
              >
                {relativeFR(c.next_action_at)} · {formatDateFR(c.next_action_at)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

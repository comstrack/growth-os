import Link from "next/link";
import { getCreators } from "@/lib/store";
import { STAGES, stageLabel } from "@/lib/types";
import type { StageKey } from "@/lib/types";
import { isDueTodayOrOverdue, formatDateFR, isOverdue } from "@/lib/format";

export const dynamic = "force-dynamic";

function eur(n: number): string {
  return n.toLocaleString("fr-FR") + " €";
}

export default async function DashboardPage() {
  const creators = await getCreators();
  const active = creators.filter((c) => c.stage !== "signe" && c.stage !== "abandon");
  const signed = creators.filter((c) => c.stage === "signe");
  const due = creators
    .filter((c) => c.stage !== "signe" && c.stage !== "abandon" && isDueTodayOrOverdue(c.next_action_at))
    .sort((a, b) => (a.next_action_at < b.next_action_at ? -1 : 1));
  const pipelineValue = active.reduce((s, c) => s + (c.offer_price || 0), 0);

  const counts: Record<StageKey, number> = {
    a_demarcher: 0, touche_1: 0, touche_2: 0, touche_3: 0, appel_booke: 0, signe: 0, abandon: 0,
  };
  creators.forEach((c) => { counts[c.stage] += 1; });
  const maxCount = Math.max(1, ...STAGES.map((s) => counts[s.key]));

  const tiles = [
    { label: "Prospects actifs", value: String(active.length), sub: "en cours de démarchage" },
    { label: "Signés", value: String(signed.length), sub: "créateurs onboardés" },
    { label: "À relancer aujourd'hui", value: String(due.length), sub: "actions en attente", href: "/aujourdhui" },
    { label: "Valeur du pipeline", value: eur(pipelineValue), sub: "somme des offres actives" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400">Ta vue d&apos;ensemble du pipeline.</p>
      </div>

      {/* stat tiles */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tiles.map((t) => {
          const inner = (
            <>
              <div className="text-2xl font-semibold tabular-nums text-emerald-600">{t.value}</div>
              <div className="mt-1 text-sm font-medium">{t.label}</div>
              <div className="text-xs text-stone-500 dark:text-stone-400">{t.sub}</div>
            </>
          );
          return t.href ? (
            <Link key={t.label} href={t.href} className="rounded-xl border border-stone-200 bg-white p-4 transition-colors hover:border-emerald-400 dark:border-stone-800 dark:bg-stone-900">
              {inner}
            </Link>
          ) : (
            <div key={t.label} className="rounded-xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
              {inner}
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* funnel */}
        <section className="rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Entonnoir</h2>
            <Link href="/board" className="text-xs font-medium text-emerald-600 hover:underline">Ouvrir le pipeline →</Link>
          </div>
          <div className="grid gap-2.5">
            {STAGES.map((s) => (
              <div key={s.key} className="flex items-center gap-3">
                <div className="w-24 shrink-0 text-xs text-stone-500 dark:text-stone-400">{s.label}</div>
                <div className="h-6 flex-1 overflow-hidden rounded-md bg-stone-100 dark:bg-stone-800">
                  <div
                    className={`h-full rounded-md ${s.key === "signe" ? "bg-emerald-600" : s.key === "abandon" ? "bg-stone-400 dark:bg-stone-600" : "bg-emerald-500/70"}`}
                    style={{ width: `${Math.round((counts[s.key] / maxCount) * 100)}%`, minWidth: counts[s.key] > 0 ? "8px" : "0" }}
                  />
                </div>
                <div className="w-6 shrink-0 text-right text-sm font-medium tabular-nums">{counts[s.key]}</div>
              </div>
            ))}
          </div>
        </section>

        {/* today preview */}
        <section className="rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">À relancer</h2>
            <Link href="/aujourdhui" className="text-xs font-medium text-emerald-600 hover:underline">Tout voir →</Link>
          </div>
          {due.length === 0 ? (
            <p className="py-6 text-center text-sm text-stone-400">Rien à relancer aujourd&apos;hui 🎉</p>
          ) : (
            <div className="grid gap-2">
              {due.slice(0, 6).map((c) => (
                <Link key={c.id} href={`/createur/${c.id}`} className="flex items-center justify-between gap-3 rounded-lg border border-stone-100 px-3 py-2 hover:border-emerald-300 dark:border-stone-800">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{c.name}</div>
                    <div className="truncate text-xs text-stone-500 dark:text-stone-400">{c.next_action_note || "Action"} · {stageLabel(c.stage)}</div>
                  </div>
                  <div className={`shrink-0 text-xs font-medium ${isOverdue(c.next_action_at) ? "text-red-600" : "text-emerald-600"}`}>
                    {formatDateFR(c.next_action_at)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

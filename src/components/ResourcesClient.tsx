"use client";

import { useState } from "react";

type Block = { label?: string; text: string };
type Section = { title: string; intro?: string; blocks: Block[] };

const SECTIONS: Section[] = [
  {
    title: "Message d'ouverture",
    intro: "But : obtenir une réponse, pas vendre. Chaud, via DM / Skool.",
    blocks: [
      {
        label: "Si tu closes déjà pour lui",
        text:
          "Salut [prénom] ! Ça fait [X] que je close sur ton offre. J'ai repéré 2-3 trucs qui te font perdre du CA en amont, avant même que les appels arrivent. J'ai une idée pour augmenter pas mal ce que ton offre génère — rien à te vendre, je me paie uniquement sur la croissance qu'on crée ensemble. Je te fais un Loom de 3 min pour te montrer, ça te va ?",
      },
      {
        label: "Contact plus récent (Skool)",
        text:
          "Salut [prénom], j'ai vu que tu cherches régulièrement des closers/setters dans le Skool. Moi je fais du growth operating : je m'occupe de toute la machine de vente (pas juste te caler des closers) et je me paie uniquement sur ce qu'on génère en plus, ensemble. J'ai déjà repéré des trucs à améliorer chez toi — je t'envoie un Loom rapide ?",
      },
    ],
  },
  {
    title: "Envoi du Loom (3 messages à la suite)",
    intro: "Jamais le lien seul.",
    blocks: [
      { label: "1 · avant", text: "Je t'envoie un petit Loom, c'est plus rapide qu'un vocal 👇" },
      { label: "2 · le lien", text: "[lien Loom]" },
      { label: "3 · après", text: "Dis-moi ce que t'en penses ! En tout cas j'adore ce que tu fais." },
    ],
  },
  {
    title: "Structure du Loom (90 s – 3 min)",
    blocks: [
      {
        text:
          "0–20 s : ne pas se présenter longtemps, parler de LUI. Direct : « j'ai rien à te vendre, je bosse au pourcentage sur ce qu'on génère en plus ensemble. »\n\nCorps : montrer ce qu'il rate sans tout donner (tunnel non optimisé → closers ferment moins ; zéro lancement à une audience chaude ; [1 point précis à lui]).\n\nCTA : « on s'appelle 15 min aujourd'hui ou demain ? Au %, ça ne te coûte rien. »",
      },
    ],
  },
  {
    title: "Relances",
    intro: "La majorité signe au 2e-3e message. Court, créatif, jamais needy.",
    blocks: [
      { label: "R1 (24h après le Loom)", text: "Salut [prénom], t'as pu checker la vidéo d'hier ?" },
      { label: "R2 (48h après R1)", text: "[vocal court OU juste le prénom OU un angle différent]" },
      { label: "R3 (48h après R2)", text: "[dernière tentative : 2e Loom court, angle décalé]" },
    ],
  },
  {
    title: "R1 — Appel de découverte",
    intro: "Cadrer, puis ÉCOUTER (règle 10/90). Récupérer sa baseline.",
    blocks: [
      {
        text:
          "Aujourd'hui tu génères combien / mois avec cette offre ?  (← ta baseline)\nC'est quoi ton offre, ton prix, ton taux de closing ?\nD'où viennent tes leads ? Combien d'appels / semaine ?\nQui close aujourd'hui, comment tu gères les closers ?\nOù tu veux être dans 6 mois ? Qu'est-ce qui te bloque ?",
      },
    ],
  },
  {
    title: "R2 — Présentation / closing",
    intro: "Slides + maquette. Le prix arrive tard.",
    blocks: [
      {
        text:
          "1 Cover → 2 Récap du R1 (ses mots) → 3 Ton audience veut plus (screens de commentaires) → 4 La solution (nom + maquette) → 5 Aperçu → 6 Partenariat sans risque (au %) → 7 Répartition → 8 Questions (se taire) → 9 « On regarde le contrat ensemble ».",
      },
    ],
  },
  {
    title: "Rémunération — l'angle incrémental",
    intro: "Pour un infopreneur qui vend déjà (cas Noma).",
    blocks: [
      {
        text:
          "On définit ta moyenne des 3 derniers mois. Tout ce qu'on génère au-dessus, je prends 30 %, tu gardes 70 %. En dessous, je prends zéro. Je ne gagne que si je te fais gagner PLUS que ce que tu fais déjà seul.",
      },
    ],
  },
];

function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setOk(true);
          setTimeout(() => setOk(false), 1500);
        } catch {
          /* clipboard unavailable */
        }
      }}
      className="shrink-0 rounded-md border border-stone-300 px-2 py-1 text-xs font-medium text-stone-500 hover:bg-stone-100 hover:text-stone-800 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
    >
      {ok ? "Copié ✓" : "Copier"}
    </button>
  );
}

export function ResourcesClient() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Ressources</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Les scripts de prospection (méthode Cauzet), prêts à copier-coller. Adapte toujours à ta cible.
        </p>
      </div>

      <div className="grid gap-5">
        {SECTIONS.map((s) => (
          <section key={s.title} className="rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
            <h2 className="font-semibold">{s.title}</h2>
            {s.intro && <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">{s.intro}</p>}
            <div className="mt-3 grid gap-2.5">
              {s.blocks.map((b, i) => (
                <div key={i} className="rounded-lg border border-stone-200 bg-stone-50 p-3 dark:border-stone-800 dark:bg-stone-950">
                  <div className="flex items-start justify-between gap-3">
                    {b.label && <div className="text-xs font-semibold text-emerald-600">{b.label}</div>}
                    <div className="ml-auto"><CopyBtn text={b.text} /></div>
                  </div>
                  <p className="mt-1 whitespace-pre-line text-sm text-stone-700 dark:text-stone-300">{b.text}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

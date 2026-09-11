export type StageKey =
  | "a_demarcher"
  | "touche_1"
  | "touche_2"
  | "touche_3"
  | "appel_booke"
  | "signe"
  | "abandon";

export const STAGES: { key: StageKey; label: string }[] = [
  { key: "a_demarcher", label: "À démarcher" },
  { key: "touche_1", label: "1re touche" },
  { key: "touche_2", label: "2e touche" },
  { key: "touche_3", label: "3e touche" },
  { key: "appel_booke", label: "Appel booké" },
  { key: "signe", label: "Signé" },
  { key: "abandon", label: "Abandon" },
];

export function stageLabel(k: StageKey): string {
  return STAGES.find((s) => s.key === k)?.label ?? k;
}

export type Owner = "robin" | "laura" | "";

export type Creator = {
  id: string;
  name: string;
  instagram_url: string;
  niche: string;
  offer: string;
  notes: string;
  stage: StageKey;
  next_action_at: string; // "YYYY-MM-DD" or ""
  next_action_note: string;
  owner: Owner;
  offer_price: number;
  baseline_revenue: number;
  contact: string;
  links: string;
  checklist: Record<string, boolean>;
  created_at: string;
  updated_at: string;
};

export type CreatorInput = Omit<Creator, "id" | "created_at" | "updated_at">;

export const EMPTY_CREATOR: CreatorInput = {
  name: "",
  instagram_url: "",
  niche: "",
  offer: "",
  notes: "",
  stage: "a_demarcher",
  next_action_at: "",
  next_action_note: "",
  owner: "",
  offer_price: 0,
  baseline_revenue: 0,
  contact: "",
  links: "",
  checklist: {},
};

// QG créateur — checklist opérationnelle (dérivée de la trame de lancement).
export type QGItem = { id: string; phase: string; label: string };

export const QG_PHASES = [
  "Onboarding",
  "Recherche & offre",
  "Machine de vente",
  "Lancement",
  "Encaisser",
] as const;

export const QG_CHECKLIST: QGItem[] = [
  { id: "ob_qg", phase: "Onboarding", label: "QG Notion / formulaire envoyé" },
  { id: "ob_call", phase: "Onboarding", label: "Appel d'onboarding fait" },
  { id: "ob_access", phase: "Onboarding", label: "Accès récupérés (Meta au min.)" },
  { id: "ob_whop", phase: "Onboarding", label: "Paiement Whop en place" },
  { id: "ob_roadmap", phase: "Onboarding", label: "Roadmap + appels de suivi posés" },

  { id: "of_avatar", phase: "Recherche & offre", label: "Avatar unifié construit" },
  { id: "of_offre", phase: "Recherche & offre", label: "Offre construite (3S + mécanisme)" },
  { id: "of_prix", phase: "Recherche & offre", label: "Prix fixé" },
  { id: "of_garantie", phase: "Recherche & offre", label: "Garantie définie" },
  { id: "of_insta", phase: "Recherche & offre", label: "Profil Insta optimisé" },

  { id: "mv_vsl", phase: "Machine de vente", label: "VSL écrite" },
  { id: "mv_closers", phase: "Machine de vente", label: "Closers/setters Noma staffés" },
  { id: "mv_script", phase: "Machine de vente", label: "Script de closing adapté" },
  { id: "mv_booking", phase: "Machine de vente", label: "Closing câblé dès le booking" },

  { id: "la_canal", phase: "Lancement", label: "Canal choisi (organique ou pubs)" },
  { id: "la_review", phase: "Lancement", label: "Review avant lancement" },
  { id: "la_go", phase: "Lancement", label: "Lancement lancé" },

  { id: "en_appels", phase: "Encaisser", label: "Premiers appels closés" },
  { id: "en_tracker", phase: "Encaisser", label: "Tracker en place" },
  { id: "en_case", phase: "Encaisser", label: "Étude de cas documentée" },
];

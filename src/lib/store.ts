// Data layer backed by Supabase (Postgres). Same function signatures as the
// former local-file store, so the rest of the app is unchanged.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Creator, CreatorInput, Owner, StageKey } from "./types";

// Lazy client: not created at import time, so the production build succeeds
// even before env vars are set. It is instantiated on first actual DB call.
let _sb: SupabaseClient | null = null;
function sb(): SupabaseClient {
  if (!_sb) {
    _sb = createClient(
      process.env.SUPABASE_URL ?? "https://xufhltypfckailkluahh.supabase.co",
      process.env.SUPABASE_ANON_KEY ??
        "sb_publishable_E7J-c8ajtF9TnAe8trv-RA_6fLg9vGe",
    );
  }
  return _sb;
}

const COLS =
  "id,name,instagram_url,niche,offer,notes,stage,next_action_at,next_action_note,owner,offer_price,baseline_revenue,contact,links,checklist,created_at,updated_at";

type Row = {
  id: string;
  name: string;
  instagram_url: string;
  niche: string;
  offer: string;
  notes: string;
  stage: string;
  next_action_at: string | null;
  next_action_note: string;
  owner: string;
  offer_price: number | null;
  baseline_revenue: number | null;
  contact: string | null;
  links: string | null;
  checklist: Record<string, boolean> | null;
  created_at: string;
  updated_at: string;
};

function toCreator(r: Row): Creator {
  return {
    id: r.id,
    name: r.name,
    instagram_url: r.instagram_url,
    niche: r.niche,
    offer: r.offer,
    notes: r.notes,
    stage: r.stage as StageKey,
    next_action_at: r.next_action_at ?? "",
    next_action_note: r.next_action_note,
    owner: (r.owner ?? "") as Owner,
    offer_price: r.offer_price ?? 0,
    baseline_revenue: r.baseline_revenue ?? 0,
    contact: r.contact ?? "",
    links: r.links ?? "",
    checklist: r.checklist ?? {},
    created_at: r.created_at,
    updated_at: r.updated_at,
  };
}

function toRow(patch: Partial<CreatorInput>): Record<string, unknown> {
  const row: Record<string, unknown> = { ...patch };
  if ("next_action_at" in patch) {
    row.next_action_at = patch.next_action_at ? patch.next_action_at : null;
  }
  return row;
}

export async function getCreators(): Promise<Creator[]> {
  const { data, error } = await sb()
    .from("creators")
    .select(COLS)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data as Row[]).map(toCreator);
}

export async function getCreator(id: string): Promise<Creator | undefined> {
  const { data, error } = await sb()
    .from("creators")
    .select(COLS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? toCreator(data as Row) : undefined;
}

export async function createCreator(input: CreatorInput): Promise<Creator> {
  const { data, error } = await sb()
    .from("creators")
    .insert(toRow(input))
    .select(COLS)
    .single();
  if (error) throw error;
  return toCreator(data as Row);
}

export async function updateCreator(
  id: string,
  patch: Partial<CreatorInput>,
): Promise<void> {
  const { error } = await sb()
    .from("creators")
    .update({ ...toRow(patch), updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteCreator(id: string): Promise<void> {
  const { error } = await sb().from("creators").delete().eq("id", id);
  if (error) throw error;
}

export async function setChecklistItem(
  id: string,
  key: string,
  value: boolean,
): Promise<void> {
  const { data, error } = await sb()
    .from("creators")
    .select("checklist")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  const checklist = {
    ...((data?.checklist as Record<string, boolean>) ?? {}),
    [key]: value,
  };
  const { error: e2 } = await sb()
    .from("creators")
    .update({ checklist, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (e2) throw e2;
}

// ---- Auth (via SECURITY DEFINER functions; hash stays in the database) ----

export type AuthUser = { id: string; email: string; name: string };

export async function verifyUser(
  email: string,
  password: string,
): Promise<AuthUser | null> {
  const { data, error } = await sb().rpc("app_verify_user", {
    p_email: email,
    p_password: password,
  });
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  return row ? { id: row.id, email: row.email, name: row.name } : null;
}

export async function createUser(
  email: string,
  password: string,
  name: string,
): Promise<string> {
  const { data, error } = await sb().rpc("app_create_user", {
    p_email: email,
    p_password: password,
    p_name: name,
  });
  if (error) throw error;
  return data as string;
}

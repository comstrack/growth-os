"use server";

import { revalidatePath } from "next/cache";
import {
  createCreator,
  updateCreator,
  deleteCreator,
  setChecklistItem,
} from "@/lib/store";
import type { CreatorInput, StageKey } from "@/lib/types";

function refresh() {
  revalidatePath("/");
  revalidatePath("/aujourdhui");
}

export async function addCreatorAction(input: CreatorInput) {
  await createCreator(input);
  refresh();
}

export async function updateCreatorAction(
  id: string,
  patch: Partial<CreatorInput>,
) {
  await updateCreator(id, patch);
  refresh();
}

export async function moveStageAction(id: string, stage: StageKey) {
  await updateCreator(id, { stage });
  refresh();
}

export async function deleteCreatorAction(id: string) {
  await deleteCreator(id);
  refresh();
}

export async function toggleChecklistAction(
  id: string,
  key: string,
  value: boolean,
) {
  await setChecklistItem(id, key, value);
  revalidatePath(`/createur/${id}`);
}

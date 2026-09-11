"use server";

import { redirect } from "next/navigation";
import { verifyUser, createUser } from "@/lib/store";
import { createSession, destroySession } from "@/lib/session";

export async function loginAction(
  _prev: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (!email || !password) return "Email et mot de passe requis.";

  let user;
  try {
    user = await verifyUser(email, password);
  } catch {
    return "Erreur serveur. Réessaie.";
  }
  if (!user) return "Identifiants incorrects.";

  await createSession({ uid: user.id, email: user.email, name: user.name });
  redirect("/");
}

export async function signupAction(
  _prev: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const code = String(formData.get("code") || "").trim();

  if (!name || !email || !password) return "Tous les champs sont requis.";
  if (password.length < 8) return "Mot de passe : 8 caractères minimum.";
  if (code !== (process.env.SIGNUP_CODE ?? "6d9046ee"))
    return "Code d'invitation invalide.";

  let id: string;
  try {
    id = await createUser(email, password, name);
  } catch (e) {
    const msg = String((e as { message?: string })?.message || e);
    if (msg.includes("duplicate") || msg.includes("unique")) {
      return "Un compte existe déjà avec cet email.";
    }
    return "Erreur lors de la création du compte.";
  }

  await createSession({ uid: id, email, name });
  redirect("/");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/login");
}

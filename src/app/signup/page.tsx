"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signupAction } from "@/app/auth-actions";

const inp =
  "w-full rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500";

export default function SignupPage() {
  const [error, action, pending] = useActionState(signupAction, undefined);
  return (
    <div className="mx-auto flex min-h-[85vh] max-w-sm flex-col justify-center px-4">
      <div className="mb-6 flex items-center gap-2">
        <span className="inline-block h-6 w-6 rounded bg-emerald-600" />
        <span className="text-lg font-semibold tracking-tight">Growth OS</span>
      </div>
      <h1 className="text-xl font-semibold">Créer un compte</h1>
      <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
        Réservé à l&apos;équipe — code d&apos;invitation requis.
      </p>
      <form action={action} className="mt-5 grid gap-3">
        <input
          name="name"
          type="text"
          required
          placeholder="Prénom"
          autoComplete="name"
          className={inp}
        />
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          autoComplete="email"
          className={inp}
        />
        <input
          name="password"
          type="password"
          required
          placeholder="Mot de passe (8 caractères min.)"
          autoComplete="new-password"
          className={inp}
        />
        <input
          name="code"
          type="text"
          required
          placeholder="Code d'invitation"
          className={inp}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={pending}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {pending ? "…" : "Créer mon compte"}
        </button>
      </form>
      <p className="mt-4 text-sm text-stone-500 dark:text-stone-400">
        Déjà un compte ?{" "}
        <Link href="/login" className="text-emerald-600 hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}

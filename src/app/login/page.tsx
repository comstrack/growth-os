"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/app/auth-actions";

const inp =
  "w-full rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500";

export default function LoginPage() {
  const [error, action, pending] = useActionState(loginAction, undefined);
  return (
    <div className="mx-auto flex min-h-[85vh] max-w-sm flex-col justify-center px-4">
      <div className="mb-6 flex items-center gap-2">
        <span className="inline-block h-6 w-6 rounded bg-emerald-600" />
        <span className="text-lg font-semibold tracking-tight">Growth OS</span>
      </div>
      <h1 className="text-xl font-semibold">Connexion</h1>
      <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
        Accède à ton pipeline.
      </p>
      <form action={action} className="mt-5 grid gap-3">
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
          placeholder="Mot de passe"
          autoComplete="current-password"
          className={inp}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={pending}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {pending ? "…" : "Se connecter"}
        </button>
      </form>
      <p className="mt-4 text-sm text-stone-500 dark:text-stone-400">
        Pas encore de compte ?{" "}
        <Link href="/signup" className="text-emerald-600 hover:underline">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}

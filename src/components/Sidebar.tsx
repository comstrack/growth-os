"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { CreatorDialog } from "./CreatorDialog";
import { logoutAction } from "@/app/auth-actions";

const NAV = [
  { href: "/", label: "Dashboard", icon: "grid" },
  { href: "/board", label: "Pipeline", icon: "columns" },
  { href: "/aujourdhui", label: "Aujourd'hui", icon: "check" },
  { href: "/ressources", label: "Ressources", icon: "book" },
] as const;

function Icon({ name }: { name: string }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "grid":
      return (<svg {...common}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>);
    case "columns":
      return (<svg {...common}><rect x="3" y="4" width="5" height="16" rx="1" /><rect x="10" y="4" width="5" height="11" rx="1" /><rect x="17" y="4" width="4" height="7" rx="1" /></svg>);
    case "check":
      return (<svg {...common}><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>);
    case "book":
      return (<svg {...common}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>);
    default:
      return null;
  }
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Sidebar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navLink = (href: string, label: string, icon: string, extra = "") => {
    const active = isActive(pathname, href);
    return (
      <Link
        href={href}
        className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          active
            ? "bg-emerald-600 text-white"
            : "text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
        } ${extra}`}
      >
        <Icon name={icon} />
        {label}
      </Link>
    );
  };

  const addBtn = (cls: string): ReactNode => (
    <button
      onClick={() => setOpen(true)}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 font-medium text-white hover:bg-emerald-700 ${cls}`}
    >
      + Ajouter
    </button>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900 md:flex">
        <Link href="/" className="mb-6 flex items-center gap-2 px-1 text-lg font-semibold tracking-tight">
          <span className="inline-block h-6 w-6 rounded-md bg-emerald-600" />
          Growth OS
        </Link>
        {addBtn("mb-4 w-full py-2 text-sm")}
        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((n) => (
            <span key={n.href}>{navLink(n.href, n.label, n.icon)}</span>
          ))}
        </nav>
        <div className="mt-4 border-t border-stone-200 pt-3 dark:border-stone-800">
          <div className="truncate px-1 pb-2 text-xs text-stone-500 dark:text-stone-400">
            Connecté : <span className="font-medium text-stone-700 dark:text-stone-200">{userName}</span>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="w-full rounded-lg border border-stone-300 px-3 py-1.5 text-xs text-stone-500 hover:bg-stone-100 hover:text-stone-800 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100">
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/90 backdrop-blur dark:border-stone-800 dark:bg-stone-900/90 md:hidden">
        <div className="flex h-14 items-center gap-3 px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="inline-block h-5 w-5 rounded bg-emerald-600" />
            Growth OS
          </Link>
          <div className="ml-auto flex items-center gap-2">
            {addBtn("px-3 py-1.5 text-sm")}
            <form action={logoutAction}>
              <button type="submit" className="rounded-lg border border-stone-300 px-2.5 py-1.5 text-xs text-stone-500 dark:border-stone-700 dark:text-stone-400">
                Quitter
              </button>
            </form>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-2">
          {NAV.map((n) => (
            <span key={n.href} className="shrink-0">{navLink(n.href, n.label, n.icon, "px-2.5 py-1.5")}</span>
          ))}
        </nav>
      </header>

      <CreatorDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}

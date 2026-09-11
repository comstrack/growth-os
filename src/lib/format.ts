export function todayISO(): string {
  const d = new Date();
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export function isOverdue(dateISO: string): boolean {
  return !!dateISO && dateISO < todayISO();
}

export function isToday(dateISO: string): boolean {
  return !!dateISO && dateISO === todayISO();
}

export function isDueTodayOrOverdue(dateISO: string): boolean {
  return !!dateISO && dateISO <= todayISO();
}

export function formatDateFR(dateISO: string): string {
  if (!dateISO) return "";
  const [y, m, d] = dateISO.split("-");
  return `${d}/${m}/${y}`;
}

export function relativeFR(dateISO: string): string {
  if (!dateISO) return "";
  const today = todayISO();
  if (dateISO === today) return "aujourd'hui";
  if (dateISO < today) return "en retard";
  const a = new Date(today + "T00:00:00");
  const b = new Date(dateISO + "T00:00:00");
  const diff = Math.round((b.getTime() - a.getTime()) / 86400000);
  return diff === 1 ? "demain" : `dans ${diff} j`;
}

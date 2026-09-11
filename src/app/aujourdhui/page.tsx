import { getCreators } from "@/lib/store";
import { TodayClient } from "@/components/TodayClient";
import { isDueTodayOrOverdue } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const all = await getCreators();
  const due = all
    .filter(
      (c) =>
        c.stage !== "signe" &&
        c.stage !== "abandon" &&
        isDueTodayOrOverdue(c.next_action_at),
    )
    .sort((a, b) => (a.next_action_at < b.next_action_at ? -1 : 1));
  return <TodayClient creators={due} />;
}

import { getCreators } from "@/lib/store";
import { BoardClient } from "@/components/BoardClient";

export const dynamic = "force-dynamic";

export default async function BoardPage() {
  const creators = await getCreators();
  return <BoardClient creators={creators} />;
}

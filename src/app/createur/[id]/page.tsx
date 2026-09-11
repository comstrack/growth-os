import { notFound } from "next/navigation";
import { getCreator } from "@/lib/store";
import { QGClient } from "@/components/QGClient";

export const dynamic = "force-dynamic";

export default async function CreatorPage({
  params,
}: PageProps<"/createur/[id]">) {
  const { id } = await params;
  const creator = await getCreator(id);
  if (!creator) notFound();
  return <QGClient creator={creator} />;
}

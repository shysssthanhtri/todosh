import { AddLabelButton } from "./_components/add-label-button";
import { SyncLabelsButton } from "./_components/sync-labels-button";

export const metadata = {
  title: "Labels",
  description: "Manage labels for your todos.",
};

export default async function LabelsPage({
  params,
  searchParams,
}: {
  params?: Promise<Record<string, string | string[]>>;
  searchParams?: Promise<Record<string, string | string[]>>;
}) {
  await params;
  await searchParams;
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">Labels</h1>
      <div className="flex items-center gap-2">
        <SyncLabelsButton />
        <AddLabelButton />
      </div>
    </>
  );
}

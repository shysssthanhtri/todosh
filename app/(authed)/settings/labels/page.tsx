import { AddLabelButton } from "./_components/add-label-button";
import { LabelsList } from "./_components/labels-list";
import { SyncLabelsButton } from "./_components/sync-labels-button";

export const metadata = {
  title: "Labels",
  description: "Manage labels for your todos.",
};

const LabelsPage = () => {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Labels</h1>
        <div className="flex items-center gap-2">
          <SyncLabelsButton />
          <AddLabelButton />
        </div>
      </div>
      <LabelsList />
    </div>
  );
};

export default LabelsPage;

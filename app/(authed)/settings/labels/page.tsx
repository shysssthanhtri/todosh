import { AddLabelButton } from "./_components/add-label-button";
import { LabelsList } from "./_components/labels-list";

export const metadata = {
  title: "Labels",
  description: "Manage labels for your todos.",
};

const LabelsPage = () => {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Labels</h1>
        <AddLabelButton />
      </div>
      <LabelsList />
    </div>
  );
};

export default LabelsPage;

import { getLabels } from "../../_actions/labels.action";
import { AddLabelButton } from "./_components/add-label-button";
import { LabelsList } from "./_components/labels-list";

export const metadata = {
  title: "Labels",
  description: "Manage labels for your todos.",
};

export default async function LabelsPage() {
  const labels = await getLabels();

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">Labels</h1>
      <div className="flex items-center justify-start gap-2 mb-4">
        <AddLabelButton />
      </div>
      <LabelsList labels={labels} />
    </>
  );
}

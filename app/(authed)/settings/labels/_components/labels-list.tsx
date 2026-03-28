"use client";

import { useState } from "react";

import { LabelBadge } from "@/components/label-badge";
import { LabelSchemaType } from "@/schemas/label";

import { EditLabelDrawer } from "./edit-label-drawer";

interface LabelsListProps {
  labels: LabelSchemaType[];
}

export function LabelsList({ labels }: LabelsListProps) {
  const [selectedLabel, setSelectedLabel] = useState<LabelSchemaType>();

  if (labels.length === 0) {
    return (
      <div className="flex justify-center py-6 text-sm text-muted-foreground">
        No labels yet
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {labels.map((label) => (
          <LabelBadge
            key={label.id}
            label={label}
            onClick={() => setSelectedLabel(label)}
          />
        ))}
      </div>
      <EditLabelDrawer
        open={!!selectedLabel}
        onOpenChange={() => setSelectedLabel(undefined)}
        label={selectedLabel}
      />
    </>
  );
}

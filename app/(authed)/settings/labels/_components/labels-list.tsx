"use client";

import { useEffect, useState } from "react";

import { LabelBadge } from "@/components/label-badge";
import { LABELS_UPDATED_EVENT } from "@/lib/events";
import { getLabels, type LabelItem } from "@/lib/indexeddb";

import { EditLabelDrawer } from "./edit-label-drawer";

export function LabelsList() {
  const [labels, setLabels] = useState<LabelItem[] | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<LabelItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const loadLabels = async () => {
    try {
      const items = await getLabels();
      setLabels(items);
    } catch {
      // If IndexedDB fails, show empty state; errors will usually be transient.
      setLabels([]);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync checkbox display from parent
    loadLabels();
  }, []);

  useEffect(() => {
    const handler = () => {
      loadLabels();
    };
    window.addEventListener(LABELS_UPDATED_EVENT, handler);
    return () => {
      window.removeEventListener(LABELS_UPDATED_EVENT, handler);
    };
  }, []);

  if (labels === null) {
    return (
      <div className="flex justify-center py-6 text-sm text-muted-foreground">
        Loading labels…
      </div>
    );
  }

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
          <button
            key={label.id}
            type="button"
            className="cursor-pointer rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            onClick={() => {
              setSelectedLabel(label);
              setDrawerOpen(true);
            }}
            aria-label={`Edit label ${label.name}`}
          >
            <LabelBadge label={label} />
          </button>
        ))}
      </div>
      {selectedLabel && (
        <EditLabelDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          label={selectedLabel}
        />
      )}
    </>
  );
}

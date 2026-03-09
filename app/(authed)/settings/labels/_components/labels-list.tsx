"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { LABELS_UPDATED_EVENT } from "@/lib/events";
import { getLabels, type LabelItem } from "@/lib/indexeddb";

export function LabelsList() {
  const [labels, setLabels] = useState<LabelItem[] | null>(null);

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
    <div className="flex flex-wrap gap-2">
      {labels.map((label) => (
        <Badge
          key={label.id}
          variant="outline"
          className="h-6 px-3 py-1 text-sm"
        >
          {label.name}
        </Badge>
      ))}
    </div>
  );
}

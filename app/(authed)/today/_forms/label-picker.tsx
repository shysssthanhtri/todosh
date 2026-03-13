"use client";

import { Tag } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SelectSeparator } from "@/components/ui/select";
import { ROUTES } from "@/constants/routes";
import { getLabels, type LabelItem } from "@/lib/indexeddb";

interface LabelPickerProps {
  value?: string | null;
  onChange?: (labelId: string | null) => void;
}

export function LabelPicker({ value, onChange }: LabelPickerProps) {
  const [open, setOpen] = useState(false);
  const [labels, setLabels] = useState<LabelItem[]>([]);

  const loadLabels = useCallback(async () => {
    try {
      const items = await getLabels();
      setLabels(items);
    } catch {
      setLabels([]);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync checkbox display from parent
    void loadLabels();
  }, [loadLabels]);

  const selectedLabel = value ? labels.find((l) => l.id === value) : null;
  const triggerLabel = selectedLabel ? selectedLabel.name : "Label";

  const handleSelect = (labelId: string | null) => {
    onChange?.(labelId);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Tag className="size-4" />
          {triggerLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-1">
        <div className="flex flex-col gap-0.5">
          <Button
            variant="ghost"
            size="sm"
            className="justify-start font-normal"
            onClick={() => handleSelect(null)}
          >
            None
          </Button>
          <SelectSeparator />
          {labels.map((label) => (
            <Button
              key={label.id}
              variant="ghost"
              size="sm"
              className="justify-start font-normal"
              onClick={() => handleSelect(label.id)}
            >
              {label.name}
            </Button>
          ))}
          <SelectSeparator />
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="justify-start font-normal"
          >
            <Link href={ROUTES.SETTINGS_LABELS} title="New label">
              New label
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

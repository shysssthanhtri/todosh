"use client";

import { format, isSameDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toDueDateUTC } from "@/lib/date-utils";

interface DueDatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
}

export function DueDatePicker({ value, onChange }: DueDatePickerProps) {
  const [open, setOpen] = useState(false);
  const displayDate = value ?? toDueDateUTC(new Date());

  const label = isSameDay(displayDate, new Date())
    ? "Today"
    : format(displayDate, "d MMM");

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    const dueDate = toDueDateUTC(date);
    onChange?.(dueDate);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="default" size="sm" className="gap-1.5">
          <CalendarIcon className="size-4" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={displayDate}
          onSelect={handleSelect}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}

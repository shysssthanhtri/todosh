"use client";

import { Plus } from "lucide-react";
import { FormEvent, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { LABELS_UPDATED_EVENT } from "@/lib/events";
import { type LabelItem, putLabels } from "@/lib/indexeddb";

interface ApiLabel {
  id: string;
  name: string;
  color?: string | null;
  createdAt: string;
  updatedAt: string;
}

export function AddLabelButton() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Label name is required", { position: "top-center" });
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/labels", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ name: trimmedName }),
        });

        if (res.status === 401) {
          throw new Error("Unauthorized");
        }
        if (!res.ok) {
          let message = `Create label failed: ${res.status}`;
          try {
            const data = (await res.json()) as { error?: string };
            if (typeof data?.error === "string") message = data.error;
          } catch {
            // ignore body parse; use default message
          }
          throw new Error(message);
        }

        const listRes = await fetch("/api/labels", {
          method: "GET",
          credentials: "same-origin",
        });

        if (listRes.status === 401) {
          throw new Error("Unauthorized");
        }
        if (!listRes.ok) {
          let message = `Fetch labels failed: ${listRes.status}`;
          try {
            const data = (await listRes.json()) as { error?: string };
            if (typeof data?.error === "string") message = data.error;
          } catch {
            // ignore body parse; use default message
          }
          throw new Error(message);
        }

        const apiLabels = (await listRes.json()) as ApiLabel[];
        const items: LabelItem[] = apiLabels.map((label) => ({
          id: label.id,
          name: label.name,
          color: label.color ?? null,
          createdAt: new Date(label.createdAt),
          updatedAt: new Date(label.updatedAt),
        }));
        await putLabels(items);
        window.dispatchEvent(new CustomEvent(LABELS_UPDATED_EVENT));

        setName("");
        setOpen(false);
        toast.success("Label added", { position: "top-center" });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to add label";
        toast.error(message, { position: "top-center" });
      }
    });
  };

  return (
    <Drawer
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          inputRef.current?.blur();
        }
      }}
      direction="bottom"
      repositionInputs={false}
    >
      <DrawerTrigger asChild>
        <Button type="button" size="sm" disabled={isPending}>
          <Plus className="mr-2 size-4" />
          Add label
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-4 pb-4">
        <DrawerTitle>Add label</DrawerTitle>
        <DrawerDescription>
          Create a label to organize your todos.
        </DrawerDescription>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="label-name"
              className="text-sm font-medium text-foreground"
            >
              Name
            </label>
            <Input
              id="label-name"
              autoFocus
              ref={inputRef}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Work"
              disabled={isPending}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding…" : "Add"}
            </Button>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}

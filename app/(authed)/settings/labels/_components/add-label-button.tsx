"use client";

import { ArrowUp, Plus } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { LABELS_UPDATED_EVENT } from "@/lib/events";
import { type LabelItem, putLabels } from "@/lib/indexeddb";

import { LabelForm, type LabelFormRef } from "../_forms/label-form";

interface ApiLabel {
  id: string;
  name: string;
  color?: string | null;
  createdAt: string;
  updatedAt: string;
}

export function AddLabelButton() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<LabelFormRef | null>(null);

  const handleSubmit = (value: LabelForm.FormValue) => {
    const name = value.name;
    const color = value.color;
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
          body: JSON.stringify({ name: trimmedName, color }),
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

        formRef.current?.reset?.({ name: "", color: undefined });
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
          formRef.current?.blur?.();
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
        <LabelForm
          ref={formRef}
          onSubmit={handleSubmit}
          isPending={isPending}
        />
        <div className="flex items-center justify-end mt-4">
          <Button
            size="icon"
            className="size-10 rounded-full"
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => formRef.current?.submit?.()}
          >
            <ArrowUp className="size-5" />
            <span className="sr-only">Submit</span>
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

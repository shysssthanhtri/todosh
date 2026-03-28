"use client";

import { ArrowUp, Plus } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { createLabel } from "@/app/(authed)/_actions/labels.action";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { LabelForm, type LabelFormRef } from "../_forms/label-form";

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
        await createLabel({ name: trimmedName, color });
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

"use client";

import { Loader2, Trash2 } from "lucide-react";
import React, { useRef, useTransition } from "react";
import { toast } from "sonner";

import {
  deleteLabel,
  updateLabel,
} from "@/app/(authed)/_actions/labels.action";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { LabelSchemaType } from "@/schemas/label";

import { LabelForm, LabelFormRef } from "../_forms/label-form";

interface EditLabelDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  label?: LabelSchemaType;
}
export const EditLabelDrawer = ({
  onOpenChange,
  open,
  label,
}: EditLabelDrawerProps) => {
  const formRef = useRef<LabelFormRef>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!label) return;

    startTransition(async () => {
      try {
        await deleteLabel(label.id);
        onOpenChange(false);
        toast.success("Label removed", { position: "top-center" });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to remove label";
        toast.error(message, { position: "top-center" });
      }
    });
  };

  const handleSubmit = (value: LabelForm.FormValue) => {
    if (!label) return;

    const trimmedName = value.name.trim();
    if (!trimmedName) {
      toast.error("Label name is required", { position: "top-center" });
      return;
    }

    startTransition(async () => {
      try {
        await updateLabel({
          id: label.id,
          name: trimmedName,
          color: value.color,
        });
        onOpenChange(false);
        toast.success("Label updated", { position: "top-center" });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to update label";
        toast.error(message, { position: "top-center" });
      }
    });
  };

  if (!label) {
    return null;
  }

  return (
    <Drawer
      direction="bottom"
      repositionInputs={false}
      onOpenChange={(open) => {
        if (!open) formRef.current?.blur?.();
        onOpenChange(open);
      }}
      open={open}
    >
      <DrawerContent className="px-4 pb-4">
        <DrawerTitle className="sr-only">Edit Label</DrawerTitle>
        <DrawerDescription className="sr-only">
          Update the name or color for this label
        </DrawerDescription>
        <div className="mt-4 flex flex-col gap-3">
          <LabelForm
            key={label.id}
            ref={formRef}
            onSubmit={handleSubmit}
            isPending={isPending}
            value={label}
          />
          <div className="mt-4 flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isPending}
              onClick={handleDelete}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              {isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 size-4" />
              )}
              Remove
            </Button>
            <Button
              type="button"
              disabled={isPending}
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => formRef.current?.submit?.()}
            >
              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Update
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

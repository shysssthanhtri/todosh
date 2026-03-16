"use client";

import { Loader2, Trash2 } from "lucide-react";
import React, { useRef, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { LABELS_UPDATED_EVENT } from "@/lib/events";
import { type LabelItem, putLabels } from "@/lib/indexeddb";

import { LabelForm, LabelFormRef } from "../_forms/label-form";

interface ApiLabel {
  id: string;
  name: string;
  color?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface EditLabelDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  label: LabelItem;
}
export const EditLabelDrawer = ({
  onOpenChange,
  open,
  label,
}: EditLabelDrawerProps) => {
  const formRef = useRef<LabelFormRef>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/labels/${label.id}`, {
          method: "DELETE",
          credentials: "same-origin",
        });

        if (res.status === 401) {
          throw new Error("Unauthorized");
        }
        if (res.status !== 204 && !res.ok) {
          let message = `Delete label failed: ${res.status}`;
          try {
            const data = (await res.json()) as { error?: string };
            if (typeof data?.error === "string") message = data.error;
          } catch {
            // ignore
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
            // ignore
          }
          throw new Error(message);
        }

        const apiLabels = (await listRes.json()) as ApiLabel[];
        const items: LabelItem[] = apiLabels.map((l) => ({
          id: l.id,
          name: l.name,
          color: l.color ?? null,
          createdAt: new Date(l.createdAt),
          updatedAt: new Date(l.updatedAt),
        }));
        await putLabels(items);
        window.dispatchEvent(new CustomEvent(LABELS_UPDATED_EVENT));

        toast.success("Label removed", { position: "top-center" });
        onOpenChange(false);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to remove label";
        toast.error(message, { position: "top-center" });
      }
    });
  };

  const handleSubmit = (value: LabelForm.FormValue) => {
    const trimmedName = value.name.trim();
    if (!trimmedName) {
      toast.error("Label name is required", { position: "top-center" });
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch(`/api/labels/${label.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({
            name: trimmedName,
            color: value.color ?? null,
          }),
        });

        if (res.status === 401) {
          throw new Error("Unauthorized");
        }
        if (!res.ok) {
          let message = `Update label failed: ${res.status}`;
          try {
            const data = (await res.json()) as { error?: string };
            if (typeof data?.error === "string") message = data.error;
          } catch {
            // ignore
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
            // ignore
          }
          throw new Error(message);
        }

        const apiLabels = (await listRes.json()) as ApiLabel[];
        const items: LabelItem[] = apiLabels.map((l) => ({
          id: l.id,
          name: l.name,
          color: l.color ?? null,
          createdAt: new Date(l.createdAt),
          updatedAt: new Date(l.updatedAt),
        }));
        await putLabels(items);
        window.dispatchEvent(new CustomEvent(LABELS_UPDATED_EVENT));

        toast.success("Label updated", { position: "top-center" });
        onOpenChange(false);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to update label";
        toast.error(message, { position: "top-center" });
      }
    });
  };

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

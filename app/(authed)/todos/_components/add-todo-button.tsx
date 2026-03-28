"use client";

import { Plus } from "lucide-react";
import { useRef, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { TODO_ADDED_EVENT, TODO_CHANGED_EVENT } from "@/lib/events";
import { addTodo } from "@/lib/indexeddb";
import { recordUpsert } from "@/lib/todo-sync";

import { TodoForm, TodoFormRef } from "../_forms/todo-form";

export const AddTodoButton = () => {
  const formRef = useRef<TodoFormRef>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (value: TodoForm.FormValue) => {
    startTransition(async () => {
      try {
        const addedTodo = await addTodo({
          title: value.title,
          completed: false,
          dueDate: value.dueDate,
          labelId: value.labelId ?? undefined,
        });
        recordUpsert(addedTodo);
        formRef.current?.reset?.();
        window.dispatchEvent(new CustomEvent(TODO_ADDED_EVENT));
        window.dispatchEvent(new CustomEvent(TODO_CHANGED_EVENT));
        toast.success("Todo added", { position: "top-center" });
        // Defer focus so it runs after React commits the reset and toast renders.
        // Double rAF ensures layout/paint before focusing; fallback for Enter-key submit or edge cases.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            formRef.current?.focus?.();
          });
        });
      } catch {
        toast.error("Failed to add todo", { position: "top-center" });
      }
    });
  };

  return (
    <Drawer
      direction="bottom"
      repositionInputs={false}
      onOpenChange={(open) => {
        if (!open) formRef.current?.blur?.();
      }}
    >
      <DrawerTrigger asChild>
        <Button
          size="icon"
          className="fixed right-6 bottom-22 size-14 rounded-full shadow-lg"
        >
          <Plus className="size-6" />
          <span className="sr-only">Add</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-4 pb-4">
        <DrawerTitle className="sr-only">Add Todo</DrawerTitle>
        <DrawerDescription className="sr-only">
          Enter a title for your new todo item
        </DrawerDescription>
        <div className="mt-4 flex flex-col gap-3">
          <TodoForm
            ref={formRef}
            onSubmit={handleSubmit}
            isPending={isPending}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

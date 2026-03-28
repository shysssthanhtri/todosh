"use client";

import React, { useRef, useTransition } from "react";
import { toast } from "sonner";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { TODO_CHANGED_EVENT, TODO_UPDATED_EVENT } from "@/lib/events";
import { updateTodo } from "@/lib/indexeddb";
import { recordUpsert } from "@/lib/todo-sync";

import { RichTodoType } from "../../_types/rich-todo";
import { TodoForm, TodoFormRef } from "../_forms/todo-form";

interface EditTodoDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  todo: RichTodoType;
}
export const EditTodoDrawer = ({
  onOpenChange,
  open,
  todo,
}: EditTodoDrawerProps) => {
  const formRef = useRef<TodoFormRef>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (value: TodoForm.FormValue) => {
    startTransition(async () => {
      try {
        const updatedTodo = await updateTodo(todo.id, {
          title: value.title,
          dueDate: value.dueDate,
          labelId: value.labelId,
        });
        recordUpsert(updatedTodo);
        window.dispatchEvent(new CustomEvent(TODO_UPDATED_EVENT));
        window.dispatchEvent(new CustomEvent(TODO_CHANGED_EVENT));
        toast.success("Todo updated", { position: "top-center" });
        onOpenChange(false);
      } catch {
        toast.error("Failed to update todo", { position: "top-center" });
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
        <DrawerTitle className="sr-only">Edit Todo</DrawerTitle>
        <DrawerDescription className="sr-only">
          Update the title, due date, or label for this todo
        </DrawerDescription>
        <div className="mt-4 flex flex-col gap-3">
          <TodoForm
            ref={formRef}
            onSubmit={handleSubmit}
            isPending={isPending}
            value={{
              title: todo.title,
              dueDate: todo.dueDate ?? undefined,
              labelId: todo.labelId ?? null,
            }}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

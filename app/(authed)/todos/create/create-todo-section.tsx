"use client";

import React, { useRef, useTransition } from "react";
import { toast } from "sonner";

import { LabelSchemaType } from "@/schemas/label";

import { createTodo } from "../../_actions/todos.action";
import { TodoForm, TodoFormRef } from "../_forms/todo-form";

interface CreateTodoSectionProps {
  labels: LabelSchemaType[];
}
export const CreateTodoSection = ({ labels }: CreateTodoSectionProps) => {
  const formRef = useRef<TodoFormRef>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (value: TodoForm.FormValue) => {
    startTransition(async () => {
      try {
        await createTodo({
          title: value.title,
          dueDate: value.dueDate,
          labelId: value.labelId ?? undefined,
        });
        toast.success("Todo added", { position: "top-center" });
        formRef.current?.reset?.();
      } catch (error) {
        toast.error(
          `Failed to add todo: ${error instanceof Error ? error.message : "Unknown error"}`,
          { position: "top-center" },
        );
      }
    });
  };

  return (
    <TodoForm
      ref={formRef}
      onSubmit={handleSubmit}
      isPending={isPending}
      labels={labels}
    />
  );
};

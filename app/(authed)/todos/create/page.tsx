"use client";

import React, { useRef, useTransition } from "react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";

import { createTodo } from "../../_actions/todos.action";
import { TodoForm, TodoFormRef } from "../_forms/todo-form";

const CreateTodoPage = () => {
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
    <>
      <h1 className="mb-6 text-2xl font-bold">New todo</h1>
      <Card>
        <CardContent>
          <TodoForm
            ref={formRef}
            onSubmit={handleSubmit}
            isPending={isPending}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default CreateTodoPage;

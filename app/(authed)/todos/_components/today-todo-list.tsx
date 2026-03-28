"use client";

import { endOfDay, isBefore } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TodoSchemaType } from "@/schemas/todo";

import { completeTodo } from "../../_actions/todos.action";
import { TodoList } from "../../_components/todo-list";
import { RichTodoType } from "../../_types/rich-todo";

interface TodayTodoListProps {
  todos: TodoSchemaType[];
}
export const TodayTodoList = ({ todos }: TodayTodoListProps) => {
  const [isShowFeatureTodos, setIsShowFeatureTodos] = useState(false);

  const handleComplete = async (id: string) => {
    try {
      await completeTodo(id);
    } catch (error) {
      toast.error(
        `Failed to complete todo: ${error instanceof Error ? error.message : "Unknown error"}`,
        { position: "top-center" },
      );
    }
  };

  const handleDelete = async (_id: string) => {};

  const richTodos = todos
    .filter((todo) =>
      !isShowFeatureTodos
        ? todo.dueDate && isBefore(endOfDay(todo.dueDate), endOfDay(new Date()))
        : true,
    )
    .map<RichTodoType>((todo) => ({
      ...todo,
      onDelete: () => handleDelete(todo.id),
      onComplete: () => handleComplete(todo.id),
    }));

  return (
    <>
      <div className="mb-4 flex items-center gap-2 justify-end">
        <Checkbox
          id="show-feature-todos"
          checked={isShowFeatureTodos}
          onCheckedChange={(checked) => setIsShowFeatureTodos(checked === true)}
        />
        <Label
          htmlFor="show-feature-todos"
          className="cursor-pointer font-normal text-muted-foreground"
        >
          Show all todos
        </Label>
      </div>

      <TodoList todos={richTodos} />
    </>
  );
};

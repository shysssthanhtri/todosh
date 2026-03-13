"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  LABELS_UPDATED_EVENT,
  TODO_ADDED_EVENT,
  TODO_SYNCED_EVENT,
} from "@/lib/events";
import {
  deleteTodo,
  getIncompleteTodosByDateRange,
  getLabels,
  updateTodo,
} from "@/lib/indexeddb";
import { recordDelete, recordUpsert } from "@/lib/todo-sync";

import { RichTodoType } from "../types/rich-todo";
import { TodoList } from "./todo-list";

interface TodoListByDateRangeProps {
  start: Date;
  end: Date;
}

export const TodoListByDateRange = (props: TodoListByDateRangeProps) => {
  const { start, end } = props;
  const [todos, setTodos] = useState<RichTodoType[]>([]);

  const handleComplete = async (id: string) => {
    try {
      const updatedTodo = await updateTodo(id, { completed: true });
      recordUpsert(updatedTodo);
      await deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch {
      toast.error("Failed to update todo", { position: "top-center" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id);
      recordDelete(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch {
      toast.error("Failed to delete todo", { position: "top-center" });
    }
  };

  const loadTodos = useCallback(async () => {
    try {
      const [items, labels] = await Promise.all([
        getIncompleteTodosByDateRange(start, end),
        getLabels(),
      ]);
      const labelByName = new Map(labels.map((l) => [l.id, l]));
      setTodos(
        items.map((item) => {
          const label = item.labelId
            ? labelByName.get(item.labelId)
            : undefined;
          return {
            ...item,
            label: label
              ? {
                  name: label.name,
                  color: (label.color ?? null) as RichTodoType["label"] extends
                    | { color: infer C }
                    | undefined
                    ? C
                    : never,
                }
              : undefined,
            onDelete: () => handleDelete(item.id),
            onToggle: () => handleComplete(item.id),
          };
        }),
      );
    } catch (error) {
      toast.error(
        `Failed to load todos: ${error instanceof Error ? error.message : "Unknown error"}`,
        { position: "top-center" },
      );
    }
  }, [start, end]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTodos();
  }, [loadTodos]);

  useEffect(() => {
    const handleRefresh = () => {
      loadTodos();
    };

    window.addEventListener(TODO_ADDED_EVENT, handleRefresh);
    window.addEventListener(TODO_SYNCED_EVENT, handleRefresh);
    window.addEventListener(LABELS_UPDATED_EVENT, handleRefresh);
    return () => {
      window.removeEventListener(TODO_ADDED_EVENT, handleRefresh);
      window.removeEventListener(TODO_SYNCED_EVENT, handleRefresh);
      window.removeEventListener(LABELS_UPDATED_EVENT, handleRefresh);
    };
  }, [loadTodos]);

  if (todos.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <span className="text-muted-foreground">No todos yet</span>
      </div>
    );
  }

  return <TodoList todos={todos} />;
};

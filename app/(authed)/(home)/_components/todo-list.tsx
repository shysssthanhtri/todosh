"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  deleteTodo,
  getAllTodos,
  TodoItem as TodoItemType,
  updateTodo,
} from "@/lib/indexeddb";
import { recordDelete, recordUpsert } from "@/lib/todo-sync";

import { TodoItem } from "./todo-item";

export const TodoList = () => {
  const [todos, setTodos] = useState<TodoItemType[]>([]);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [isLoading, startTransition] = useTransition();

  const loadTodos = useCallback(() => {
    startTransition(async () => {
      try {
        const items = await getAllTodos();
        setTodos(items);
      } catch {
        toast.error("Failed to load todos", { position: "top-center" });
      } finally {
        setHasLoadedOnce(true);
      }
    });
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  useEffect(() => {
    const handleTodoAdded = () => {
      loadTodos();
    };

    window.addEventListener("todo-added", handleTodoAdded);
    return () => window.removeEventListener("todo-added", handleTodoAdded);
  }, [loadTodos]);

  useEffect(() => {
    const handleTodoSynced = () => {
      loadTodos();
    };

    window.addEventListener("todo-synced", handleTodoSynced);
    return () => window.removeEventListener("todo-synced", handleTodoSynced);
  }, [loadTodos]);

  const handleToggle = async (id: string, completed: boolean) => {
    try {
      const updatedTodo = await updateTodo(id, { completed });
      recordUpsert(updatedTodo);
      if (completed) {
        await deleteTodo(id);
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
      } else {
        setTodos((prev) =>
          prev.map((todo) => (todo.id === id ? { ...todo, completed } : todo)),
        );
      }
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

  if (!hasLoadedOnce || isLoading) {
    const skeletonCount = 5;
    return (
      <div className="flex flex-col">
        {Array.from({ length: skeletonCount }, (_, index) => (
          <div key={index}>
            <div className="flex items-start gap-3 py-3">
              <Skeleton className="size-5 shrink-0 rounded-full" />
              <Skeleton className="h-5 flex-1 max-w-[80%]" />
            </div>
            {index < skeletonCount - 1 && <Separator />}
          </div>
        ))}
      </div>
    );
  }

  if (hasLoadedOnce && todos.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <span className="text-muted-foreground">No todos yet</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {todos.map((todo, index) => (
        <div key={todo.id}>
          <TodoItem
            todo={todo}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
          {index < todos.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  );
};

"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { Separator } from "@/components/ui/separator";
import {
  deleteTodo,
  getAllTodos,
  TodoItem as TodoItemType,
  updateTodo,
} from "@/lib/indexeddb";

import { TodoItem } from "./todo-item";

export const TodoList = () => {
  const [todos, setTodos] = useState<TodoItemType[]>([]);
  const [isLoading, startTransition] = useTransition();

  const loadTodos = useCallback(() => {
    startTransition(async () => {
      try {
        const items = await getAllTodos();
        setTodos(items);
      } catch {
        toast.error("Failed to load todos", { position: "top-center" });
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

  const handleToggle = async (id: string, completed: boolean) => {
    try {
      await updateTodo(id, { completed });
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, completed } : todo)),
      );
    } catch {
      toast.error("Failed to update todo", { position: "top-center" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch {
      toast.error("Failed to delete todo", { position: "top-center" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <span className="text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (todos.length === 0) {
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

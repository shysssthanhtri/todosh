"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Separator } from "@/components/ui/separator";
import {
  deleteTodo,
  getAllTodos,
  TodoItem as TodoItemType,
  updateTodo,
} from "@/lib/indexeddb";
import { recordDelete, recordUpsert } from "@/lib/todo-sync";

import { TodoItem } from "../../_components/todo-item";

export const TodoList = () => {
  const [todos, setTodos] = useState<TodoItemType[]>([]);

  const loadTodos = useCallback(async () => {
    try {
      const items = await getAllTodos();
      setTodos(items);
    } catch {
      toast.error("Failed to load todos", { position: "top-center" });
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  if (todos.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <span className="text-muted-foreground">No todos yet</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {todos
        .sort((a, b) => (a.createdAt.getTime() - b.createdAt.getTime()) * -1)
        .map((todo, index) => (
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

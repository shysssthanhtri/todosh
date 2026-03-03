"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { getAllTodos, TodoItem, updateTodo } from "@/lib/indexeddb";

const sortTodos = (items: TodoItem[]) =>
  items.sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

export const TodoList = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTodos = useCallback(async () => {
    try {
      const items = await getAllTodos();
      setTodos(sortTodos(items));
    } catch {
      toast.error("Failed to load todos", { position: "top-center" });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTodos();
  }, [loadTodos]);

  useEffect(() => {
    const handleTodoAdded = () => {
      void loadTodos();
    };

    window.addEventListener("todo-added", handleTodoAdded);
    return () => window.removeEventListener("todo-added", handleTodoAdded);
  }, [loadTodos]);

  const handleToggle = async (id: string, completed: boolean) => {
    try {
      await updateTodo(id, { completed });
      setTodos((prev) =>
        sortTodos(
          prev.map((todo) => (todo.id === id ? { ...todo, completed } : todo)),
        ),
      );
    } catch {
      toast.error("Failed to update todo", { position: "top-center" });
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
    <div className="flex flex-col gap-2">
      {todos.map((todo) => (
        <Card key={todo.id}>
          <CardContent className="flex items-center gap-3 py-3">
            <Checkbox
              id={`todo-${todo.id}`}
              checked={todo.completed}
              onCheckedChange={(checked) =>
                handleToggle(todo.id, checked === true)
              }
            />
            <label
              htmlFor={`todo-${todo.id}`}
              className={`flex-1 cursor-pointer ${todo.completed ? "text-muted-foreground line-through" : ""}`}
            >
              {todo.title}
            </label>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

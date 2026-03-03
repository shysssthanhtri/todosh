"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { TodoItem as TodoItemType } from "@/lib/indexeddb";

interface Props {
  todo: TodoItemType;
  onToggle: (id: string, completed: boolean) => void;
}

export const TodoItem = ({ todo, onToggle }: Props) => {
  return (
    <div className="flex items-start gap-3 py-3">
      <Checkbox
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onCheckedChange={(checked) => onToggle(todo.id, checked === true)}
        className="mt-0.5 size-5 rounded-full"
      />
      <label
        htmlFor={`todo-${todo.id}`}
        className="flex flex-1 cursor-pointer flex-col gap-1"
      >
        <span
          className={todo.completed ? "text-muted-foreground line-through" : ""}
        >
          {todo.title}
        </span>
      </label>
    </div>
  );
};

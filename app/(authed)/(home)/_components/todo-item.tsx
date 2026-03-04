"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SwipeableItem } from "@/components/ui/swipeable-item";
import { TodoItem as TodoItemType } from "@/lib/indexeddb";

interface Props {
  todo: TodoItemType;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export const TodoItem = ({ todo, onToggle, onDelete }: Props) => {
  return (
    <SwipeableItem
      leftContent={
        <div className="px-2">
          <Button
            onClick={() => onDelete(todo.id)}
            variant="destructive"
            className="rounded-full size-8"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      }
    >
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
            className={
              todo.completed ? "text-muted-foreground line-through" : ""
            }
          >
            {todo.title}
          </span>
        </label>
      </div>
    </SwipeableItem>
  );
};

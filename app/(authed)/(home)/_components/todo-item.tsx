"use client";

import { Trash2 } from "lucide-react";

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
      fullSwipe
      fullSwipeThreshold={0.2}
      leftButtons={[
        {
          icon: <Trash2 className="size-4" />,
          onClick: () => onDelete(todo.id),
          ariaLabel: "Delete todo item",
          variant: "destructive",
        },
        {
          icon: <Trash2 className="size-4" />,
          onClick: () => onDelete(todo.id),
          ariaLabel: "Delete todo item",
        },
      ]}
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

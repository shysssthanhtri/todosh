"use client";

import { format } from "date-fns";
import { Calendar, Trash2 } from "lucide-react";
import { useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { SwipeableItem } from "@/components/ui/swipeable-item";
import { isOverdue } from "@/lib/date-utils";
import { TodoItem as TodoItemType } from "@/lib/indexeddb";

interface Props {
  todo: TodoItemType;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

const SWIPE_THRESHOLD = 0.2;
const LINE_THROUGH_DELAY_MS = 200;
const FADE_DURATION_MS = 300;

export const TodoItem = ({ todo, onToggle, onDelete }: Props) => {
  const [isHiding, setIsHiding] = useState(false);
  const [isCompleted, setIsCompleted] = useState(todo.completed);
  const dueDate = todo.dueDate ? new Date(todo.dueDate) : undefined;
  const showDueDate = Boolean(dueDate);
  const dueDateLabel = dueDate ? format(dueDate, "d MMM") : "";
  const dueDateIsOverdue = dueDate ? isOverdue(dueDate) : false;

  const handleToggle = (checked: boolean) => {
    if (checked) {
      // First show line-through
      setIsCompleted(true);
      // Then start fade animation after a brief delay
      setTimeout(() => {
        setIsHiding(true);
        // Finally delete after fade completes
        setTimeout(() => {
          onDelete(todo.id);
        }, FADE_DURATION_MS);
      }, LINE_THROUGH_DELAY_MS);
    } else {
      setIsCompleted(false);
      onToggle(todo.id, false);
    }
  };

  return (
    <SwipeableItem
      fullSwipe
      fullSwipeThreshold={SWIPE_THRESHOLD}
      leftButtons={[
        {
          icon: <Trash2 className="size-4" />,
          onClick: () => onDelete(todo.id),
          ariaLabel: "Delete todo item",
          variant: "destructive",
        },
      ]}
    >
      <div
        className={`flex items-start gap-3 py-3 transition-opacity duration-300 ${
          isHiding ? "opacity-0" : "opacity-100"
        }`}
      >
        <Checkbox
          id={`todo-${todo.id}`}
          checked={isCompleted}
          onCheckedChange={(checked) => handleToggle(checked === true)}
          className="mt-0.5 size-5 rounded-full"
        />
        <label
          htmlFor={`todo-${todo.id}`}
          className="flex flex-1 cursor-pointer flex-col gap-1"
        >
          <span
            className={isCompleted ? "text-muted-foreground line-through" : ""}
          >
            {todo.title}
          </span>
          {showDueDate && (
            <span
              className={[
                "flex items-center gap-1 text-xs",
                dueDateIsOverdue ? "text-destructive" : "text-muted-foreground",
              ].join(" ")}
            >
              <Calendar className="size-3.5" />
              {dueDateLabel}
            </span>
          )}
        </label>
      </div>
    </SwipeableItem>
  );
};

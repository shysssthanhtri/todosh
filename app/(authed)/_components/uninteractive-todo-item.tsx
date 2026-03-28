"use client";

import { format, isToday, isTomorrow, isYesterday } from "date-fns";
import { Calendar } from "lucide-react";

import { LabelBadge } from "@/components/label-badge";
import { Checkbox } from "@/components/ui/checkbox";
import { isOverdue } from "@/lib/date-utils";

import { UnInteractiveTodoType } from "../_types/rich-todo";

interface UnInteractiveTodoItemProps {
  todo: UnInteractiveTodoType;
  isHiding: boolean;
  isCompleted: boolean;
  onComplete: () => void;
}
export const UnInteractiveTodoItem = ({
  todo,
  isHiding,
  isCompleted,
  onComplete,
}: UnInteractiveTodoItemProps) => {
  const dueDateIsOverdue = todo.dueDate
    ? isOverdue(new Date(todo.dueDate))
    : false;

  const dueDateLabel = todo.dueDate
    ? isToday(new Date(todo.dueDate))
      ? "today"
      : isTomorrow(todo.dueDate)
        ? "tomorrow"
        : isYesterday(todo.dueDate)
          ? "yesterday"
          : format(todo.dueDate, "d MMM")
    : "";

  return (
    <div
      className={`flex items-start gap-3 py-3 transition-opacity duration-300 ${
        isHiding ? "opacity-0" : "opacity-100"
      }`}
    >
      <Checkbox
        id={`todo-${todo.id}`}
        onCheckedChange={() => onComplete()}
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
        {(!!todo.dueDate || todo.label?.name) && (
          <span className="flex flex-wrap items-center gap-2 text-xs">
            {!!todo.dueDate && (
              <span
                className={[
                  "flex items-center gap-1",
                  dueDateIsOverdue
                    ? "text-destructive"
                    : "text-muted-foreground",
                ].join(" ")}
              >
                <Calendar className="size-3.5" />
                {dueDateLabel}
              </span>
            )}
            {todo.label && (
              <LabelBadge
                label={todo.label}
                className="h-5 px-2 py-0 text-xs font-normal"
              />
            )}
          </span>
        )}
      </label>
    </div>
  );
};

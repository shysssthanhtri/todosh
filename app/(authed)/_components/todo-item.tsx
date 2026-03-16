"use client";

import { format, isToday, isTomorrow, isYesterday } from "date-fns";
import { Calendar, Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { LabelBadge } from "@/components/label-badge";
import { Checkbox } from "@/components/ui/checkbox";
import { SwipeableItem } from "@/components/ui/swipeable-item";
import { isOverdue } from "@/lib/date-utils";

import { EditTodoDrawer } from "../today/_components/edit-todo-drawer";
import type { RichTodoType } from "../types/rich-todo";

interface Props {
  todo: RichTodoType;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

const SWIPE_THRESHOLD = 0.2;
const LINE_THROUGH_DELAY_MS = 200;
const FADE_DURATION_MS = 300;

export const TodoItem = ({ todo, onToggle, onDelete }: Props) => {
  const [isCompleted, setIsCompleted] = useState(todo.completed);
  const [isHiding, setIsHiding] = useState(false);
  const [editTodoOpen, setEditTodoOpen] = useState(false);

  // Sync display from prop when todo.completed changes (e.g. after uncheck or list refresh)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync checkbox display from parent
    setIsCompleted(todo.completed);
  }, [todo.completed]);

  const dueDate = todo.dueDate ? new Date(todo.dueDate) : undefined;
  const showDueDate = Boolean(dueDate);
  const dueDateLabel = dueDate
    ? isToday(dueDate)
      ? "today"
      : isTomorrow(dueDate)
        ? "tomorrow"
        : isYesterday(dueDate)
          ? "yesterday"
          : format(dueDate, "d MMM")
    : "";
  const dueDateIsOverdue = dueDate ? isOverdue(dueDate) : false;

  const handleToggle = (checked: boolean) => {
    if (checked) {
      setIsCompleted(true);
      setTimeout(() => {
        setIsHiding(true);
        setTimeout(() => {
          onToggle(todo.id, true);
        }, FADE_DURATION_MS);
      }, LINE_THROUGH_DELAY_MS);
    } else {
      setIsCompleted(false);
      onToggle(todo.id, false);
    }
  };

  return (
    <>
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
        rightButtons={[
          {
            icon: <Edit className="size-4" />,
            ariaLabel: "Edit todo item",
            variant: "secondary",
            onClick: () => setEditTodoOpen(true),
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
              className={
                isCompleted ? "text-muted-foreground line-through" : ""
              }
            >
              {todo.title}
            </span>
            {(showDueDate || todo.label?.name) && (
              <span className="flex flex-wrap items-center gap-2 text-xs">
                {showDueDate && (
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
                    name={todo.label.name}
                    color={todo.label.color}
                    className="h-5 px-2 py-0 text-xs font-normal"
                  />
                )}
              </span>
            )}
          </label>
        </div>
      </SwipeableItem>
      <EditTodoDrawer
        open={editTodoOpen}
        onOpenChange={setEditTodoOpen}
        todo={todo}
      />
    </>
  );
};

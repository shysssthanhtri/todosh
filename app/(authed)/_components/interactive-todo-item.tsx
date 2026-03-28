import { Edit, Trash2 } from "lucide-react";
import React, { useState } from "react";

import { Separator } from "@/components/ui/separator";
import { SwipeableItem } from "@/components/ui/swipeable-item";
import { LabelSchemaType } from "@/schemas/label";

import { RichTodoType } from "../_types/rich-todo";
import { EditTodoDrawer } from "../todos/_components/edit-todo-drawer";
import { UnInteractiveTodoItem } from "./uninteractive-todo-item";

interface InteractiveTodoItemProps {
  todo: RichTodoType;
  labels: LabelSchemaType[];
}

const FADE_DURATION_MS = 300;
const SWIPE_THRESHOLD = 0.2;

const wait = async (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

export const InteractiveTodoItem = ({
  todo,
  labels,
}: InteractiveTodoItemProps) => {
  const [isHiding, setIsHiding] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isTransitionFinished, setIsTransitionFinished] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isEditTodoOpen, setIsEditTodoOpen] = useState(false);

  const handleComplete = async () => {
    setIsCompleted(true);
    await wait(FADE_DURATION_MS);
    setIsHiding(true);
    await wait(FADE_DURATION_MS);
    setIsTransitionFinished(true);

    todo.onComplete();
  };

  const handleDelete = async () => {
    setIsDeleted(true);
    await todo.onDelete();
  };

  if (isTransitionFinished || isDeleted) return null;

  return (
    <>
      <SwipeableItem
        fullSwipe
        fullSwipeThreshold={SWIPE_THRESHOLD}
        leftButtons={[
          {
            icon: <Trash2 className="size-4" />,
            onClick: () => handleDelete(),
            ariaLabel: "Delete todo item",
            variant: "destructive",
          },
        ]}
        rightButtons={[
          {
            icon: <Edit className="size-4" />,
            ariaLabel: "Edit todo item",
            variant: "secondary",
            onClick: () => setIsEditTodoOpen(true),
          },
        ]}
      >
        <UnInteractiveTodoItem
          todo={todo}
          isHiding={isHiding}
          isCompleted={isCompleted}
          onComplete={handleComplete}
        />
      </SwipeableItem>

      <Separator />

      <EditTodoDrawer
        open={isEditTodoOpen}
        onOpenChange={setIsEditTodoOpen}
        todo={todo}
        labels={labels}
      />
    </>
  );
};

import React, { useState } from "react";

import { Separator } from "@/components/ui/separator";

import { RichTodoType } from "../_types/rich-todo";
import { UnInteractiveTodoItem } from "./uninteractive-todo-item";

interface InteractiveTodoItemProps {
  todo: RichTodoType;
}

const FADE_DURATION_MS = 300;

const wait = async (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

export const InteractiveTodoItem = ({ todo }: InteractiveTodoItemProps) => {
  const [isHiding, setIsHiding] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isTransitionFinished, setIsTransitionFinished] = useState(false);

  const handleComplete = async () => {
    // Apply immediately — updates inside startTransition are deferred and delay line-through.
    setIsCompleted(true);
    await wait(FADE_DURATION_MS);
    setIsHiding(true);
    await wait(FADE_DURATION_MS);
    setIsTransitionFinished(true);

    todo.onComplete();
  };

  if (isTransitionFinished) return null;

  return (
    <>
      <UnInteractiveTodoItem
        todo={todo}
        isHiding={isHiding}
        isCompleted={isCompleted}
        onComplete={handleComplete}
      />

      <Separator />
    </>
  );
};

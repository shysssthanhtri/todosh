"use client";

import { endOfDay, isSameDay, startOfDay, subDays } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { UnInteractiveTodoType } from "@/app/(authed)/_types/rich-todo";

import { getTodos } from "../_actions/todos.action";
import { BreakdownCard } from "./_components/breakdown-card";
import { HistoryCard } from "./_components/history-card";
import { HistoryLabelCard } from "./_components/history-label-card";
import { ProgressCard } from "./_components/progress-card";

function getDateRange() {
  const now = new Date();
  const start = startOfDay(subDays(now, 4));
  const end = endOfDay(now);
  return { start, end };
}

const DashboardPage = () => {
  const [todos, setTodos] = useState<UnInteractiveTodoType[]>([]);
  const now = new Date();

  useEffect(() => {
    const { start, end } = getDateRange();
    getTodos({ start, end, getAll: true })
      .then(setTodos)
      .catch((error) => {
        toast.error(
          `Failed to fetch todos: ${error instanceof Error ? error.message : "Unknown error"}`,
          { position: "top-center" },
        );
      });
  }, []);

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ProgressCard
            todos={todos.filter(
              (todo) =>
                (todo.dueDate && isSameDay(todo.dueDate, now)) ||
                (todo.completedAt && isSameDay(todo.completedAt, now)),
            )}
          />
          <BreakdownCard
            todos={todos.filter(
              (todo) =>
                (todo.dueDate && isSameDay(todo.dueDate, now)) ||
                (todo.completedAt && isSameDay(todo.completedAt, now)),
            )}
          />
        </div>

        <HistoryCard todos={todos} />
        <HistoryLabelCard todos={todos} />
      </div>
    </>
  );
};

export default DashboardPage;

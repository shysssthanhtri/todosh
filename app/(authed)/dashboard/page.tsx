"use client";

import { endOfDay, isSameDay, startOfDay, subDays } from "date-fns";
import { useEffect, useState } from "react";

import type { UnInteractiveTodoType } from "@/app/(authed)/types/rich-todo";
import type { LabelColor } from "@/schemas/label";

import { BreakdownCard } from "./_components/breakdown-card";
import { HistoryCard } from "./_components/history-card";
import { HistoryLabelCard } from "./_components/history-label-card";
import { ProgressCard } from "./_components/progress-card";

type TodoApiResponse = {
  id: string;
  title: string;
  completed: boolean;
  completedAt: string | null;
  dueDate: string | null;
  labelId: string | null;
  label: { name: string; color: string | null } | null;
  createdAt: string;
  updatedAt: string;
};

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
    const params = new URLSearchParams({
      start: start.toISOString(),
      end: end.toISOString(),
    });

    fetch(`/api/todos?${params}`)
      .then((res) => res.json())
      .then((data: TodoApiResponse[]) => {
        setTodos(
          data.map((t) => ({
            id: t.id,
            title: t.title,
            completed: t.completed,
            completedAt: t.completedAt ? new Date(t.completedAt) : undefined,
            dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
            labelId: t.labelId,
            label: t.label
              ? {
                  name: t.label.name,
                  color: (t.label.color as LabelColor) ?? undefined,
                }
              : undefined,
            createdAt: new Date(t.createdAt),
            updatedAt: new Date(t.updatedAt),
          })),
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

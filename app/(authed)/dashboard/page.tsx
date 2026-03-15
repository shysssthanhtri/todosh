"use client";

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
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return { start, end };
}

const DashboardPage = () => {
  const [todos, setTodos] = useState<UnInteractiveTodoType[]>([]);

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
    <div className="container mx-auto max-w-4xl px-4 py-6">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ProgressCard todos={todos} />
          <BreakdownCard todos={todos} />
        </div>

        <HistoryCard todos={todos} />
        <HistoryLabelCard todos={todos} />
      </div>
    </div>
  );
};

export default DashboardPage;

"use client";

import * as React from "react";

import type { RichTodoType } from "@/app/(authed)/types/rich-todo";
import { getMockBreakdownTodos } from "@/lib/dashboard-mock";

import { BreakdownCard } from "./_components/breakdown-card";
import { HistoryCard } from "./_components/history-card";
import { HistoryLabelCard } from "./_components/history-label-card";
import { ProgressCard } from "./_components/progress-card";

const DashboardPage = () => {
  const breakdownTodos = getMockBreakdownTodos().map((t) => ({
    ...t,
    dueDate: t.dueDate ?? new Date(),
    completedAt: t.completedAt ?? undefined,
  })) as RichTodoType[];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ProgressCard todos={breakdownTodos} />
          <BreakdownCard todos={breakdownTodos} />
        </div>

        <HistoryCard todos={breakdownTodos} />
        <HistoryLabelCard />
      </div>
    </div>
  );
};

export default DashboardPage;

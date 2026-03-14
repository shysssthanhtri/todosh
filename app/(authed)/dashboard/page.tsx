"use client";

import * as React from "react";

import type { RichTodoType } from "@/app/(authed)/types/rich-todo";
import { getMockBreakdownTodos, getMockDailyStats } from "@/lib/dashboard-mock";

import { BreakdownCard } from "./_components/breakdown-card";
import { HistoryCard } from "./_components/history-card";
import { HistoryLabelCard } from "./_components/history-label-card";
import { ProgressCard } from "./_components/progress-card";

type DashboardPageProps = {
  params?: Promise<Record<string, string | string[]>>;
  searchParams?: Promise<Record<string, string | string[]>>;
};

const DashboardPage = ({ params, searchParams }: DashboardPageProps) => {
  React.use(params ?? Promise.resolve({}));
  React.use(searchParams ?? Promise.resolve({}));

  const dailyData = getMockDailyStats();

  const breakdownTodos = getMockBreakdownTodos().map((t) => ({
    ...t,
    dueDate: t.dueDate ?? undefined,
    completedAt: t.completedAt ?? undefined,
    onToggle: async () => {},
    onDelete: async () => {},
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

        <HistoryCard data={dailyData} />
        <HistoryLabelCard />
      </div>
    </div>
  );
};

export default DashboardPage;

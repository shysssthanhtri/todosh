"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import type { RichTodoType } from "@/app/(authed)/types/rich-todo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  getMockBreakdownTodos,
  getMockDailyStats,
  getMockTodayStats,
} from "@/lib/dashboard-mock";

import { BreakdownCard } from "./_components/breakdown-card";
import { ProgressCard } from "./_components/progress-card";

const historyChartConfig = {
  date: { label: "Date" },
  completed: {
    label: "Completed",
    color: "var(--chart-2)",
  },
  incomplete: {
    label: "Incomplete",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

type DashboardPageProps = {
  params?: Promise<Record<string, string | string[]>>;
  searchParams?: Promise<Record<string, string | string[]>>;
};

const DashboardPage = ({ params, searchParams }: DashboardPageProps) => {
  React.use(params ?? Promise.resolve({}));
  React.use(searchParams ?? Promise.resolve({}));

  const { completedToday, totalToday } = getMockTodayStats();

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

        <Card>
          <CardHeader>
            <CardTitle>History</CardTitle>
            <CardDescription>
              Total / completed / incomplete per day (last 10 days)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={historyChartConfig}
              className="aspect-[2/1] min-h-[240px] w-full"
            >
              <AreaChart
                data={dailyData}
                margin={{ left: 12, right: 12, top: 12, bottom: 0 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => {
                    const d = new Date(value);
                    return d.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      }
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="incomplete"
                  fill="var(--color-incomplete)"
                  stroke="var(--color-incomplete)"
                  stackId="a"
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  fill="var(--color-completed)"
                  stroke="var(--color-completed)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;

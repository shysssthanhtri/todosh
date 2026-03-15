"use client";
import { isSameDay } from "date-fns";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { UnInteractiveTodoType } from "../../types/rich-todo";

const historyChartConfig = {
  date: { label: "Date" },
  completed: {
    label: "Completed",
    color: "var(--primary)",
  },
  inCompleted: {
    label: "Incomplete",
    color: "var(--toast-error-border)",
  },
  overdue: {
    label: "Overdue",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type HistoryCardProps = {
  todos: UnInteractiveTodoType[];
};

export function HistoryCard({ todos }: HistoryCardProps) {
  const data = useMemo(() => {
    const record: Record<
      string,
      { inCompleted: number; completed: number; overdue: number }
    > = {};

    const initRecord = (date: string) => {
      record[date] = record[date] ?? {
        inCompleted: 0,
        completed: 0,
        overdue: 0,
      };
    };

    todos.forEach((todo) => {
      const dueDate = todo.dueDate?.toISOString();
      const completedAt = todo.completedAt?.toISOString();
      if (!dueDate) return;
      initRecord(dueDate);
      if (!completedAt) {
        record[dueDate].inCompleted++;
      } else if (isSameDay(dueDate, completedAt)) {
        record[dueDate].completed++;
      } else {
        record[dueDate].overdue++;
      }
    });

    return Object.entries(record).map(([date, value]) => ({
      date,
      ...value,
    }));
  }, [todos]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>History</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={historyChartConfig} className="min-h-60 w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                const d = new Date(value);
                return d.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={10} />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar
              dataKey="completed"
              stackId="a"
              fill="var(--color-completed)"
              radius={[0, 0, 5, 5]}
            />

            <Bar dataKey="overdue" stackId="a" fill="var(--color-overdue)" />

            <Bar
              dataKey="inCompleted"
              stackId="a"
              fill="var(--color-inCompleted)"
              radius={[5, 5, 0, 0]}
            />

            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

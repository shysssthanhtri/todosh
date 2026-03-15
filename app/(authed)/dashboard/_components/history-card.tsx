"use client";
import { isSameDay } from "date-fns";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

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
    color: "var(--label-green-stroke)",
  },
  inCompleted: {
    label: "Incomplete",
    color: "var(--label-red-stroke)",
  },
  overdue: {
    label: "Overdue",
    color: "var(--label-orange-stroke)",
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
        <CardDescription>Completed per day</CardDescription>
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
              fill="var(--label-green-fill)"
              stroke="var(--label-green-stroke)"
            >
              <LabelList
                dataKey="completed"
                stroke="var(--label-green-stroke)"
              />
            </Bar>

            <Bar
              dataKey="overdue"
              stackId="a"
              fill="var(--label-orange-fill)"
              stroke="var(--label-orange-stroke)"
            >
              <LabelList
                dataKey="overdue"
                stroke="var(--label-orange-stroke)"
                formatter={(value: number) => {
                  return !!value ? value : null;
                }}
              />
            </Bar>

            <Bar
              dataKey="inCompleted"
              stackId="a"
              fill="var(--label-red-fill)"
              stroke="var(--label-red-stroke)"
            >
              <LabelList
                dataKey="inCompleted"
                stroke="var(--label-red-stroke)"
              />
            </Bar>

            <ChartLegend
              content={(props) => (
                <ChartLegendContent
                  verticalAlign={props.verticalAlign}
                  payload={props.payload?.map((item) => ({
                    ...item,
                    color:
                      (item.payload as Record<string, string> | undefined)
                        ?.stroke ?? item.color,
                  }))}
                />
              )}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

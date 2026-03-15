"use client";

import { startOfDay } from "date-fns";
import React, { useMemo } from "react";
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
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { UnInteractiveTodoType } from "../../types/rich-todo";

const NO_LABEL_NAME = "No label";
const NO_LABEL_COLOR = "gray";

interface HistoryLabelCardProps {
  todos: UnInteractiveTodoType[];
}
export const HistoryLabelCard = ({ todos }: HistoryLabelCardProps) => {
  const data = useMemo(() => {
    const record: Record<string, Record<string, number>> = {};
    todos.forEach((todo) => {
      const completedAt = todo.completedAt
        ? startOfDay(todo.completedAt).toISOString()
        : null;
      if (!completedAt) return;
      if (!record[completedAt]) record[completedAt] = {};
      const label = todo.label ?? {
        name: NO_LABEL_NAME,
        color: NO_LABEL_COLOR,
      };
      if (!record[completedAt][label.name]) record[completedAt][label.name] = 0;
      record[completedAt][label.name]++;
    });

    const chartData = Object.entries(record)
      .map(([date, subRecord]) => {
        return {
          date,
          ...subRecord,
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return chartData;
  }, [todos]);

  const labels = useMemo(() => {
    const seenLabelNames = new Set<string>();
    return todos.reduce<{ name: string; color?: string }[]>((acc, cur) => {
      if (cur.completedAt) {
        const label = cur.label ?? {
          name: NO_LABEL_NAME,
          color: NO_LABEL_COLOR,
        };
        if (!seenLabelNames.has(label.name)) {
          seenLabelNames.add(label.name);
          acc.push({
            name: label.name,
            color: label.color as string,
          });
        }
      }
      return acc;
    }, []);
  }, [todos]);

  const historyChartConfig = useMemo<ChartConfig>(() => {
    const base: ChartConfig = { date: { label: "Date" } };
    labels.forEach((label) => {
      base[label.name] = {
        label: label.name,
        color: `var(--label-${label.color}-stroke)`,
      };
    });
    return base;
  }, [labels]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>History</CardTitle>
        <CardDescription>Completed per day breakdown by label</CardDescription>
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

            {labels.map((label) => {
              return (
                <Bar
                  key={label.name}
                  dataKey={label.name}
                  fill={`var(--label-${label.color}-fill)`}
                  stroke={`var(--label-${label.color}-stroke)`}
                  stackId="a"
                >
                  <LabelList
                    dataKey={label.name}
                    stroke={`var(--label-${label.color}-stroke)`}
                  />
                </Bar>
              );
            })}
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
};

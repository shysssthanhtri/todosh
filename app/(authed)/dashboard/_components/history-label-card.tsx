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

interface HistoryLabelCardProps {
  todos: UnInteractiveTodoType[];
}
export const HistoryLabelCard = ({ todos }: HistoryLabelCardProps) => {
  const data = useMemo(() => {
    const record: Record<string, Record<string, number>> = {};
    todos.forEach((todo) => {
      const completedAt = todo.completedAt?.toISOString();
      if (!completedAt) return;
      if (!record[completedAt]) record[completedAt] = {};
      const label = todo.label;
      if (!label) return;
      if (!record[completedAt][label.name]) record[completedAt][label.name] = 0;
      record[completedAt][label.name]++;
    });

    const chartData = Object.entries(record).map(([date, subRecord]) => {
      return {
        date,
        ...subRecord,
      };
    });

    return chartData;
  }, [todos]);

  const labels = useMemo(() => {
    const seenLabelNames = new Set<string>();
    return todos.reduce<{ name: string; color?: string }[]>((acc, cur) => {
      if (cur.completedAt && cur.label) {
        if (!seenLabelNames.has(cur.label.name)) {
          seenLabelNames.add(cur.label.name);
          acc.push({
            name: cur.label.name,
            color: cur.label.color as string,
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

            {labels.map((label, index) => {
              const radis: [number, number, number, number] =
                labels.length === 1
                  ? [10, 10, 10, 10]
                  : index === 0
                    ? [0, 0, 10, 10]
                    : index === labels.length - 1
                      ? [10, 10, 0, 0]
                      : [0, 0, 0, 0];
              return (
                <Bar
                  key={label.name}
                  dataKey={label.name}
                  fill={`var(--label-${label.color}-fill)`}
                  stroke={`var(--label-${label.color}-stroke)`}
                  stackId="a"
                  radius={radis}
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

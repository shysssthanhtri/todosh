import React, { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      const dueDate = todo.dueDate?.toISOString();
      if (!dueDate) return;
      if (!record[dueDate]) record[dueDate] = {};
      const label = todo.label;
      if (!label) return;
      if (!record[dueDate][label.name]) record[dueDate][label.name] = 0;
      record[dueDate][label.name]++;
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
      if (cur.label) {
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

            {labels.map((label, index) => (
              <Bar
                key={label.name}
                dataKey={label.name}
                fill={`var(--label-${label.color}-fill)`}
                stroke={`var(--label-${label.color}-stroke)`}
                stackId="a"
                {...(index === 0 ? { radius: [0, 0, 5, 5] } : {})}
                {...(index === labels.length - 1
                  ? { radius: [5, 5, 0, 0] }
                  : {})}
              >
                <LabelList dataKey={label.name} className="fill-foreground" />
              </Bar>
            ))}
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

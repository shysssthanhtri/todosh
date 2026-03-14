"use client";

import { Bar, BarChart, Cell, LabelList, XAxis, YAxis } from "recharts";

import {
  getLabelFillColor,
  getLabelStrokeColor,
} from "@/components/label-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";

import { RichTodoType } from "../../types/rich-todo";

type BreakdownCardProps = {
  todos: RichTodoType[];
};

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const NO_LABEL_NAME = "No label";
const NO_LABEL_COLOR = "gray";

export function BreakdownCard({ todos }: BreakdownCardProps) {
  const labelsRecord = todos.reduce<
    Record<string, { name: string; count: number; color?: string }>
  >((acc, cur) => {
    const name = cur.label?.name ?? NO_LABEL_NAME;
    acc[name] = acc[name] ?? {
      name: name,
      count: 0,
      color: cur.label?.color ?? NO_LABEL_COLOR,
    };
    acc[name].count++;
    return acc;
  }, {});
  const labels = Object.values(labelsRecord);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Breakdown</CardTitle>
        <CardDescription>By label</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <BarChart accessibilityLayer data={labels} layout="vertical">
            <XAxis type="number" dataKey="count" hide />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <Bar dataKey="count" radius={10} strokeWidth={1}>
              {labels.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={getLabelFillColor(entry.color)}
                  stroke={getLabelStrokeColor(entry.color)}
                />
              ))}
              <LabelList
                dataKey="count"
                position="middle"
                offset={8}
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

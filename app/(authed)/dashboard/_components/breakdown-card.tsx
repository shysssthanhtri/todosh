"use client";

import { Bar, BarChart, Cell, LabelList, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";

import { RichTodoType } from "../../types/rich-todo";

/** Theme-aware bar fill (uses CSS vars from globals.css for light/dark) */
function getBarFillColor(color: string | null | undefined): string {
  switch (color) {
    case "red":
      return "var(--label-red-fill)";
    case "orange":
      return "var(--label-orange-fill)";
    case "yellow":
      return "var(--label-yellow-fill)";
    case "green":
      return "var(--label-green-fill)";
    case "teal":
      return "var(--label-teal-fill)";
    case "blue":
      return "var(--label-blue-fill)";
    case "indigo":
      return "var(--label-indigo-fill)";
    case "purple":
      return "var(--label-purple-fill)";
    case "pink":
      return "var(--label-pink-fill)";
    case "gray":
    default:
      return "var(--label-gray-fill)";
  }
}

/** Theme-aware bar stroke (uses CSS vars from globals.css for light/dark) */
function getBarStrokeColor(color: string | null | undefined): string {
  switch (color) {
    case "red":
      return "var(--label-red-stroke)";
    case "orange":
      return "var(--label-orange-stroke)";
    case "yellow":
      return "var(--label-yellow-stroke)";
    case "green":
      return "var(--label-green-stroke)";
    case "teal":
      return "var(--label-teal-stroke)";
    case "blue":
      return "var(--label-blue-stroke)";
    case "indigo":
      return "var(--label-indigo-stroke)";
    case "purple":
      return "var(--label-purple-stroke)";
    case "pink":
      return "var(--label-pink-stroke)";
    case "gray":
    default:
      return "var(--label-gray-stroke)";
  }
}

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
  const maxCount = Math.max(...labels.map((l) => l.count), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Breakdown</CardTitle>
        <CardDescription>By label</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <BarChart accessibilityLayer data={labels} layout="vertical">
            <XAxis type="number" dataKey="count" hide domain={[0, maxCount]} />
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
                  fill={getBarFillColor(entry.color)}
                  stroke={getBarStrokeColor(entry.color)}
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

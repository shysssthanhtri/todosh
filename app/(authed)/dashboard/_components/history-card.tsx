"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import type { DailyStats } from "@/lib/dashboard-mock";

const historyChartConfig = {
  date: { label: "Date" },
  completed: {
    label: "Completed",
    color: "var(--chart-3)",
  },
  incomplete: {
    label: "Incomplete",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type HistoryCardProps = {
  data: DailyStats[];
};

export function HistoryCard({ data }: HistoryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>History</CardTitle>
        <CardDescription>
          Completed / incomplete per day (last 10 days)
        </CardDescription>
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
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="incomplete"
              fill="var(--color-incomplete)"
              radius={4}
            />
            <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import type { DailyStats } from "@/lib/dashboard-mock";

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

type HistoryCardProps = {
  data: DailyStats[];
};

export function HistoryCard({ data }: HistoryCardProps) {
  return (
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
            data={data}
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
  );
}

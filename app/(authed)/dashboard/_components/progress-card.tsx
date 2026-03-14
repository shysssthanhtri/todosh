"use client";

import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const progressChartConfig = {
  value: {
    label: "Done",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type ProgressCardProps = {
  completed: number;
  total: number;
};

export function ProgressCard({ completed = 0, total = 0 }: ProgressCardProps) {
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const progressData = [{ name: "progress", value: progressPercent }];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress</CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <ChartContainer
          config={progressChartConfig}
          className="aspect-square max-h-[240px] w-full"
        >
          <RadialBarChart
            data={progressData}
            innerRadius="55%"
            outerRadius="85%"
            startAngle={0}
            endAngle={360}
          >
            <ChartTooltip
              content={
                <ChartTooltipContent
                  nameKey="value"
                  formatter={() => (
                    <>
                      <span className="text-muted-foreground">Completed</span>
                      <span className="font-mono font-medium tabular-nums">
                        {completed} / {total}
                      </span>
                    </>
                  )}
                />
              }
            />
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              dataKey="value"
              fill="var(--color-primary)"
              background
              angleAxisId={0}
            />
          </RadialBarChart>
        </ChartContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold tabular-nums">
            {completed}
            <span className="text-muted-foreground font-normal">
              {" "}
              / {total}
            </span>
          </span>
          <span className="text-muted-foreground font-normal">todo(s)</span>
        </div>
      </CardContent>
    </Card>
  );
}

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
      <CardContent>
        <div className="mx-auto grid aspect-square max-h-[250px] w-full">
          <div className="col-start-1 row-start-1 min-h-0 min-w-0">
            <ChartContainer
              config={progressChartConfig}
              className="aspect-square h-full w-full min-h-0"
            >
              <RadialBarChart
                data={progressData}
                startAngle={0}
                endAngle={360}
                innerRadius={100}
                outerRadius={120}
              >
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      nameKey="value"
                      formatter={() => (
                        <>
                          <span className="text-muted-foreground">
                            Completed
                          </span>
                          <span className="font-mono font-medium tabular-nums">
                            {completed} / {total}
                          </span>
                        </>
                      )}
                    />
                  }
                />
                <RadialBar
                  dataKey="value"
                  fill="var(--color-primary)"
                  background
                  cornerRadius={10}
                />
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
              </RadialBarChart>
            </ChartContainer>
          </div>
          <div className="col-start-1 row-start-1 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold tabular-nums">
              {completed}
              <span className="text-muted-foreground font-normal">
                {" "}
                / {total}
              </span>
            </span>
            <span className="text-muted-foreground font-normal">todo(s)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

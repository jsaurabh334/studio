
"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { projects } from "@/lib/data";

const chartData = projects.map((p) => ({
  name: p.name.split(" ")[0],
  progress: p.progress,
}));

const chartConfig = {
  progress: {
    label: "Progress",
    color: "hsl(var(--primary))",
  },
};

export function ProjectProgressChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis unit="%" />
          <Tooltip 
            cursor={{ fill: "hsl(var(--muted))" }}
            content={<ChartTooltipContent />} 
          />
          <Bar dataKey="progress" fill="var(--color-progress)" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

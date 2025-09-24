"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  Pie,
  PieChart,
  Cell,
} from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { projects } from "@/lib/data";

// Chart for Budget vs. Spent
const budgetChartData = projects.map((p) => ({
  name: p.name.split(" ")[0],
  budget: p.budget,
  spent: p.spent,
}));

const budgetChartConfig = {
  budget: {
    label: "Budget",
    color: "hsl(var(--chart-2))",
  },
  spent: {
    label: "Spent",
    color: "hsl(var(--chart-1))",
  },
};

export function BudgetSpentChart() {
  return (
    <ChartContainer config={budgetChartConfig} className="min-h-[300px] w-full">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={budgetChartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis tickFormatter={(value) => `$${Number(value) / 1000}k`} />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend content={<ChartLegendContent />} />
          <Bar dataKey="budget" fill="var(--color-budget)" radius={4} />
          <Bar dataKey="spent" fill="var(--color-spent)" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// Chart for Task Status
const allTasks = projects.flatMap(p => p.tasks);
const taskStatusData = allTasks.reduce((acc, task) => {
    const status = task.status;
    if (!acc[status]) {
        acc[status] = { name: status, value: 0, fill: '' };
    }
    acc[status].value += 1;
    return acc;
}, {} as Record<string, {name: string, value: number, fill: string}>)

const taskStatusChartData = Object.values(taskStatusData);

const taskStatusChartConfig = {
  "To Do": { label: "To Do", color: "hsl(var(--chart-3))" },
  "In Progress": { label: "In Progress", color: "hsl(var(--chart-2))" },
  "Done": { label: "Done", color: "hsl(var(--chart-1))" },
};

export function TaskStatusChart() {
  return (
    <ChartContainer
      config={taskStatusChartConfig}
      className="mx-auto aspect-square max-h-[350px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={taskStatusChartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            labelLine={false}
            label={({
              cx,
              cy,
              midAngle,
              innerRadius,
              outerRadius,
              percent,
            }) => {
              const RADIAN = Math.PI / 180;
              const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);

              return (
                <text
                  x={x}
                  y={y}
                  fill="white"
                  textAnchor={x > cx ? "start" : "end"}
                  dominantBaseline="central"
                >
                  {`${(percent * 100).toFixed(0)}%`}
                </text>
              );
            }}
          >
            {taskStatusChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`var(--color-${entry.name.replace(' ', '')})`} />
            ))}
          </Pie>
          <Legend
            content={<ChartLegendContent nameKey="name" />}
            wrapperStyle={{
              paddingTop: 20
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

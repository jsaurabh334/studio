"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "Mar", paid: 18600, pending: 8000 },
  { month: "Apr", paid: 30500, pending: 20000 },
  { month: "May", paid: 23700, pending: 12000 },
  { month: "Jun", paid: 73000, pending: 19000 },
  { month: "Jul", paid: 20900, pending: 18000 },
  { month: "Aug", paid: 21400, pending: 24000 },
];

const chartConfig = {
  paid: {
    label: "Paid",
    color: "hsl(var(--accent))",
  },
  pending: {
    label: "Pending",
    color: "hsl(var(--primary))",
  },
};

export function PaymentChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ right: 20, left: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            tickFormatter={(value) => `$${value / 1000}k`}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Line
            dataKey="paid"
            type="monotone"
            stroke="var(--color-paid)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            dataKey="pending"
            type="monotone"
            stroke="var(--color-pending)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

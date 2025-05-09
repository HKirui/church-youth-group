"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface GroupPerformanceChartProps {
  data: number[]
  color: string
  name: string
}

export function GroupPerformanceChart({ data, color, name }: GroupPerformanceChartProps) {
  // Convert the data array to the format expected by the chart
  const chartData = data.map((value, index) => ({
    week: `Week ${index + 1}`,
    attendance: value,
  }))

  return (
    <ChartContainer
      config={{
        attendance: {
          label: "Attendance",
          color: color,
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickMargin={8} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            tickMargin={8}
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="attendance"
            strokeWidth={2}
            activeDot={{ r: 6, strokeWidth: 0 }}
            stroke={color}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}


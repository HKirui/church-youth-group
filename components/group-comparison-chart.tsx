"use client"

import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface Group {
  id: number
  name: string
  attendance: number
  chartColor: string
  attendanceData: number[]
}

interface GroupComparisonChartProps {
  groups: Group[]
}

export function GroupComparisonChart({ groups }: GroupComparisonChartProps) {
  // Create data for the comparison chart
  const chartData = [
    {
      name: "Current",
      ...groups.reduce(
        (acc, group) => {
          acc[group.name] = group.attendance
          return acc
        },
        {} as Record<string, number>,
      ),
    },
    {
      name: "Average",
      ...groups.reduce(
        (acc, group) => {
          acc[group.name] = Math.round(
            group.attendanceData.reduce((sum, val) => sum + val, 0) / group.attendanceData.length,
          )
          return acc
        },
        {} as Record<string, number>,
      ),
    },
  ]

  // Create config for the chart
  const config = groups.reduce(
    (acc, group) => {
      acc[group.name] = {
        label: group.name,
        color: group.chartColor,
      }
      return acc
    },
    {} as Record<string, { label: string; color: string }>,
  )

  return (
    <ChartContainer config={config} className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          {groups.map((group) => (
            <Bar key={group.id} dataKey={group.name} fill={group.chartColor} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}


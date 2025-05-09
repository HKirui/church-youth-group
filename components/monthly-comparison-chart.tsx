"use client"

import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface MonthlyData {
  month: string
  attendance: number
}

interface Group {
  id: number
  name: string
  attendance: number
  chartColor: string
  monthlyData: MonthlyData[]
}

interface MonthlyComparisonChartProps {
  groups: Group[]
}

export function MonthlyComparisonChart({ groups }: MonthlyComparisonChartProps) {
  // Create data for the monthly comparison chart
  // We'll show the last 6 months with all groups
  const months = groups[0]?.monthlyData.map((data) => data.month) || []

  const chartData = months.map((month, index) => {
    const dataPoint: Record<string, any> = { month }

    groups.forEach((group) => {
      dataPoint[group.name] = group.monthlyData[index].attendance
    })

    return dataPoint
  })

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis
          dataKey="month"
          tickFormatter={(value) => value.substring(0, 3)} // Show first 3 letters of month
          axisLine={false}
          tickLine={false}
        />
        <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white p-2 border rounded shadow-sm">
                  <p className="text-sm font-medium">{label}</p>
                  <div className="mt-1">
                    {payload.map((entry, index) => (
                      <p key={index} className="text-xs" style={{ color: entry.color }}>
                        {entry.name}: <span className="font-medium">{entry.value}%</span>
                      </p>
                    ))}
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Legend wrapperStyle={{ paddingTop: 15 }} iconType="circle" />
        {groups.map((group) => (
          <Bar key={group.id} dataKey={group.name} fill={group.chartColor} radius={[4, 4, 0, 0]} barSize={30} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}


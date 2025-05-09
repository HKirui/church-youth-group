"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface MonthlyData {
  month: string
  attendance: number
}

interface MonthlyPerformanceChartProps {
  data: MonthlyData[]
  color: string
  name: string
}

export function MonthlyPerformanceChart({ data, color, name }: MonthlyPerformanceChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
          tickMargin={8}
          tickFormatter={(value) => value.substring(0, 3)} // Show first 3 letters of month
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
          tickMargin={8}
          domain={[0, 100]}
          ticks={[0, 25, 50, 75, 100]}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white p-2 border rounded shadow-sm">
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-sm text-gray-600">
                    Attendance: <span className="font-medium">{payload[0].value}%</span>
                  </p>
                </div>
              )
            }
            return null
          }}
        />
        <Line
          type="monotone"
          dataKey="attendance"
          strokeWidth={3}
          activeDot={{ r: 8, strokeWidth: 0 }}
          stroke={color}
          dot={{ r: 4, strokeWidth: 0, fill: color }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}


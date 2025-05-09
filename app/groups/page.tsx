import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, BarChart, Edit, Plus, Users } from "lucide-react"

export default function GroupsPage() {
  const groups = [
    {
      id: 1,
      name: "Bereans",
      leader: "Jesse Lanya",
      members: 28,
      attendance: 85,
      reportsSubmitted: 12,
      lastReport: "March 21, 2025",
      color: "bg-blue-500 text-white", // Blue
    },
    {
      id: 2,
      name: "Flame of Truth",
      leader: "Audrey Akinyi",
      members: 18,
      attendance: 72,
      reportsSubmitted: 10,
      lastReport: "March 18, 2025",
      color: "bg-red-500 text-white", // Red
    },
    {
      id: 3,
      name: "Ignite Warriors",
      leader: "Mercy Blessings",
      members: 24,
      attendance: 92,
      reportsSubmitted: 14,
      lastReport: "March 22, 2025",
      color: "bg-white border border-gray-200 text-gray-900", // White with border
    },
    {
      id: 4,
      name: "Ignited in Christ",
      leader: "Keren Lanya",
      members: 32,
      attendance: 88,
      reportsSubmitted: 11,
      lastReport: "March 19, 2025",
      color: "bg-gray-500 text-white", // Grey
    },
    {
      id: 5,
      name: "Radiance",
      leader: "Joy Mella",
      members: 6,
      attendance: 95,
      reportsSubmitted: 15,
      lastReport: "March 23, 2025",
      color: "bg-purple-500 text-white", // Purple
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-4" asChild>
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Church Groups</h1>
          <p className="text-muted-foreground">Manage and monitor all church groups</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Group
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <Card key={group.id} className="overflow-hidden">
            <div className={`h-2 ${group.color.split(" ")[0]}`}></div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>{group.name}</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
              </div>
              <CardDescription>Led by {group.leader}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Members</span>
                  </div>
                  <span className="font-medium">{group.members}</span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Attendance Rate</span>
                    <span className="text-sm font-medium">{group.attendance}%</span>
                  </div>
                  <Progress
                    value={group.attendance}
                    className="h-2"
                    style={
                      {
                        "--progress-background": group.color.includes("blue")
                          ? "rgb(59, 130, 246)"
                          : group.color.includes("red")
                            ? "rgb(239, 68, 68)"
                            : group.color.includes("white")
                              ? "rgb(209, 213, 219)"
                              : group.color.includes("purple")
                                ? "rgb(168, 85, 247)"
                                : "rgb(107, 114, 128)",
                      } as React.CSSProperties
                    }
                  />
                </div>

                <div className="pt-2 border-t flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Reports Submitted</p>
                    <p className="font-medium">{group.reportsSubmitted}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Last Report</p>
                    <p className="font-medium">{group.lastReport}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    size="sm"
                    style={{
                      borderColor: group.color.includes("blue")
                        ? "rgb(59, 130, 246)"
                        : group.color.includes("red")
                          ? "rgb(239, 68, 68)"
                          : group.color.includes("white")
                            ? "rgb(209, 213, 219)"
                            : group.color.includes("purple")
                              ? "rgb(168, 85, 247)"
                              : "rgb(107, 114, 128)",
                    }}
                    asChild
                  >
                    <Link href={`/groups/${group.id}`}>
                      <Users className="mr-2 h-4 w-4" />
                      Members
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    size="sm"
                    style={{
                      borderColor: group.color.includes("blue")
                        ? "rgb(59, 130, 246)"
                        : group.color.includes("red")
                          ? "rgb(239, 68, 68)"
                          : group.color.includes("white")
                            ? "rgb(209, 213, 219)"
                            : group.color.includes("purple")
                              ? "rgb(168, 85, 247)"
                              : "rgb(107, 114, 128)",
                    }}
                    asChild
                  >
                    <Link href={`/groups/${group.id}/performance`}>
                      <BarChart className="mr-2 h-4 w-4" />
                      Performance
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


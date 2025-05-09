"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { usePermissions } from "@/hooks/use-permissions"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Download, Eye, FileText, Edit } from "lucide-react"

export default function ReportsPage() {
  const { data: session, status } = useSession()
  const { isAdmin, isGroupLeader, userGroupId } = usePermissions()
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGroup, setSelectedGroup] = useState<string>(
    isGroupLeader && userGroupId ? userGroupId.toString() : "all",
  )

  // Mock reports data - in a real app, this would come from your API
  const mockReports = [
    {
      id: 1,
      groupId: 1,
      groupName: "Bereans",
      date: "March 15, 2025",
      attendance: 24,
      summary:
        "We had a great meeting discussing upcoming events and planning for the Easter service. Everyone was engaged and contributed ideas.",
    },
    {
      id: 2,
      groupId: 2,
      groupName: "Flame of Truth",
      date: "March 18, 2025",
      attendance: 16,
      summary:
        "Focused on community outreach plans and discussed ways to improve attendance. Several new members joined this week.",
    },
    {
      id: 3,
      groupId: 3,
      groupName: "Ignite Warriors",
      date: "March 22, 2025",
      attendance: 22,
      summary: "Bible study on leadership principles. Great discussions and practical applications shared by members.",
    },
    {
      id: 4,
      groupId: 4,
      groupName: "Ignited in Christ",
      date: "March 19, 2025",
      attendance: 28,
      summary:
        "Prayer meeting focused on the upcoming youth conference. Assigned responsibilities for different aspects of the event.",
    },
    {
      id: 5,
      groupId: 5,
      groupName: "Radiance",
      date: "March 23, 2025",
      attendance: 6,
      summary: "Worship practice and planning for the next month's activities. Everyone participated actively.",
    },
  ]

  useEffect(() => {
    if (status !== "loading") {
      // Filter reports based on user role
      let filteredReports = mockReports

      if (isGroupLeader && userGroupId) {
        filteredReports = mockReports.filter((report) => report.groupId === userGroupId)
      } else if (selectedGroup !== "all") {
        filteredReports = mockReports.filter((report) => report.groupId === Number.parseInt(selectedGroup))
      }

      setReports(filteredReports)
      setLoading(false)
    }
  }, [status, isGroupLeader, userGroupId, selectedGroup])

  // If not authenticated, redirect to sign in
  if (status === "unauthenticated") {
    redirect("/auth/signin?callbackUrl=/reports")
  }

  // Show loading state while checking authentication
  if (loading || status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-georgia">Loading reports...</p>
        </div>
      </div>
    )
  }

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
          <h1 className="text-2xl font-bold font-georgia">{isGroupLeader ? "My Group Reports" : "Group Reports"}</h1>
          <p className="text-muted-foreground font-georgia">
            {isGroupLeader ? "View and manage your submitted reports" : "View and manage all submitted reports"}
          </p>
        </div>
        {isGroupLeader && userGroupId && (
          <Button asChild>
            <Link href={`/upload?group=${userGroupId}`}>Upload New Report</Link>
          </Button>
        )}
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="font-georgia">Filter Reports</CardTitle>
          <CardDescription className="font-georgia">
            Narrow down reports by group, date, or search by content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Select
                value={selectedGroup}
                onValueChange={setSelectedGroup}
                disabled={isGroupLeader} // Group leaders can't change the group filter
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Groups" />
                </SelectTrigger>
                <SelectContent>
                  {isAdmin && <SelectItem value="all">All Groups</SelectItem>}
                  {(isAdmin || (isGroupLeader && userGroupId === 1)) && <SelectItem value="1">Bereans</SelectItem>}
                  {(isAdmin || (isGroupLeader && userGroupId === 2)) && (
                    <SelectItem value="2">Flame of Truth</SelectItem>
                  )}
                  {(isAdmin || (isGroupLeader && userGroupId === 3)) && (
                    <SelectItem value="3">Ignite Warriors</SelectItem>
                  )}
                  {(isAdmin || (isGroupLeader && userGroupId === 4)) && (
                    <SelectItem value="4">Ignited in Christ</SelectItem>
                  )}
                  {(isAdmin || (isGroupLeader && userGroupId === 5)) && <SelectItem value="5">Radiance</SelectItem>}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="this-quarter">This Quarter</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Input placeholder="Search reports..." />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {reports.length > 0 ? (
          reports.map((report) => (
            <Card key={report.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium font-georgia">{report.groupName} Report</h3>
                      <p className="text-sm text-muted-foreground font-georgia">
                        {report.date} • Attendance: {report.attendance}
                      </p>
                      <p className="text-sm mt-2 line-clamp-2 font-georgia">{report.summary}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:self-start">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    {isGroupLeader && userGroupId === report.groupId && (
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium font-georgia">No Reports Found</h3>
            <p className="text-muted-foreground font-georgia">
              {isGroupLeader ? "You haven't submitted any reports yet." : "No reports match your current filters."}
            </p>
            {isGroupLeader && userGroupId && (
              <Button className="mt-4" asChild>
                <Link href={`/upload?group=${userGroupId}`}>Upload Your First Report</Link>
              </Button>
            )}
          </div>
        )}
      </div>

      {reports.length > 5 && (
        <div className="flex justify-center mt-6">
          <Button variant="outline" className="font-georgia">
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}


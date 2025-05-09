"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  UploadIcon as FileUpload,
  Users,
  Calendar,
  ArrowRight,
  TrendingUp,
  BarChart3,
  ChevronUp,
  Flame,
  Award,
} from "lucide-react"
import { useSession } from "next-auth/react"
import { signIn } from "next-auth/react"

// Define the Group type for better type safety
interface MonthlyData {
  month: string
  attendance: number
}

interface Group {
  id: number
  name: string
  leader: string
  members: number
  attendance: number
  reportsSubmitted: number
  lastReport: string
  reportDue?: boolean
  daysUntilDue?: number
  color: string
  chartColor: string
  gradientFrom: string
  gradientTo: string
  monthlyData: MonthlyData[]
}

// Leadership team data
interface TeamMember {
  name: string
  role: string
  image?: string
}

// Update the leadershipTeam array with the correct roles and images
const leadershipTeam: TeamMember[] = [
  {
    name: "SILAS ISRAEL ABISAI",
    role: "Youth Leader",
    image: "/images/silas-israel-abisai.jpeg",
  },
  {
    name: "Purity Silas",
    role: "Treasurer",
    image: "/images/purity-silas.png",
  },
  {
    name: "Joy Mella",
    role: "Secretary",
    image: "/images/joy-mella.png",
  },
  {
    name: "Audrey Akinyi",
    role: "Event Coordinator",
    image: "/images/audrey-akinyi.png",
  },
  {
    name: "Keren Lanya",
    role: "Administrative Support",
    image: "/images/keren-lanya.png",
  },
  {
    name: "Mercy Blessings",
    role: "Teens Leader",
    image: "/images/mercy-blessings.png",
  },
  {
    name: "Dickens Onyango",
    role: "Advisory Board",
    image: "/images/dickens-onyango.png",
  },
  {
    name: "Jesse Lanya",
    role: "Talent Development Coordinator",
    image: "/images/jesse-lanya.png",
  },
]

// Default group data
const defaultGroups: Group[] = [
  {
    id: 1,
    name: "Bereans",
    leader: "Jesse Lanya",
    members: 28,
    attendance: 85,
    reportsSubmitted: 12,
    lastReport: "March 21, 2025",
    reportDue: true,
    daysUntilDue: 2,
    color: "bg-blue-500 text-white",
    chartColor: "rgb(59, 130, 246)",
    gradientFrom: "from-blue-500",
    gradientTo: "to-blue-600",
    monthlyData: [
      { month: "October", attendance: 78 },
      { month: "November", attendance: 80 },
      { month: "December", attendance: 76 },
      { month: "January", attendance: 82 },
      { month: "February", attendance: 84 },
      { month: "March", attendance: 85 },
    ],
  },
  {
    id: 2,
    name: "Flame of Truth",
    leader: "Audrey Akinyi",
    members: 18,
    attendance: 72,
    reportsSubmitted: 10,
    lastReport: "March 18, 2025",
    reportDue: true,
    daysUntilDue: 5,
    color: "bg-red-500 text-white",
    chartColor: "rgb(239, 68, 68)",
    gradientFrom: "from-red-500",
    gradientTo: "to-red-600",
    monthlyData: [
      { month: "October", attendance: 65 },
      { month: "November", attendance: 68 },
      { month: "December", attendance: 64 },
      { month: "January", attendance: 70 },
      { month: "February", attendance: 71 },
      { month: "March", attendance: 72 },
    ],
  },
  {
    id: 3,
    name: "Ignite Warriors",
    leader: "Mercy Blessings",
    members: 24,
    attendance: 92,
    reportsSubmitted: 14,
    lastReport: "March 22, 2025",
    color: "bg-white border border-gray-200 text-gray-900",
    chartColor: "rgb(209, 213, 219)",
    gradientFrom: "from-gray-100",
    gradientTo: "to-gray-200",
    monthlyData: [
      { month: "October", attendance: 85 },
      { month: "November", attendance: 88 },
      { month: "December", attendance: 90 },
      { month: "January", attendance: 89 },
      { month: "February", attendance: 91 },
      { month: "March", attendance: 92 },
    ],
  },
  {
    id: 4,
    name: "Ignited in Christ",
    leader: "Keren Lanya",
    members: 32,
    attendance: 88,
    reportsSubmitted: 11,
    lastReport: "March 19, 2025",
    reportDue: true,
    daysUntilDue: 7,
    color: "bg-gray-500 text-white",
    chartColor: "rgb(107, 114, 128)",
    gradientFrom: "from-gray-500",
    gradientTo: "to-gray-600",
    monthlyData: [
      { month: "October", attendance: 80 },
      { month: "November", attendance: 82 },
      { month: "December", attendance: 85 },
      { month: "January", attendance: 87 },
      { month: "February", attendance: 86 },
      { month: "March", attendance: 88 },
    ],
  },
  {
    id: 5,
    name: "Radiance",
    leader: "Joy Mella",
    members: 6,
    attendance: 95,
    reportsSubmitted: 15,
    lastReport: "March 23, 2025",
    reportDue: false,
    color: "bg-purple-500 text-white",
    chartColor: "rgb(168, 85, 247)",
    gradientFrom: "from-purple-500",
    gradientTo: "to-purple-600",
    monthlyData: [
      { month: "October", attendance: 90 },
      { month: "November", attendance: 92 },
      { month: "December", attendance: 93 },
      { month: "January", attendance: 91 },
      { month: "February", attendance: 94 },
      { month: "March", attendance: 95 },
    ],
  },
]

export default function Home() {
  const { data: session, status } = useSession()
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)

  // Simplified approach - no usePermissions hook
  const isAdmin = session?.user?.role === "admin"
  const isGroupLeader = session?.user?.role === "groupLeader"
  const userGroupId = session?.user?.groupId as number | undefined

  useEffect(() => {
    if (status !== "loading") {
      try {
        // For group leaders, filter to only show their group
        if (isGroupLeader && userGroupId) {
          const filteredGroups = defaultGroups.filter((group) => group.id === userGroupId)
          setGroups(filteredGroups.length > 0 ? filteredGroups : defaultGroups)
        } else {
          // Admins or unauthenticated users see all groups
          setGroups(defaultGroups)
        }
      } catch (error) {
        console.error("Error setting groups:", error)
        // Fall back to default data
        setGroups(defaultGroups)
      } finally {
        setLoading(false)
      }
    }
  }, [status, isGroupLeader, userGroupId, isAdmin])

  // Show loading state while fetching data or checking authentication
  if (loading || status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-georgia">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Calculate stats from the data
  const totalReports = groups.reduce((sum, group) => sum + group.reportsSubmitted, 0)
  const avgAttendance =
    groups.length > 0 ? Math.round(groups.reduce((sum, group) => sum + group.attendance, 0) / groups.length) : 0
  const groupsWithReportsDue = groups.filter((group) => group.reportDue === true)

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900 font-georgia">
      {status === "unauthenticated" && (
        <div className="fixed top-0 left-0 right-0 bg-orange-500 text-white p-2 text-center z-50">
          <p>
            Please sign in to access all features.
            <Button
              variant="outline"
              size="sm"
              className="ml-2 text-white border-white hover:bg-white hover:text-orange-500"
              onClick={() => signIn("google")}
            >
              Sign In
            </Button>
          </p>
        </div>
      )}

      <header className="py-12 text-white bg-gradient-to-r from-orange-500 to-pink-500">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex justify-center mb-4">
            <div className="relative w-44 h-44 rounded-full bg-white/20 p-2 flex items-center justify-center shadow-lg border-2 border-white/30">
              <div className="relative w-40 h-40 rounded-full overflow-hidden bg-white/90 p-2">
                <Image
                  src="/images/ignite-logo.png"
                  alt="IGNITE 2025 Logo"
                  width={160}
                  height={160}
                  className="object-contain"
                  priority
                  onError={(e) => {
                    // Fallback if image fails to load
                    const target = e.target as HTMLImageElement
                    target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Crect width='160' height='160' fill='%23f97316'/%3E%3Ctext x='50%25' y='50%25' dominantBaseline='middle' textAnchor='middle' fontFamily='sans-serif' fontSize='24' fill='white'%3EIGNITE%3C/text%3E%3C/svg%3E"
                  }}
                />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight uppercase font-georgia">
            THE REDEMPTION POWERHOUSE YOUTH MINISTRY
          </h1>
          <div className="mt-6 inline-block px-8 py-3 bg-white/20 rounded-full backdrop-blur-sm">
            <span className="text-xl font-semibold tracking-wide font-georgia">
              THEME OF THE YEAR: <span className="text-yellow-300 font-bold">IGNITE 2025</span>
            </span>
          </div>
          <p className="text-white/90 mt-4 max-w-2xl mx-auto font-georgia">
            Empowering youth through faith, fellowship, and service
          </p>
        </div>
        {session?.user && (
          <div className="mt-4 text-white/90 text-center">
            <p>
              Welcome, {session.user.name} |{" "}
              {isAdmin ? "Youth Leader" : `Group Leader: ${groups[0]?.name || "Unknown"}`}
            </p>
          </div>
        )}
      </header>

      {/* Vision Statement Section */}
      <section className="py-12 bg-gradient-to-r from-orange-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 relative">
        <div className="absolute inset-0 bg-pattern opacity-5"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-pink-500"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-pink-500"></div>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white font-georgia">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-pink-500">
                IGNITE: VISION 2025
              </span>
            </h2>
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-pink-500"></div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 font-georgia">
              GOALS & STRATEGY 2025 ONWARDS
            </h3>
            <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-300 font-georgia">
              <p className="mb-4 font-georgia leading-relaxed">
                With the "Ignite: Vision 2025," we aspire to breathe fresh life into our youth ministry. Our strategies
                to promote spiritual growth, community engagement, and leadership development. We envision dynamic
                programs that foster conversations, service, and fellowship through workshops, retreats, and mission
                trips.
              </p>
              <p className="mb-4 font-georgia leading-relaxed">
                Our aim is to empower our young people to live out their faith boldly and authentically. Together, we
                can ignite a vibrant movement within our church and inspire the next generation to lead with purpose and
                passion as we embrace the transformative vision for 2025.
              </p>
              <p className="font-medium text-gray-800 dark:text-gray-200 font-georgia italic">
                The fire within us is unwavering, and it is our collective duty to ensure it burns ever brighter in our
                community.
              </p>
              <div className="mt-8">
                <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-md font-georgia">
                  Join Our Mission
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        {/* Stats Overview Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
          <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-pink-500/10 rounded-lg"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-sm font-medium font-georgia">Total Reports</CardTitle>
              <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                <FileUpload className="h-4 w-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold font-georgia">{totalReports}</div>
              <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-1">
                <ChevronUp className="h-3 w-3 mr-1" />
                <span>+14% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/10 rounded-lg"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-sm font-medium font-georgia">Active Groups</CardTitle>
              <div className="h-8 w-8 rounded-full bg-pink-500/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-pink-500" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold font-georgia">{groups.length}</div>
              <p className="text-xs text-muted-foreground mt-1">All groups active</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/10 rounded-lg"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-sm font-medium font-georgia">Avg. Attendance</CardTitle>
              <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold font-georgia">{avgAttendance}%</div>
              <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-1">
                <ChevronUp className="h-3 w-3 mr-1" />
                <span>+2.1% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-teal-500/10 rounded-lg"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-sm font-medium font-georgia">Reports Due</CardTitle>
              <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-amber-500" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold font-georgia">{groupsWithReportsDue.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Groups need to submit reports</p>
            </CardContent>
          </Card>
        </div>

        {/* Group Cards Section */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Users className="h-6 w-6 mr-2 text-blue-500" />
              <h2 className="text-2xl font-bold font-georgia">{isGroupLeader ? "My Group" : "Church Groups"}</h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="shadow-sm hover:shadow transition-shadow font-georgia"
              asChild
            >
              <Link href="/groups">
                View All Groups
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {groups.map((group) => (
              <Card key={group.id} className="overflow-hidden">
                <div className={`h-2 ${group.color.split(" ")[0]}`}></div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="font-georgia">{group.name}</CardTitle>
                  </div>
                  <CardDescription className="font-georgia">Led by {group.leader}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm font-georgia">Members</span>
                      </div>
                      <span className="font-medium font-georgia">{group.members}</span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-georgia">Attendance Rate</span>
                        <span className="text-sm font-medium font-georgia">{group.attendance}%</span>
                      </div>
                      <Progress
                        value={group.attendance}
                        className="h-2"
                        style={
                          {
                            "--progress-background": group.chartColor,
                          } as React.CSSProperties
                        }
                      />
                    </div>

                    <div className="pt-2 border-t flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground font-georgia">Reports</p>
                        <p className="font-medium font-georgia">{group.reportsSubmitted}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground font-georgia">Last Report</p>
                        <p className="font-medium font-georgia">{group.lastReport}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {group.reportDue && (
                        <Button
                          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 font-georgia"
                          size="sm"
                          asChild
                        >
                          <Link href={`/upload?group=${group.id}`}>
                            <FileUpload className="mr-2 h-4 w-4" />
                            Upload Report
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Flame className="h-6 w-6 mr-2 text-orange-500" />
              <h2 className="text-2xl font-bold font-georgia">Quick Actions</h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Button
              className="h-auto py-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 font-georgia"
              asChild
            >
              <Link href="/upload">
                <FileUpload className="mr-2 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium font-georgia">Upload New Report</div>
                  <div className="text-xs opacity-90 font-georgia">Submit a new group report</div>
                </div>
              </Link>
            </Button>

            <Button
              className="h-auto py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 font-georgia"
              asChild
            >
              <Link href="/reports">
                <BarChart3 className="mr-2 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium font-georgia">View Reports</div>
                  <div className="text-xs opacity-90 font-georgia">Browse all submitted reports</div>
                </div>
              </Link>
            </Button>

            <Button
              className="h-auto py-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 font-georgia"
              asChild
            >
              <Link href="/groups">
                <Users className="mr-2 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium font-georgia">Manage Groups</div>
                  <div className="text-xs opacity-90 font-georgia">View and manage all church groups</div>
                </div>
              </Link>
            </Button>
          </div>
        </div>

        {/* Leadership Board Section */}
        <div className="mt-16 mb-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2 font-georgia">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-pink-500">
                MEET THE LEADERSHIP TEAM
              </span>
            </h2>
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-pink-500"></div>
            </div>
            <h3 className="text-xl font-semibold uppercase mb-4 text-gray-800 dark:text-gray-100 font-georgia">
              TRPH YOUTH MINISTRY
            </h3>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {leadershipTeam.map((member, index) => (
              <Card key={index} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all">
                <div className="h-2 bg-gradient-to-r from-orange-500 to-pink-500"></div>
                <CardContent className="p-6 text-center">
                  <div className="w-28 h-28 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden border-2 border-orange-200 shadow-md">
                    {member.image ? (
                      <Image
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        width={112}
                        height={112}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-orange-100 flex items-center justify-center">
                        <span className="text-2xl font-bold text-orange-500 font-georgia">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-center mb-1">
                    {member.role === "Youth Leader" && <Award className="h-4 w-4 text-orange-500 mr-1" />}
                    <h4 className="font-medium text-lg font-georgia">{member.name}</h4>
                  </div>
                  <p className="text-sm text-orange-600 font-medium font-georgia">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <footer className="py-6 mt-10 border-t bg-gradient-to-r from-orange-50 to-teal-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400 font-georgia">
          <p>The Redemption Powerhouse Youth Ministry | IGNITE 2025 | Dashboard © 2025</p>
        </div>
      </footer>
    </div>
  )
}


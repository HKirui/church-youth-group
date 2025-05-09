"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { usePermissions } from "@/hooks/use-permissions"
import { useRouter, useParams, redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Users } from "lucide-react"

export default function EditGroupPage() {
  const { data: session, status } = useSession()
  const { isAdmin, isGroupLeader, userGroupId, canEditGroup } = usePermissions()
  const router = useRouter()
  const params = useParams()
  const groupId = Number.parseInt(params.id as string)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [group, setGroup] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    leader: "",
    description: "",
    meetingDay: "",
    meetingTime: "",
    meetingLocation: "",
    contactEmail: "",
    contactPhone: "",
  })

  // Mock group data - in a real app, this would come from your API
  const mockGroups = [
    {
      id: 1,
      name: "Bereans",
      leader: "Jesse Lanya",
      description: "A group focused on deep Bible study and theological discussions.",
      meetingDay: "Saturday",
      meetingTime: "4:00 PM",
      meetingLocation: "Main Church Hall",
      contactEmail: "jesse@example.com",
      contactPhone: "123-456-7890",
    },
    {
      id: 2,
      name: "Flame of Truth",
      leader: "Audrey Akinyi",
      description: "Passionate about spreading the truth of the gospel through evangelism.",
      meetingDay: "Friday",
      meetingTime: "5:30 PM",
      meetingLocation: "Youth Room",
      contactEmail: "audrey@example.com",
      contactPhone: "123-456-7891",
    },
    {
      id: 3,
      name: "Ignite Warriors",
      leader: "Mercy Blessings",
      description: "Focused on spiritual warfare and prayer ministry.",
      meetingDay: "Sunday",
      meetingTime: "2:00 PM",
      meetingLocation: "Prayer Room",
      contactEmail: "mercy@example.com",
      contactPhone: "123-456-7892",
    },
    {
      id: 4,
      name: "Ignited in Christ",
      leader: "Keren Lanya",
      description: "Dedicated to discipleship and mentoring new believers.",
      meetingDay: "Wednesday",
      meetingTime: "6:00 PM",
      meetingLocation: "Fellowship Hall",
      contactEmail: "keren@example.com",
      contactPhone: "123-456-7893",
    },
    {
      id: 5,
      name: "Radiance",
      leader: "Joy Mella",
      description: "Focused on worship and creative arts ministry.",
      meetingDay: "Thursday",
      meetingTime: "5:00 PM",
      meetingLocation: "Sanctuary",
      contactEmail: "joy@example.com",
      contactPhone: "123-456-7894",
    },
  ]

  useEffect(() => {
    if (status !== "loading") {
      // Check if user has permission to edit this group
      if (!canEditGroup(groupId)) {
        router.push("/unauthorized")
        return
      }

      // Find the group data
      const foundGroup = mockGroups.find((g) => g.id === groupId)
      if (foundGroup) {
        setGroup(foundGroup)
        setFormData({
          name: foundGroup.name,
          leader: foundGroup.leader,
          description: foundGroup.description || "",
          meetingDay: foundGroup.meetingDay || "",
          meetingTime: foundGroup.meetingTime || "",
          meetingLocation: foundGroup.meetingLocation || "",
          contactEmail: foundGroup.contactEmail || "",
          contactPhone: foundGroup.contactPhone || "",
        })
      }
      setLoading(false)
    }
  }, [status, groupId, canEditGroup, router])

  // If not authenticated, redirect to sign in
  if (status === "unauthenticated") {
    redirect(`/auth/signin?callbackUrl=/groups/${groupId}/edit`)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Simulate API call to update group
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would send the formData to your API
      console.log("Updating group with data:", formData)

      // Redirect back to the group page or dashboard
      router.push("/")
    } catch (error) {
      console.error("Error updating group:", error)
    } finally {
      setSaving(false)
    }
  }

  // Show loading state while checking authentication or fetching data
  if (loading || status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-georgia">Loading...</p>
        </div>
      </div>
    )
  }

  if (!group) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium font-georgia">Group Not Found</h3>
          <p className="text-muted-foreground font-georgia">The group you're looking for doesn't exist.</p>
          <Button className="mt-4" asChild>
            <Link href="/">Return to Dashboard</Link>
          </Button>
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

      <Card className="max-w-2xl mx-auto border-none shadow-lg">
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 w-full rounded-t-lg"></div>
        <CardHeader>
          <CardTitle className="flex items-center font-georgia">
            <Users className="mr-2 h-5 w-5 text-orange-500" />
            Edit Group: {group.name}
          </CardTitle>
          <CardDescription className="font-georgia">Update your group's information and settings</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-georgia">
                Group Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="font-georgia"
                disabled={!isAdmin} // Only admins can change the group name
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="leader" className="font-georgia">
                Group Leader
              </Label>
              <Input
                id="leader"
                name="leader"
                value={formData.leader}
                onChange={handleInputChange}
                className="font-georgia"
                disabled={!isAdmin} // Only admins can change the group leader
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="font-georgia">
                Group Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="font-georgia"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meetingDay" className="font-georgia">
                  Meeting Day
                </Label>
                <Input
                  id="meetingDay"
                  name="meetingDay"
                  value={formData.meetingDay}
                  onChange={handleInputChange}
                  className="font-georgia"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meetingTime" className="font-georgia">
                  Meeting Time
                </Label>
                <Input
                  id="meetingTime"
                  name="meetingTime"
                  value={formData.meetingTime}
                  onChange={handleInputChange}
                  className="font-georgia"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meetingLocation" className="font-georgia">
                Meeting Location
              </Label>
              <Input
                id="meetingLocation"
                name="meetingLocation"
                value={formData.meetingLocation}
                onChange={handleInputChange}
                className="font-georgia"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail" className="font-georgia">
                  Contact Email
                </Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className="font-georgia"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone" className="font-georgia">
                  Contact Phone
                </Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className="font-georgia"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/")} className="font-georgia">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 font-georgia"
            >
              {saving ? (
                <>
                  <Save className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}


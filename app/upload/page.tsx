"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams, redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload, FileText, X } from "lucide-react"
import { useSession } from "next-auth/react"
import { usePermissions } from "@/hooks/use-permissions"

export default function UploadPage() {
  const { data: session, status } = useSession()
  const { isAdmin, isGroupLeader, userGroupId, canAccessGroup } = usePermissions()
  const router = useRouter()
  const searchParams = useSearchParams()
  const groupParam = searchParams.get("group")
  const groupId = groupParam ? Number.parseInt(groupParam) : null

  // If the user is not authenticated, redirect to sign in
  if (status === "unauthenticated") {
    redirect("/auth/signin?callbackUrl=/upload" + (groupParam ? `?group=${groupParam}` : ""))
  }

  // If the user is authenticated but doesn't have access to this group, redirect to unauthorized
  if (status === "authenticated" && groupId && !canAccessGroup(groupId)) {
    redirect("/unauthorized")
  }

  // If the user is a group leader but no group is specified, redirect to their group
  if (status === "authenticated" && isGroupLeader && userGroupId && !groupId) {
    redirect(`/upload?group=${userGroupId}`)
  }

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    group: groupId?.toString() || "",
    date: new Date().toISOString().split("T")[0],
    attendance: "",
    summary: "",
    highlights: "",
    challenges: "",
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [uploadSuccess, setUploadSuccess] = useState(false)

  // Set the initial group value based on URL parameter or user's group
  useEffect(() => {
    if (groupId) {
      setFormData((prev) => ({ ...prev, group: groupId.toString() }))
    } else if (isGroupLeader && userGroupId) {
      setFormData((prev) => ({ ...prev, group: userGroupId.toString() }))
    }
  }, [groupId, isGroupLeader, userGroupId])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.group) errors.group = "Please select a group"
    if (!formData.date) errors.date = "Please select a date"
    if (!formData.attendance) errors.attendance = "Please enter attendance"
    if (!formData.summary) errors.summary = "Please provide a meeting summary"
    if (!file) errors.file = "Please upload a report document"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsUploading(true)

    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real implementation, you would:
      // 1. Upload the file to your server or cloud storage
      // 2. Save the form data to your database
      // 3. Handle any errors that occur during the process

      setUploadSuccess(true)

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/reports")
      }, 2000)
    } catch (error) {
      console.error("Upload error:", error)
      setFormErrors({ submit: "Failed to upload report. Please try again." })
    } finally {
      setIsUploading(false)
    }
  }

  const removeFile = () => {
    setFile(null)
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Find the group name based on the selected value
  const groupNames = {
    "1": "Bereans",
    "2": "Flame of Truth",
    "3": "Ignite Warriors",
    "4": "Ignited in Christ",
    "5": "Radiance",
  }
  const selectedGroupName = groupNames[formData.group as keyof typeof groupNames] || ""

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-georgia">Loading...</p>
        </div>
      </div>
    )
  }

  if (uploadSuccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto border-none shadow-lg">
          <div className="bg-gradient-to-r from-green-500 to-teal-500 h-2 w-full rounded-t-lg"></div>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Report Uploaded Successfully!</h2>
            <p className="text-gray-600 mb-6">
              The report for <span className="font-medium">{selectedGroupName}</span> has been uploaded and will be
              processed shortly.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <Link href="/reports">View All Reports</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Return to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
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
          <CardTitle className="flex items-center">
            <Upload className="mr-2 h-5 w-5 text-orange-500" />
            {selectedGroupName ? `Upload Report for ${selectedGroupName}` : "Upload Group Report"}
          </CardTitle>
          <CardDescription>Share your group's activities, attendance, and performance metrics</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="group" className={formErrors.group ? "text-red-500" : ""}>
                Group Name {formErrors.group && <span className="text-xs">- {formErrors.group}</span>}
              </Label>
              <Select
                name="group"
                value={formData.group}
                onValueChange={(value) => handleSelectChange("group", value)}
                disabled={isGroupLeader} // Group leaders can't change the group
              >
                <SelectTrigger id="group" className={formErrors.group ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  {isAdmin ? (
                    <>
                      <SelectItem value="1">Bereans</SelectItem>
                      <SelectItem value="2">Flame of Truth</SelectItem>
                      <SelectItem value="3">Ignite Warriors</SelectItem>
                      <SelectItem value="4">Ignited in Christ</SelectItem>
                      <SelectItem value="5">Radiance</SelectItem>
                    </>
                  ) : (
                    <SelectItem value={userGroupId?.toString() || ""}>{selectedGroupName}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className={formErrors.date ? "text-red-500" : ""}>
                Meeting Date {formErrors.date && <span className="text-xs">- {formErrors.date}</span>}
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                className={formErrors.date ? "border-red-500" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="attendance" className={formErrors.attendance ? "text-red-500" : ""}>
                Attendance {formErrors.attendance && <span className="text-xs">- {formErrors.attendance}</span>}
              </Label>
              <Input
                id="attendance"
                name="attendance"
                type="number"
                min="0"
                placeholder="Number of attendees"
                value={formData.attendance}
                onChange={handleInputChange}
                className={formErrors.attendance ? "border-red-500" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary" className={formErrors.summary ? "text-red-500" : ""}>
                Meeting Summary {formErrors.summary && <span className="text-xs">- {formErrors.summary}</span>}
              </Label>
              <Textarea
                id="summary"
                name="summary"
                placeholder="Briefly describe what was covered in the meeting"
                rows={3}
                value={formData.summary}
                onChange={handleInputChange}
                className={formErrors.summary ? "border-red-500" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="highlights">Highlights & Achievements</Label>
              <Textarea
                id="highlights"
                name="highlights"
                placeholder="Any notable achievements or highlights from this meeting"
                rows={2}
                value={formData.highlights}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="challenges">Challenges</Label>
              <Textarea
                id="challenges"
                name="challenges"
                placeholder="Any challenges or issues that need attention"
                rows={2}
                value={formData.challenges}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label className={formErrors.file ? "text-red-500" : ""}>
                Attach Report Document {formErrors.file && <span className="text-xs">- {formErrors.file}</span>}
              </Label>
              {file ? (
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-orange-500 mr-2" />
                    <div>
                      <span className="text-sm font-medium">{file.name}</span>
                      <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={removeFile} className="h-8 w-8 p-0">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove file</span>
                  </Button>
                </div>
              ) : (
                <div className="flex justify-center">
                  <div className="relative w-full">
                    <Input
                      ref={fileInputRef}
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                    />
                    <div
                      onClick={triggerFileInput}
                      className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-md p-8 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Drag and drop your file here or click to browse
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Supports PDF, DOCX, XLSX, and image files
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/")}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUploading}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            >
              {isUploading ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Submit Report
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}


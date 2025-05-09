"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Cloud, Check, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"

interface GoogleDrivePickerProps {
  onFileSelect: (file: { name: string; id: string; mimeType: string; url?: string }) => void
  onCancel: () => void
  email?: string
}

export function GoogleDrivePicker({
  onFileSelect,
  onCancel,
  email = "trphyouthministry@gmail.com",
}: GoogleDrivePickerProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [recentFiles, setRecentFiles] = useState([
    {
      name: "March Report.docx",
      id: "1",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      lastModified: "2025-03-15",
    },
    {
      name: "Attendance Sheet.xlsx",
      id: "2",
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      lastModified: "2025-03-10",
    },
    {
      name: "Meeting Notes.pdf",
      id: "3",
      mimeType: "application/pdf",
      lastModified: "2025-03-05",
    },
    {
      name: "Group Photo.jpg",
      id: "4",
      mimeType: "image/jpeg",
      lastModified: "2025-02-28",
    },
    {
      name: "Event Schedule.docx",
      id: "5",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      lastModified: "2025-02-20",
    },
  ])
  const [selectedFile, setSelectedFile] = useState<any>(null)

  // Simulate checking for existing authentication on component mount
  useEffect(() => {
    // This would normally check for an existing Google auth token
    const checkExistingAuth = async () => {
      try {
        // For demo purposes, we'll just check localStorage
        const hasAuth = localStorage.getItem("google_drive_auth")
        if (hasAuth) {
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error("Error checking auth:", error)
      }
    }

    checkExistingAuth()
  }, [])

  const handleAuth = () => {
    setIsLoading(true)
    setAuthError(null)

    // Simulate authentication with Google
    setTimeout(() => {
      try {
        // In a real implementation, this would use the Google OAuth flow
        setIsAuthenticated(true)
        localStorage.setItem("google_drive_auth", "true")
      } catch (error) {
        setAuthError("Failed to authenticate with Google Drive. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }, 1500)
  }

  const handleSelectFile = (file: any) => {
    setSelectedFile(file)
    // Add a URL property to simulate a downloadable link
    const fileWithUrl = {
      ...file,
      url: `https://drive.google.com/uc?export=download&id=${file.id}`,
    }
    onFileSelect(fileWithUrl)
  }

  const handleDisconnect = () => {
    setIsAuthenticated(false)
    setSelectedFile(null)
    localStorage.removeItem("google_drive_auth")
  }

  return (
    <div className="w-full">
      {!isAuthenticated ? (
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-md">
          <Cloud className="h-10 w-10 text-gray-400 mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
            Connect to Google Drive to access your files
          </p>
          {authError && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span className="text-sm">{authError}</span>
            </div>
          )}
          <Button
            type="button"
            onClick={handleAuth}
            disabled={isLoading}
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
          >
            {isLoading ? "Connecting..." : "Connect to Google Drive"}
          </Button>
          <p className="text-xs text-gray-400 mt-3">Using account: {email}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
            <div className="flex items-center">
              <Cloud className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-sm font-medium">Connected to Google Drive</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleDisconnect} className="text-xs text-gray-500">
              Disconnect
            </Button>
          </div>

          <Card className="border rounded-md p-3">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium">Recent Files</h4>
              <Button variant="ghost" size="sm" className="text-xs">
                Browse All
              </Button>
            </div>

            {recentFiles.map((file, i) => (
              <div
                key={i}
                className={`flex items-center justify-between py-2 border-t ${
                  selectedFile?.id === file.id ? "bg-orange-50 dark:bg-gray-700" : ""
                }`}
              >
                <div className="flex items-center">
                  <FileText
                    className={`h-4 w-4 mr-2 ${
                      file.mimeType.includes("sheet")
                        ? "text-green-500"
                        : file.mimeType.includes("document")
                          ? "text-blue-500"
                          : file.mimeType.includes("pdf")
                            ? "text-red-500"
                            : file.mimeType.includes("image")
                              ? "text-purple-500"
                              : "text-gray-400"
                    }`}
                  />
                  <div>
                    <span className="text-sm">{file.name}</span>
                    <p className="text-xs text-gray-500">Modified: {file.lastModified}</p>
                  </div>
                </div>
                <Button
                  variant={selectedFile?.id === file.id ? "default" : "ghost"}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => handleSelectFile(file)}
                >
                  {selectedFile?.id === file.id ? (
                    <>
                      <Check className="h-3 w-3 mr-1" /> Selected
                    </>
                  ) : (
                    "Select"
                  )}
                </Button>
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  )
}


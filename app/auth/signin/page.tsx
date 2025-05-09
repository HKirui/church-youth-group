"use client"

import { signIn } from "next-auth/react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { useSearchParams } from "next/navigation"

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const error = searchParams.get("error")

  const handleSignIn = async () => {
    try {
      setIsLoading(true)
      await signIn("google", { callbackUrl })
    } catch (error) {
      console.error("Sign in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-500 to-pink-500">
      <Card className="w-full max-w-md border-none shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative w-32 h-32 rounded-full bg-white/20 p-2 backdrop-blur-sm flex items-center justify-center shadow-lg border-2 border-white/30">
              <div className="relative w-28 h-28 rounded-full overflow-hidden bg-white/90 p-2">
                <Image
                  src="/images/ignite-logo.png"
                  alt="IGNITE 2025 Logo"
                  width={112}
                  height={112}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl font-georgia">Welcome to IGNITE 2025</CardTitle>
          <CardDescription className="font-georgia">Sign in to access the Youth Ministry Dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm font-georgia">
              {error === "AccessDenied"
                ? "You don't have permission to access this application. Please contact your administrator."
                : "An error occurred during sign in. Please try again."}
            </div>
          )}

          <div className="p-4 bg-white/10 backdrop-blur-sm rounded-md text-center text-white font-georgia">
            <p className="text-sm mb-2">
              <strong>Group Leaders:</strong> You will only have access to your own group's data.
            </p>
            <p className="text-sm">
              <strong>Youth Leaders:</strong> You will have view-only access to all groups.
            </p>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-md hover:shadow-lg transition-all font-georgia"
            onClick={handleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              "Signing in..."
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}


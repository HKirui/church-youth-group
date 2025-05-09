"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestAuth() {
  const { data: session, status } = useSession()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication Test</CardTitle>
          <CardDescription>Testing NextAuth.js configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="font-medium">Status: {status}</p>
            {session && (
              <div className="mt-2">
                <p>Signed in as: {session.user?.email}</p>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {status === "authenticated" ? (
            <Button onClick={() => signOut()} variant="destructive">
              Sign Out
            </Button>
          ) : (
            <Button onClick={() => signIn("google")}>Sign In with Google</Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function LoginButton() {
  const { data: session, status } = useSession()
  const isLoading = status === "loading"

  if (isLoading) {
    return <Button disabled>Loading...</Button>
  }

  if (session) {
    return (
      <Button variant="outline" onClick={() => signOut()}>
        Sign Out
      </Button>
    )
  }

  return <Button onClick={() => signIn("google")}>Sign In</Button>
}


"use client"

import { useSession } from "next-auth/react"

export function usePermissions() {
  const { data: session } = useSession()

  // Default values
  const defaultPermissions = {
    isAdmin: false,
    isGroupLeader: false,
    userGroupId: undefined,
    canAccessGroup: () => false,
    canEditGroup: () => false,
    canViewAllGroups: false,
    user: null,
  }

  // If no session, return default permissions
  if (!session?.user) {
    return defaultPermissions
  }

  // Extract role and groupId safely
  const role = (session.user as any).role
  const groupId = (session.user as any).groupId

  const isAdmin = role === "admin"
  const isGroupLeader = role === "groupLeader"
  const canViewAllGroups = isAdmin

  return {
    isAdmin,
    isGroupLeader,
    userGroupId: groupId,
    canAccessGroup: (id: number) => isAdmin || (isGroupLeader && groupId === id),
    canEditGroup: (id: number) => isAdmin || (isGroupLeader && groupId === id),
    canViewAllGroups,
    user: session.user,
  }
}


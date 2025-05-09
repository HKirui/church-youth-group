export type UserRole = "admin" | "groupLeader"

export interface User {
  id: string
  name: string
  email: string
  image?: string
  role?: UserRole
  groupId?: number
}

export interface Session {
  user: User
  expires: string
}


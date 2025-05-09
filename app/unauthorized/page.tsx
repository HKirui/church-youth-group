import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 font-georgia">
      <div className="w-full max-w-md space-y-4 rounded-lg border p-6 shadow-md text-center bg-white">
        <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
        <p className="text-gray-600">
          You don't have permission to access this page. Please contact your administrator if you believe this is an
          error.
        </p>
        <Button
          asChild
          className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
        >
          <Link href="/">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}


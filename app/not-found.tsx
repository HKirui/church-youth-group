import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4 rounded-lg border p-6 shadow-md text-center">
        <h2 className="text-2xl font-bold">Page Not Found</h2>
        <p className="text-gray-600">The page you are looking for doesn't exist or has been moved.</p>
        <Button
          asChild
          className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
        >
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  )
}


import Link from "next/link"
import { Dumbbell, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-4 text-center">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="bg-primary/10 p-4 rounded-full mb-6 border border-primary/20">
          <Dumbbell className="h-16 w-16 text-primary animate-pulse" />
        </div>
        <h1 className="text-7xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
          404
        </h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md mb-8">
          It looks like you've wandered into the wrong gym branch. The page you are looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button size="lg" className="gap-2 text-md">
            <Home className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}

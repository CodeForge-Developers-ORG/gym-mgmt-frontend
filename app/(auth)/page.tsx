"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Mail, Lock, LogIn, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { api } from "@/lib/api-client"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.target as HTMLFormElement)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const data = await api.post("/auth/login", { email, password })
      
      if (data.user.role === "SUPER_ADMIN" || data.user.role === "SuperAdmin") {
        setError("Super Admin access is restricted on this page.")
        return
      }

      localStorage.setItem("token", data.access_token)
      localStorage.setItem("user", JSON.stringify(data.user))
      
      const role = data.user.role.toLowerCase()
      router.push(`/${role}`)
    } catch (err: any) {
      setError(err.message || "Invalid credentials")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full opacity-0 animate-slide-up-fade">
      <div className="bg-white rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-gray-200">
        <div className="p-8 md:p-10 space-y-6">
          {/* Header */}
          <div className="space-y-4 text-center">
            <div className="relative h-10 w-44 mx-auto opacity-0 animate-slide-up-fade [animation-delay:200ms]">
              <Image 
                src="/logo/logo.png" 
                alt="Staff Khata Logo" 
                fill 
                className="object-contain object-center"
                priority
              />
            </div>
            <div className="space-y-1 opacity-0 animate-slide-up-fade [animation-delay:300ms]">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Login to Staff Khata
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                Don't have an account?{" "}
                <Link href="/register" className="text-primary hover:underline font-bold">
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5 text-left opacity-0 animate-slide-in-left [animation-delay:400ms]">
              <Label htmlFor="email" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block ml-1">Email*</Label>
              <Input
                id="email"
                name="email"
                placeholder="example@staffkhata.com"
                type="email"
                disabled={isLoading}
                className="h-11 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg transition-all"
                required
              />
            </div>

            <div className="space-y-1.5 text-left opacity-0 animate-slide-in-left [animation-delay:500ms]">
              <Label htmlFor="password" title="Enter your password" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block ml-1">Password*</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                disabled={isLoading}
                className="h-11 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg transition-all"
                required
              />
            </div>

            <div className="flex items-center justify-between py-0.5 opacity-0 animate-slide-up-fade [animation-delay:600ms]">
              <div className="flex items-center space-x-2 group cursor-pointer">
                <Checkbox id="remember" className="h-3.5 w-3.5 border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Remember this device
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-xs font-bold text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {error && (
              <div className="text-xs font-medium text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 animate-in shake-1 duration-300">
                {error}
              </div>
            )}

            <div className="space-y-3 pt-2 opacity-0 animate-slide-up-fade [animation-delay:700ms]">
              <Button 
                disabled={isLoading} 
                className="w-full h-12 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-md transition-all active:scale-[0.98] group"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Log In <LogIn className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </Button>

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-100" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-white px-4 text-gray-400 font-bold tracking-widest">or sign in with</span>
                </div>
              </div>
              
              <Button type="button" variant="outline" className="w-full h-12 bg-white border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-all active:scale-[0.98]">
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google Sign In
              </Button>
            </div>
          </form>
        </div>
      </div>

      <p className="text-center text-[11px] text-gray-300 mt-6 font-medium">
        © {new Date().getFullYear()} Staff Khata Gym Management. All rights reserved.
      </p>
    </div>
  )
}

"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RoleSwitcher } from "@/components/layout/role-switcher"
import { api } from "@/lib/api-client"

import Image from "next/image"

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
      
      // Reject Super Admin on this page
      if (data.user.role === "SUPER_ADMIN" || data.user.role === "SuperAdmin") {
        setError("Super Admin access is restricted on this page.")
        return
      }

      // Store session
      localStorage.setItem("token", data.access_token)
      localStorage.setItem("user", JSON.stringify(data.user))
      
      // Redirect based on role
      const role = data.user.role.toLowerCase()
      router.push(`/${role}`)
    } catch (err: any) {
      setError(err.message || "Invalid credentials")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm space-y-8 animate-fade-in">
      <div className="flex flex-col space-y-4 text-center items-center">
        <div className="relative w-full h-20">
          <Image 
            src="/logo/logo.png" 
            alt="Staff Khata Logo" 
            fill 
            className="object-contain"
            priority
          />
        </div>
        <div className="space-y-4">
          <div className="text-primary text-[11px] font-black uppercase tracking-[0.3em] opacity-80">
            Gym Management
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <form onSubmit={onSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                className="h-11"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-primary hover:underline underline-offset-4"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                disabled={isLoading}
                className="h-11"
                required
              />
            </div>
            {error && (
              <p className="text-sm font-medium text-destructive animate-shake">
                {error}
              </p>
            )}
            <Button disabled={isLoading} className="h-11 mt-2">
              {isLoading && (
                <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              )}
              Sign In
            </Button>
          </div>
        </form>
      </div>

      <p className="px-8 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="hover:text-primary underline underline-offset-4"
        >
          Sign up
        </Link>
      </p>
    </div>
  )
}

"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { api } from "@/lib/api-client"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.target as HTMLFormElement)
    const name = `${formData.get("firstName")} ${formData.get("lastName")}`
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        role: "Customer" // Default role
      })

      localStorage.setItem("token", response.access_token)
      localStorage.setItem("user", JSON.stringify(response.user))
      
      router.push("/customer")
    } catch (err: any) {
      setError(err.message || "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-8 animate-fade-in">
      <div className="flex flex-col space-y-2 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Create an account</h2>
        <p className="text-sm text-muted-foreground">
          Enter your details below to create your Staff Khata Gym Management account
        </p>
      </div>

      <div className="grid gap-6">
        <form onSubmit={onSubmit}>
          <div className="grid gap-4">
            {error && <div className="text-sm font-medium text-destructive text-center bg-destructive/10 py-2 rounded-md">{error}</div>}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" name="firstName" placeholder="John" required className="h-11" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" name="lastName" placeholder="Doe" required className="h-11" />
              </div>
            </div>
            
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
                required
                className="h-11"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                disabled={isLoading}
                required
                className="h-11"
              />
            </div>
            
            <Button disabled={isLoading} className="h-11 mt-2">
              {isLoading && (
                <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              )}
              Create Account
            </Button>
          </div>
        </form>
      </div>

      <p className="px-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/"
          className="hover:text-primary underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}

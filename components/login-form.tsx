"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api-client"
import { useToast } from "@/context/toast-context"
import { LogIn } from "lucide-react"

interface LoginFormProps extends React.ComponentProps<"div"> {
  isSuperAdmin?: boolean;
}

export function LoginForm({
  className,
  isSuperAdmin = false,
  ...props
}: LoginFormProps) {
  const router = useRouter()
  const toast = useToast()
  const [isLoading, setIsLoading] = React.useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const loadingId = toast.loading("Logging in", "Checking your credentials...")

    try {
      const data = await api.post("/auth/login", { email, password })
      
      const role = data.user.role.toLowerCase().trim()
      const isUserSuperAdmin = role === "superadmin" || role === "super_admin"

      if (isSuperAdmin && !isUserSuperAdmin) {
        toast.removeNotification(loadingId)
        toast.error("Access Denied", "This login is only for Super Administrators.")
        return
      }

      if (!isSuperAdmin && isUserSuperAdmin) {
        toast.removeNotification(loadingId)
        toast.error("Restricted Access", "Super Admin access is restricted on this page.")
        return
      }

      localStorage.setItem("token", data.access_token)
      localStorage.setItem("user", JSON.stringify(data.user))
      
      toast.removeNotification(loadingId)
      toast.success("Welcome Back", "Login successful. Redirecting...")

      let dashboardRoute = "/admin"
      if (isUserSuperAdmin) {
        dashboardRoute = "/super-admin"
      } else if (role === "trainer") {
        dashboardRoute = "/trainer"
      } else if (role === "customer") {
        dashboardRoute = "/customer"
      }
      
      router.push(dashboardRoute)
    } catch (err: any) {
      toast.removeNotification(loadingId)
      toast.error("Login Failed", err.message || "Invalid credentials")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border border-muted shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)]">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={onSubmit} className="p-6 md:p-10 space-y-6">
            <div className="flex flex-col items-center gap-2 text-center mb-4">
              <div className="relative h-12 w-48 mb-2">
                <Image 
                  src="/logo/logo.png" 
                  alt="Staff Khata Logo" 
                  fill 
                  className="object-contain"
                  priority
                />
              </div>
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-balance text-sm text-muted-foreground">
                {isSuperAdmin ? "Super Admin Portal" : "Login to your Staff Khata account"}
              </p>
            </div>
            
            <FieldGroup className="p-0 gap-4">
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  disabled={isLoading}
                  className="h-11"
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="ml-auto text-xs font-bold text-primary hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                  disabled={isLoading}
                  className="h-11"
                />
              </Field>
              <Field className="pt-2">
                <Button type="submit" className="h-11 font-bold gap-2" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Authenticating...
                    </span>
                  ) : (
                    <>Login <LogIn className="h-4 w-4" /></>
                  )}
                </Button>
              </Field>
              
              <FieldSeparator className="py-2">
                Or continue with
              </FieldSeparator>
              
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" type="button" className="h-10 gap-2">
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </Button>
                <Button variant="outline" type="button" className="h-10 gap-2">
                  <svg className="h-4 w-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </Button>
              </div>

              {!isSuperAdmin && (
                <FieldDescription className="text-center mt-4">
                  Don&apos;t have an account? <Link href="/register" className="text-primary font-bold hover:underline">Sign up</Link>
                </FieldDescription>
              )}
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <Image
              src="/gym_background.jpg"
              alt="Gym Background"
              fill
              className="absolute inset-0 h-full w-full object-cover brightness-[0.7] grayscale-[0.2]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-10 text-white">
              <h2 className="text-2xl font-black italic tracking-tighter mb-2">STAFF KHATA GYM</h2>
              <p className="text-sm opacity-80 font-medium">Empowering fitness centers with state-of-the-art management tools.</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center text-[10px]">
        By clicking continue, you agree to our <Link href="#" className="underline">Terms of Service</Link>{" "}
        and <Link href="#" className="underline">Privacy Policy</Link>.
      </FieldDescription>
    </div>
  )
}

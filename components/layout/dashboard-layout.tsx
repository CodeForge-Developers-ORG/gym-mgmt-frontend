"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import { Sidebar, type SidebarItem } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: SidebarItem[];
  roleName: string;
}

export function DashboardLayout({ children, navItems, roleName }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = React.useState(false)

  React.useEffect(() => {
    const token = localStorage.getItem("token")
    const userStr = localStorage.getItem("user")

    if (!token || !userStr) {
      // If unauthenticated and on super-admin path, go to super-admin login
      if (pathname.includes("/super-admin")) {
        router.push("/super-admin-login")
      } else {
        router.push("/")
      }
      return
    }

    const user = JSON.parse(userStr)
    const currentRole = user.role.toUpperCase()
    
    // Check if the user's role matches the path they are trying to access
    const pathRole = pathname.split("/")[1]?.toUpperCase()
    
    // Normalize Super Admin role string
    const normalizedCurrentRole = currentRole === "SUPERADMIN" ? "SUPER-ADMIN" : currentRole
    const normalizedPathRole = pathRole === "SUPERADMIN" ? "SUPER-ADMIN" : pathRole

    if (normalizedCurrentRole !== normalizedPathRole && normalizedPathRole !== "API") {
      // Unauthorized role for this path, redirect to their own dashboard
      const redirectRole = normalizedCurrentRole.toLowerCase().replace("-", "")
      router.push(`/${redirectRole}`)
      return
    }

    setIsAuthorized(true)
  }, [pathname, router])

  if (!isAuthorized) {
    return <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm font-medium text-muted-foreground italic">Authorizing access...</p>
      </div>
    </div>
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/20">
      {/* Desktop Sidebar */}
      <aside className="hidden w-72 shrink-0 lg:block fixed h-full z-10">
        <Sidebar items={navItems} role={roleName} />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:pl-72 min-h-screen">
        <Header navItems={navItems} roleName={roleName} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in max-w-[1600px] w-full mx-auto">
          <Breadcrumbs />
          {children}
        </main>
        
        <footer className="py-6 px-8 text-center text-sm text-muted-foreground border-t bg-card/50 backdrop-blur-sm mt-auto">
          <p>© {new Date().getFullYear()} Staff Khata Gym Management. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}

"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import { Sidebar, type SidebarItem } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { api } from "@/lib/api-client"

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
    const checkAuth = async () => {
      try {
        const response = await api.get("/auth/validate-token")
        if (response.valid && response.user) {
          const user = response.user
          localStorage.setItem("user", JSON.stringify(user))
          
          // Role matching logic
          const currentRole = user.role.toUpperCase()
          const pathRole = pathname.split("/")[1]?.toUpperCase()
          
          let normalizedCurrentRole = currentRole === "ADMINISTRATOR" ? "ADMIN" : currentRole
          if (normalizedCurrentRole === "SUPERADMIN") normalizedCurrentRole = "SUPER-ADMIN"
          
          let normalizedPathRole = pathRole === "ADMINISTRATOR" ? "ADMIN" : pathRole
          if (normalizedPathRole === "SUPERADMIN") normalizedPathRole = "SUPER-ADMIN"

          if (normalizedCurrentRole !== normalizedPathRole && normalizedPathRole !== "API") {
            let redirectRole = normalizedCurrentRole.toLowerCase()
            let redirectPath = `/${redirectRole}`
            if (redirectRole === "administrator") redirectPath = "/admin"
            if (redirectRole === "super-admin" || redirectRole === "superadmin") redirectPath = "/super-admin"
            
            router.push(redirectPath)
            return
          }

          setIsAuthorized(true)
        } else {
          router.push("/")
        }
      } catch (err) {
        console.error("Auth validation failed", err)
        router.push("/")
      }
    }

    checkAuth()
  }, [pathname, router])

  // Filter navigation items based on subscription plan permissions
  const filteredNavItems = React.useMemo(() => {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem("user") : null
    if (!userStr) return navItems
    
    const user = JSON.parse(userStr)
    
    // SuperAdmin has full access to their specific menu
    if (user.role === 'SuperAdmin') return navItems
    
    // STRICT: If no permissions are defined for a tenant user, show NOTHING
    // This ensures that only gyms with a valid, mapped subscription plan can see menu items.
    if (!user.menu_permissions || !Array.isArray(user.menu_permissions)) return []
    
    // Filter the navigation items by matching hrefs in the permission list
    return navItems.filter(item => user.menu_permissions.includes(item.href))
  }, [navItems])

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
        <Sidebar items={filteredNavItems} role={roleName} />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:pl-72 min-h-screen">
        <Header navItems={filteredNavItems} roleName={roleName} />
        
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

"use client"

import * as React from "react"
import { Bell, Menu, Search, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/context/toast-context"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RoleSwitcher } from "@/components/layout/role-switcher"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { BranchSelector } from "@/components/layout/branch-selector"
import { Sidebar, type SidebarItem } from "@/components/layout/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { mockData } from "@/lib/mock-data"
import { getInitials } from "@/lib/utils"

interface HeaderProps {
  navItems: SidebarItem[];
  roleName: string;
}

export function Header({ navItems, roleName }: HeaderProps) {
  const [user, setUser] = React.useState<any>(null)
  const router = useRouter()
  const toast = useToast()

  React.useEffect(() => {
    const loadUser = () => {
      const userStr = localStorage.getItem("user")
      if (userStr) {
        setUser(JSON.parse(userStr))
      }
    }

    loadUser()
    window.addEventListener("user-updated", loadUser)
    window.addEventListener("storage", loadUser)

    return () => {
      window.removeEventListener("user-updated", loadUser)
      window.removeEventListener("storage", loadUser)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged Out", "You have been successfully logged out.")
    router.push("/")
  }

  if (!user) return <header className="sticky top-0 z-40 h-16 border-b bg-background/80 backdrop-blur-md" />

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background/80 px-4 shadow-sm backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-4 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0 lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0 border-r shadow-2xl bg-background">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <Sidebar items={navItems} role={roleName} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden lg:flex flex-1 items-center gap-4 max-w-2xl">
        <BranchSelector />
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search classes, members, or trainers..."
            className="w-full bg-muted/50 pl-9 border-none focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
        <ThemeToggle />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive border-2 border-background"></span>
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="flex flex-col gap-1 p-2 max-h-[300px] overflow-y-auto">
              <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
                <Bell className="h-6 w-6 opacity-30" />
                <p className="text-xs font-medium">No new notifications</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="w-full text-center text-primary justify-center cursor-pointer">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9 border">
                <AvatarImage src={user.avatar} alt={user.name || user.fullName} />
                <AvatarFallback>{getInitials(user.name || user.fullName)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name || user.fullName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              Billing
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

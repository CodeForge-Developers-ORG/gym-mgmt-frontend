"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { Moon, Sun, User, Settings, Users, Monitor, MonitorPlay, Activity } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RoleSwitcher() {
  const router = useRouter()

  const roles = [
    { id: "super-admin", name: "Super Admin", icon: MonitorPlay, path: "/super-admin" },
    { id: "admin", name: "Administrator", icon: Settings, path: "/admin" },
    { id: "trainer", name: "Trainer", icon: Activity, path: "/trainer" },
    { id: "customer", name: "Customer", icon: User, path: "/customer" },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 shrink-0">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Switch Role Demo</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Preview Dashboard As</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {roles.map((role) => (
            <DropdownMenuItem 
              key={role.id} 
              onClick={() => router.push(role.path)}
              className="cursor-pointer"
            >
              <role.icon className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{role.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

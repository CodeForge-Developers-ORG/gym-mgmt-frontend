"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Building2,
  CreditCard,
  Settings,
  Activity,
  CalendarDays,
  Dumbbell,
  Receipt,
  FileText,
  User,
  HeartPulse,
  LogOut,
  Target
} from "lucide-react"

import Image from "next/image"

export type SidebarItem = {
  title: string;
  href: string;
  icon: React.ElementType;
};

interface SidebarProps {
  items: SidebarItem[];
  role: string;
}

export function Sidebar({ items, role }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-full flex-col bg-card border-r shadow-sm">
      <div className="p-6 flex flex-col items-center gap-3 border-b">
        <div className="relative w-full h-12">
          <Image 
            src="/logo/logo.png" 
            alt="Staff Khata Logo" 
            fill 
            className="object-contain"
            priority
          />
        </div>
        <div className="text-primary text-[10px] font-black uppercase tracking-[0.2em] opacity-80 text-center">
          Gym Management
        </div>
      </div>

      <div className="px-4 py-2">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
          {role} Navigation
        </div>
        <nav className="flex flex-col gap-1.5">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`) && item.href !== `/${role.toLowerCase()}`
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-muted-foreground/70")} />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t">
        <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50 text-center">
          Staff Khata Gym Management
        </div>
      </div>
    </div>
  )
}

// Configured nav items per role
export const superAdminNav: SidebarItem[] = [
  { title: "Dashboard", href: "/super-admin", icon: LayoutDashboard },
  { title: "Gym Branches", href: "/super-admin/gyms", icon: Building2 },
  { title: "Subscriptions", href: "/super-admin/subscriptions", icon: Receipt },
  { title: "Billing", href: "/super-admin/billing", icon: CreditCard },
  { title: "Admins", href: "/super-admin/admins", icon: Users },
  { title: "Analytics", href: "/super-admin/analytics", icon: Activity },
  { title: "Settings", href: "/super-admin/settings", icon: Settings },
];

export const adminNav: SidebarItem[] = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Members", href: "/admin/members", icon: Users },
  { title: "Trainers", href: "/admin/trainers", icon: Activity },
  { title: "Classes", href: "/admin/classes", icon: Dumbbell },
  { title: "Schedule", href: "/admin/schedule", icon: CalendarDays },
  { title: "Machine Directory", href: "/admin/machines/directory", icon: Dumbbell },
  { title: "Gym Machines", href: "/admin/machines", icon: Settings },
  { title: "Machine Health", href: "/admin/machines/health", icon: Activity },
  { title: "Exercises", href: "/admin/exercises", icon: Target },
  { title: "Membership Plans", href: "/admin/plans", icon: Receipt },
  { title: "Payments", href: "/admin/payments", icon: CreditCard },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

export const trainerNav: SidebarItem[] = [
  { title: "Dashboard", href: "/trainer", icon: LayoutDashboard },
  { title: "My Classes", href: "/trainer/classes", icon: CalendarDays },
  { title: "Clients", href: "/trainer/clients", icon: Users },
  { title: "Workout Plans", href: "/trainer/workouts", icon: Dumbbell },
  { title: "Diet Calculator", href: "/trainer/diet-calculator", icon: Activity },
  { title: "Diet Plans", href: "/trainer/diet", icon: HeartPulse },
  { title: "Ingredients DB", href: "/trainer/ingredients", icon: Settings },
  { title: "Diet Monitoring", href: "/trainer/diet-monitoring", icon: FileText },
  { title: "Profile", href: "/trainer/profile", icon: User },
];

export const customerNav: SidebarItem[] = [
  { title: "Dashboard", href: "/customer", icon: LayoutDashboard },
  { title: "Browse Classes", href: "/customer/classes", icon: CalendarDays },
  { title: "My Progress", href: "/customer/progress", icon: Activity },
  { title: "Achievements", href: "/customer/achievements", icon: Target },
  { title: "Workout Plan", href: "/customer/workout", icon: Dumbbell },
  { title: "Diet Plan", href: "/customer/diet", icon: HeartPulse },
  { title: "Membership", href: "/customer/membership", icon: CreditCard },
  { title: "Profile", href: "/customer/profile", icon: User },
];

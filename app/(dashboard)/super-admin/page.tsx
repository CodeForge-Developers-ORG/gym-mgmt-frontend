"use client"

import * as React from "react"
import { Building2, CreditCard, Users, Activity } from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { api } from "@/lib/api-client"
import { SlideInText } from "@/components/ui/slide-in-text"

export default function SuperAdminDashboard() {
  const [stats, setStats] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        const data = await api.get("/super-admin/stats", { token })
        setStats(data)
      } catch (err) {
        console.error("Failed to fetch super admin stats", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SlideInText text="Platform Overview" />
          <p className="text-muted-foreground">Monitor performance and growth across all gym branches.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Active Gyms"
          value={stats?.total_gyms ?? "..."}
          icon={Building2}
          trend={12.5}
          description="from last month"
          className="animate-slide-up"
        />
        <StatsCard
          title="Total MRR"
          value={`$${stats?.total_revenue?.toLocaleString() ?? "..."}`}
          icon={CreditCard}
          trend={8.2}
          description="from last month"
          className="animate-slide-up"
        />
        <StatsCard
          title="Total Platform Users"
          value={stats?.active_subscriptions ?? "..."}
          icon={Users}
          trend={18.1}
          description="from last month"
          className="animate-slide-up"
        />
        <StatsCard
          title="Platform Uptime"
          value="99.99%"
          icon={Activity}
          trend={0.01}
          description="from system logs"
          className="animate-slide-up"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-5 animate-slide-up">
          <RevenueChart data={[]} />
        </div>
        <div className="lg:col-span-2 animate-slide-up">
          <ActivityFeed activities={[]} />
        </div>
      </div>
    </div>
  )
}

"use client"

import * as React from "react"
import { Users, Activity, Dumbbell, CreditCard } from "lucide-react"

import { StatsCard } from "@/components/dashboard/stats-card"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { ActivityFeed } from "@/components/dashboard/activity-feed"

import { FitnessScoreWidget, TrainerTaskWidget, CalendarWidget, AnalogClockWidget, RevenueGrowthWidget, ClassDistributionWidget } from "@/components/wigggle/gym-widgets"
import { SlideInText } from "@/components/ui/slide-in-text"
import { api } from "@/lib/api-client"

export default function AdminDashboard() {
  const [stats, setStats] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token")
        const userStr = localStorage.getItem("user")
        if (!token || !userStr) return

        const user = JSON.parse(userStr)
        const data = await api.get("/dashboard/admin/stats", {
          token,
          gymId: user.gym_id
        })
        setStats(data)
      } catch (err) {
        console.error("Failed to fetch admin stats", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SlideInText text="Staff Khata Dashboard" />
          <p className="text-muted-foreground">Welcome back, here's what's happening at your branch today.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 perspective-distant">
        <FitnessScoreWidget />
        <TrainerTaskWidget />
        <CalendarWidget />
        <AnalogClockWidget />
        <RevenueGrowthWidget />
        <ClassDistributionWidget />
      </div>

      <div className="flex flex-wrap gap-4 perspective-distant">
        <StatsCard
          title="Total Members"
          value={stats?.members_count ?? "..."}
          icon={Users}
          trend={4.5}
          description="from last month"
          className="w-44 animate-slide-up"
        />
        <StatsCard
          title="Active Trainers"
          value={stats?.trainers_count ?? "..."}
          icon={Activity}
          trend={0}
          description="no change"
          className="w-44 animate-slide-up"
        />
        <StatsCard
          title="Classes Today"
          value={stats?.classes_count ?? "..."}
          icon={Dumbbell}
          description="Upcoming"
          className="w-44 animate-slide-up"
        />
        <StatsCard
          title="Monthly Revenue"
          value={stats ? `$${stats.revenue.toLocaleString()}` : "..."}
          icon={CreditCard}
          trend={12.5}
          description="from last month"
          className="w-44 animate-slide-up"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <div className="lg:col-span-4 animate-slide-up">
          <RevenueChart 
            data={[]} 
            title="Branch Revenue" 
            description="Last 6 months performance" 
          />
        </div>
        <div className="lg:col-span-3 animate-slide-up">
          <ActivityFeed activities={[]} title="Branch Activity" />
        </div>
      </div>
    </div>
  )
}

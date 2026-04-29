"use client"

import * as React from "react"
import { Metadata } from "next"
import { Users, CalendarDays, Star, Dumbbell } from "lucide-react"

import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getInitials, formatTime } from "@/lib/utils"
import { api } from "@/lib/api-client"

import { FitnessScoreWidget, TrainerTaskWidget, CalendarWidget, AnalogClockWidget } from "@/components/wigggle/gym-widgets"
import { SlideInText } from "@/components/ui/slide-in-text"

export default function TrainerDashboard() {
  const [stats, setStats] = React.useState<any>(null)
  const [upcomingClasses, setUpcomingClasses] = React.useState<any[]>([])
  const [user, setUser] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")
        const userStr = localStorage.getItem("user")
        if (!token || !userStr) return

        const currentUser = JSON.parse(userStr)
        setUser(currentUser)

        const [statsData, classesData] = await Promise.all([
          api.get("/dashboard/trainer/stats", { token, gymId: currentUser.gym_id }),
          api.get("/classes", { token, gymId: currentUser.gym_id })
        ])

        setStats(statsData)
        setUpcomingClasses(classesData.slice(0, 4))
      } catch (err) {
        console.error("Failed to fetch trainer data", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SlideInText text={`Welcome, ${ user?.name.split(' ')[0] }!`} />
          <p className="text-muted-foreground">Here is your schedule and client overview for today.</p>
        </div>
        <Button className="shrink-0 gradient-primary shadow-lg shadow-primary/20">Create Workout Plan</Button>
      </div>

      <div className="flex flex-wrap gap-4 perspective-distant">
        <FitnessScoreWidget />
        <TrainerTaskWidget />
        <CalendarWidget />
        <AnalogClockWidget />
      </div>

      <div className="flex flex-wrap gap-4 perspective-distant">
        <StatsCard
          title="My Clients"
          value={stats?.clients_count ?? "..."}
          icon={Users}
          trend={2}
          description="New this week"
          className="w-44"
        />
        <StatsCard
          title="Classes Today"
          value={stats?.classes_today ?? "..."}
          icon={CalendarDays}
          className="w-44"
        />
        <StatsCard
          title="Avg Rating"
          value={stats?.avg_rating ?? "..."}
          icon={Star}
          description="From performance metrics"
          className="w-44"
        />
        <StatsCard
          title="Tasks Pending"
          value={stats?.pending_tasks ?? "..."}
          icon={Dumbbell}
          description="Action required"
          className="w-44"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Classes</CardTitle>
            <CardDescription>Your schedule for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingClasses.map((cls) => (
                <div key={cls.id} className="flex items-center justify-between p-4 rounded-lg border glass group hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg text-primary text-center min-w-[70px]">
                      <div className="text-sm font-bold">{formatTime(cls.start_time).split(' ')[0]}</div>
                      <div className="text-xs">{formatTime(cls.start_time).split(' ')[1]}</div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{cls.name}</h4>
                      <p className="text-xs text-muted-foreground">{cls.capacity} capacity • {cls.duration || 60} min</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Button variant="ghost" size="sm" className="h-8">View Roster</Button>
                  </div>
                </div>
              ))}
              {upcomingClasses.length === 0 && (
                <div className="text-center py-8 text-muted-foreground italic">
                  No classes scheduled for today
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Notifications</CardTitle>
            <CardDescription>Latest system updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-3 rounded-xl border border-dashed">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Users className="size-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">New member joined your branch</p>
                  <p className="text-xs text-muted-foreground italic">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-3 rounded-xl border border-dashed">
                <div className="h-10 w-10 rounded-full bg-info/10 flex items-center justify-center text-info shrink-0">
                  <CalendarDays className="size-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Monthly schedule published</p>
                  <p className="text-xs text-muted-foreground italic">5 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

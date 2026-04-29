"use client"

import * as React from "react"
import { Metadata } from "next"
import { Flame, Activity, TrendingUp, Calendar as CalendarIcon, Dumbbell } from "lucide-react"

import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatTime, formatDate } from "@/lib/utils"
import { api } from "@/lib/api-client"

import { FitnessScoreWidget, CalendarWidget, AnalogClockWidget } from "@/components/wigggle/gym-widgets"
import { SlideInText } from "@/components/ui/slide-in-text"

export default function CustomerDashboard() {
  const [stats, setStats] = React.useState<any>(null)
  const [myClasses, setMyClasses] = React.useState<any[]>([])
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
          api.get("/dashboard/customer/stats", { token, gymId: currentUser.gym_id }),
          api.get("/classes", { token, gymId: currentUser.gym_id })
        ])

        setStats(statsData)
        // Filter classes to simulate "my classes" or just show first 2
        setMyClasses(classesData.slice(0, 2))
      } catch (err) {
        console.error("Failed to fetch customer data", err)
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
          <SlideInText text={`Hello, ${ user?.name.split(' ')[0] }!`} />
          <p className="text-muted-foreground">Keep up the great work. You're on a {stats?.streak || 0}-day streak!</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 perspective-distant">
        <FitnessScoreWidget />
        <CalendarWidget />
        <AnalogClockWidget />
      </div>

      <div className="flex flex-wrap gap-4 perspective-distant">
        <StatsCard
          title="Current Streak"
          value={`${stats?.streak || 0} Days`}
          icon={Flame}
          className="w-44 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20"
        />
        <StatsCard
          title="Calories Burned"
          value={stats?.calories_burned ?? "..."}
          icon={Activity}
          className="w-44"
        />
        <StatsCard
          title="Upcoming Class"
          value={stats?.upcoming_class || "None"}
          icon={TrendingUp}
          description="Next session"
          className="w-44"
        />
        <StatsCard
          title="Attendance"
          value={stats?.attendance_rate ?? "..."}
          icon={CalendarIcon}
          className="w-44"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Upcoming Classes</CardTitle>
                <CardDescription>Your booked sessions for the next 7 days</CardDescription>
              </div>
              <Button variant="outline" size="sm">Browse More</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {myClasses.map((cls) => (
                <div key={cls.id} className="relative overflow-hidden rounded-xl border p-5 glass group">
                  <div className="absolute top-0 right-0 p-4">
                    <Badge variant="success">Booked</Badge>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-bold text-lg mb-1">{cls.name}</h4>
                    <p className="text-sm text-muted-foreground">Gym Floor</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-medium mb-6">
                    <div className="flex items-center text-primary">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formatDate(cls.start_time)}
                    </div>
                    <div className="flex items-center text-primary">
                      <Activity className="mr-2 h-4 w-4" />
                      {formatTime(cls.start_time)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                        {cls.trainer?.user?.name.charAt(0) || "T"}
                      </div>
                      <span className="text-sm">{cls.trainer?.user?.name || "Trainer"}</span>
                    </div>
                    <Button variant="secondary" size="sm">Cancel</Button>
                  </div>
                </div>
              ))}
              {myClasses.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground italic">
                  You haven't booked any classes yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Your membership details</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="rounded-xl bg-gradient-primary p-6 text-white shadow-lg mb-6 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 opacity-20">
                <Dumbbell className="h-32 w-32" />
              </div>
              <h3 className="text-2xl font-bold mb-1">Active Plan</h3>
              <p className="opacity-90 text-sm mb-6">Member since {formatDate(user?.created_at || new Date())}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="opacity-80">Status</span>
                  <span className="font-semibold uppercase tracking-wider text-[10px] bg-white/20 px-2 py-0.5 rounded-full">Active</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button className="w-full" variant="outline">Upgrade Plan</Button>
              <Button className="w-full" variant="ghost">View Invoice History</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

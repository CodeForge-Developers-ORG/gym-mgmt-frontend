"use client"

import * as React from "react"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame, TrendingUp } from "lucide-react"
import Image from "next/image"
import { SlideInText } from "@/components/ui/slide-in-text"

export default function ProgressPage() {
  const weightData = [
    { name: "Week 1", total: 82, subscriptions: 0 },
    { name: "Week 2", total: 81.5, subscriptions: 0 },
    { name: "Week 3", total: 80, subscriptions: 0 },
    { name: "Week 4", total: 79.2, subscriptions: 0 },
    { name: "Week 5", total: 78, subscriptions: 0 },
  ]

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SlideInText text="My Progress" />
          <p className="text-muted-foreground">Track your weight and personal records.</p>
        </div>
        <div className="hidden sm:block">
          <Image src="/vector_icons/health/3d Health-1.png" alt="Progress Transformation" width={80} height={80} className="drop-shadow-md" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 opacity-30 group-hover:scale-110 group-hover:opacity-60 transition-all duration-500">
            <Image src="/vector_icons/Weight Scale.png" alt="Scale" width={160} height={160} />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Weight Lost</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black">4.0 kg</div>
            <p className="text-sm font-medium text-muted-foreground mt-1">In the last 5 weeks</p>
          </CardContent>
        </Card>

        <Card className="glass relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 opacity-30 group-hover:scale-110 group-hover:opacity-60 transition-all duration-500">
            <Image src="/vector_icons/health/3d Health(21).png" alt="Trophy" width={160} height={160} />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Workout Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black">12 Days</div>
            <p className="text-sm font-medium text-muted-foreground mt-1">Keep it up!</p>
          </CardContent>
        </Card>
      </div>

      <div className="h-[400px]">
        <RevenueChart data={weightData} title="Weight Tracking (kg)" description="Your progress over time" />
      </div>
    </div>
  )
}

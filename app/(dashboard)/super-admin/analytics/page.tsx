"use client"

import * as React from "react"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, TrendingDown, Target } from "lucide-react"
import { SlideInText } from "@/components/ui/slide-in-text"

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SlideInText text="Analytics" />
          <p className="text-muted-foreground">Deep dive into platform retention, churn, and growth metrics.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Churn Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4%</div>
            <p className="text-xs text-success mt-1">-0.3% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Customer Lifetime</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14 Months</div>
            <p className="text-xs text-muted-foreground mt-1">+1 month from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18.2%</div>
            <p className="text-xs text-success mt-1">Lead to Member</p>
          </CardContent>
        </Card>
      </div>

      <div className="h-[400px]">
        <RevenueChart data={[]} title="Growth Projections" description="Current year vs expected" />
      </div>
    </div>
  )
}

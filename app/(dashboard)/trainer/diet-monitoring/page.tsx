"use client"

import * as React from "react"
import { DataTable, type Column } from "@/components/tables/data-table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import { api } from "@/lib/api-client"
import { SlideInText } from "@/components/ui/slide-in-text"

export default function DietMonitoringPage() {
  const [dietStats, setDietStats] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchDietStats = async () => {
      try {
        const token = localStorage.getItem("token")
        const userStr = localStorage.getItem("user")
        if (!token || !userStr) return

        const user = JSON.parse(userStr)
        const data = await api.get("/diet-plans", {
          token,
          gymId: user.gym_id
        })
        setDietStats(data)
      } catch (err) {
        console.error("Failed to fetch diet stats", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDietStats()
  }, [])

  const columns: Column<any>[] = [
    { 
      header: "Plan Name", 
      cell: (row) => (
        <div className="font-medium">{row.name}</div>
      )
    },
    { 
      header: "Daily Target", 
      cell: (row) => (
        <div className="font-medium">{row.total_calories} kcal</div>
      )
    },
    { header: "Meals Count", cell: (row) => row.meals.length },
    { header: "Status", cell: () => (
      <Badge variant="success">Active</Badge>
    )},
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SlideInText text="Diet Monitoring" />
          <p className="text-muted-foreground">Track your clients' nutritional adherence and macro logging.</p>
        </div>
      </div>
      <DataTable data={dietStats} columns={columns} searchPlaceholder="Search plans..." />
    </div>
  )
}

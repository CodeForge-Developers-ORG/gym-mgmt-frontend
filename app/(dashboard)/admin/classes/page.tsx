"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/tables/data-table"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api-client"
import { formatTime, formatDate } from "@/lib/utils"
import { SlideInText } from "@/components/ui/slide-in-text"

export default function ClassesPage() {
  const [classes, setClasses] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem("token")
        const userStr = localStorage.getItem("user")
        if (!token || !userStr) return

        const user = JSON.parse(userStr)
        const data = await api.get("/classes", {
          token,
          gymId: user.gym_id
        })
        setClasses(data)
      } catch (err) {
        console.error("Failed to fetch classes", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchClasses()
  }, [])

  const columns: Column<any>[] = [
    { header: "Class Title", cell: (row) => <span className="font-semibold">{row.name}</span> },
    { header: "Trainer", cell: (row) => row.trainer?.user?.name || "N/A" },
    { header: "Date", cell: (row) => formatDate(row.start_time) },
    { header: "Time", cell: (row) => `${formatTime(row.start_time)} - ${formatTime(row.end_time)}` },
    { header: "Capacity", cell: (row) => row.capacity },
    { header: "Status", cell: (row) => (
      <Badge variant="outline">
        {new Date(row.start_time) > new Date() ? "Scheduled" : "Completed"}
      </Badge>
    )},
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SlideInText text="Manage Classes" />
          <p className="text-muted-foreground">Schedule classes, assign trainers, and track enrollments.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Class
        </Button>
      </div>
      <DataTable data={classes} columns={columns} searchPlaceholder="Search classes..." />
    </div>
  )
}

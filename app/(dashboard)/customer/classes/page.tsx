"use client"

import * as React from "react"
import { DataTable, type Column } from "@/components/tables/data-table"
import { api } from "@/lib/api-client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatTime, formatDate } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { SlideInText } from "@/components/ui/slide-in-text"

export default function BrowseClassesPage() {
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
    { header: "Class", cell: (row) => <span className="font-semibold">{row.name}</span> },
    { header: "Instructor", cell: (row) => row.trainer?.user?.name || "TBA" },
    { header: "Date & Time", cell: (row) => `${formatDate(row.start_time)} at ${formatTime(row.start_time)}` },
    { header: "Capacity", cell: (row) => <Badge variant="secondary">{row.capacity} spots total</Badge> },
    { header: "", cell: () => <Button size="sm">Book Now</Button> },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SlideInText text="Browse Classes" />
          <p className="text-muted-foreground">Book your next workout session.</p>
        </div>
      </div>
      <DataTable data={classes} columns={columns} searchPlaceholder="Search available classes..." />
    </div>
  )
}

"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/tables/data-table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { api } from "@/lib/api-client"
import { getInitials } from "@/lib/utils"
import { SlideInText } from "@/components/ui/slide-in-text"

export default function TrainersPage() {
  const [trainers, setTrainers] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const token = localStorage.getItem("token")
        const userStr = localStorage.getItem("user")
        if (!token || !userStr) return

        const user = JSON.parse(userStr)
        const data = await api.get("/trainers", {
          token,
          gymId: user.gym_id
        })
        setTrainers(data)
      } catch (err) {
        console.error("Failed to fetch trainers", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrainers()
  }, [])

  const columns: Column<any>[] = [
    { 
      header: "Trainer", 
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={row.user?.avatar} />
            <AvatarFallback>{getInitials(row.user?.name || "??")}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{row.user?.name}</div>
            <div className="text-xs text-muted-foreground">{row.user?.email}</div>
          </div>
        </div>
      )
    },
    { header: "Specialization", cell: (row) => <Badge variant="secondary">{row.specialization}</Badge> },
    { header: "Rating", cell: (row) => <span className="font-medium text-warning flex items-center">★ {row.rating || 0}</span> },
    { header: "Status", cell: (row) => <Badge variant={row.status === "Active" ? "success" : "secondary"}>{row.status}</Badge> },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SlideInText text="Trainers Directory" />
          <p className="text-muted-foreground">Manage gym trainers, assign specializations, and track performance.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Trainer
        </Button>
      </div>
      <DataTable data={trainers} columns={columns} searchPlaceholder="Search trainers..." />
    </div>
  )
}

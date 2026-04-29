"use client"

import * as React from "react"
import { DataTable, type Column } from "@/components/tables/data-table"
import { api } from "@/lib/api-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { SlideInText } from "@/components/ui/slide-in-text"

export default function TrainerClientsPage() {
  const [clients, setClients] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token")
        const userStr = localStorage.getItem("user")
        if (!token || !userStr) return

        const user = JSON.parse(userStr)
        const data = await api.get("/members", {
          token,
          gymId: user.gym_id
        })
        setClients(data)
      } catch (err) {
        console.error("Failed to fetch clients", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchClients()
  }, [])

  const columns: Column<any>[] = [
    { 
      header: "Client", 
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={row.user?.avatar} />
            <AvatarFallback>{getInitials(row.user?.name || "??")}</AvatarFallback>
          </Avatar>
          <div className="font-medium">{row.user?.name}</div>
        </div>
      )
    },
    { header: "Membership", cell: (row) => row.membership_type || "Standard" },
    { header: "Status", cell: (row) => row.status || "Active" },
    { header: "", cell: () => <Button variant="outline" size="sm">View Progress</Button> },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SlideInText text="My Clients" />
          <p className="text-muted-foreground">Monitor progress and assign plans to your clients.</p>
        </div>
      </div>
      <DataTable data={clients} columns={columns} searchPlaceholder="Search clients..." />
    </div>
  )
}

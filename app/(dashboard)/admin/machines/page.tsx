"use client"

import * as React from "react"
import { Plus, Settings2, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/tables/data-table"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api-client"
import Link from "next/link"
import { SlideInText } from "@/components/ui/slide-in-text"

export default function MachineInventoryPage() {
  const [machines, setMachines] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchMachines = async () => {
      try {
        const token = localStorage.getItem("token")
        const userStr = localStorage.getItem("user")
        if (!token || !userStr) return

        const user = JSON.parse(userStr)
        const data = await api.get("/machines", {
          token,
          gymId: user.gym_id
        })
        setMachines(data)
      } catch (err) {
        console.error("Failed to fetch machines", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMachines()
  }, [])

  const columns: Column<any>[] = [
    { header: "ID", cell: (row) => <span className="text-[10px] font-mono opacity-50 uppercase">{row._id.substring(0, 8)}...</span> },
    { header: "Machine Name", cell: (row) => <span className="font-semibold">{row.name}</span> },
    { header: "Type", cell: (row) => <Badge variant="secondary">{row.type}</Badge> },
    { header: "Last Service", cell: (row) => row.last_maintenance || "Never" },
    { header: "Status", cell: (row) => (
      <Badge variant={row.status === "Active" ? "success" : row.status === "Maintenance" ? "warning" : "destructive"}>
        {row.status}
      </Badge>
    )},
    { header: "Actions", cell: () => <Button variant="ghost" size="sm">Edit</Button> },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SlideInText text="Gym Machines Inventory" />
          <p className="text-muted-foreground">Manage your branch's equipment, track inventory, and status.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/machines/health">
            <Button variant="outline" className="gap-2">
              <Activity className="h-4 w-4" /> Health Dashboard
            </Button>
          </Link>
          <Link href="/admin/machines/directory">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add from Directory
            </Button>
          </Link>
        </div>
      </div>
      
      <DataTable data={machines} columns={columns} searchPlaceholder="Search by machine ID or name..." />
    </div>
  )
}

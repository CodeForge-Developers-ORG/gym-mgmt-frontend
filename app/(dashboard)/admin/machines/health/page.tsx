"use client"

import * as React from "react"
import Image from "next/image"
import { AlertTriangle, Wrench, CheckCircle2, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable, type Column } from "@/components/tables/data-table"
import { Badge } from "@/components/ui/badge"
import { SlideInText } from "@/components/ui/slide-in-text"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api-client"
import { useToast } from "@/context/toast-context"
import { cn } from "@/lib/utils"

export default function MachineHealthPage() {
  const [machines, setMachines] = React.useState<any[]>([])
  const [stats, setStats] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const toast = useToast()

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [machineData, statsData] = await Promise.all([
        api.get("/machines"),
        api.get("/machines/health-stats")
      ])
      setMachines(Array.isArray(machineData) ? machineData : [])
      setStats(statsData)
    } catch (err: any) {
      toast.error("Error", "Failed to fetch machine health data.")
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData()
  }, [])

  const columns: Column<any>[] = [
    { header: "Machine ID", cell: (row) => <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded">{(row._id || row.id).substring(0, 8)}</code> },
    { header: "Machine Name", cell: (row) => <span className="font-semibold">{row.name}</span> },
    { header: "Category", accessorKey: "type" },
    { header: "Last Service", cell: (row) => row.last_maintenance || "Never" },
    { header: "Status", cell: (row) => (
      <Badge variant={row.status === "Healthy" ? "success" : row.status === "Maintenance" ? "warning" : "destructive"} className="text-[10px] uppercase">
        {row.status}
      </Badge>
    )},
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SlideInText text="Equipment Health" />
          <p className="text-sm text-muted-foreground mt-0.5">Monitor branch machine status and maintenance schedules.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
          <div className="hidden sm:block bg-muted/20 p-2 rounded-full border border-border/50">
            <Image src="/vector_icons/health/3d Health(14).png" alt="Service Bot" width={60} height={60} className="drop-shadow-sm" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-success/50 bg-success/5 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Healthy Units</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-success tracking-tight">{stats?.healthy ?? 0}</div>
            <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-tighter">
              {stats?.healthy_percentage ?? 100}% of total inventory
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-warning/50 bg-warning/5 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Under Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-warning tracking-tight">{stats?.maintenance ?? 0}</div>
            <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-tighter">Requires routine checkup</p>
          </CardContent>
        </Card>
        
        <Card className="border-destructive/50 bg-destructive/5 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Broken / Offline</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-destructive tracking-tight">{stats?.broken ?? 0}</div>
            <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-tighter">Immediate attention required</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold tracking-tight">Machine Inventory</h3>
          <Badge variant="outline" className="text-[10px] uppercase">{machines.length} Total Units</Badge>
        </div>
        <DataTable data={machines} columns={columns} searchPlaceholder="Search equipment..." isLoading={isLoading} />
      </div>
    </div>
  )
}

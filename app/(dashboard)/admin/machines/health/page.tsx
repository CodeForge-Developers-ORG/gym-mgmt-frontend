"use client"

import * as React from "react"
import Image from "next/image"
import { AlertTriangle, Wrench, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable, type Column } from "@/components/tables/data-table"
import { Badge } from "@/components/ui/badge"
import { SlideInText } from "@/components/ui/slide-in-text"

export default function MachineHealthPage() {
  const serviceLogs = [
    { id: "LOG-001", machineId: "MCH-002", machineName: "Pro Treadmill Series 8", issue: "Belt slipping", status: "In Progress", technician: "Mike Fixer", date: "2026-04-20" },
    { id: "LOG-002", machineId: "MCH-005", machineName: "Elliptical Trainer X", issue: "Screen dead", status: "Pending Parts", technician: "Unassigned", date: "2026-04-22" },
    { id: "LOG-003", machineId: "MCH-003", machineName: "Olympic Squat Rack", issue: "Routine tightening", status: "Completed", technician: "Sarah Tools", date: "2026-04-10" },
  ]

  const columns: Column<any>[] = [
    { header: "Ticket ID", accessorKey: "id" },
    { header: "Machine", cell: (row) => <span className="font-semibold">{row.machineName}</span> },
    { header: "Reported Issue", accessorKey: "issue" },
    { header: "Technician", accessorKey: "technician" },
    { header: "Date Logged", accessorKey: "date" },
    { header: "Status", cell: (row) => (
      <Badge variant={row.status === "Completed" ? "success" : row.status === "Pending Parts" ? "destructive" : "warning"}>
        {row.status}
      </Badge>
    )},
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SlideInText text="Machine Service & Health" />
          <p className="text-muted-foreground">Monitor equipment health and maintenance tickets.</p>
        </div>
        <div className="hidden sm:block bg-muted/20 p-2 rounded-full border border-border/50">
          <Image src="/vector_icons/health/3d Health(14).png" alt="Service Bot" width={60} height={60} className="drop-shadow-sm" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-success/50 bg-success/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Healthy Machines</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">42</div>
            <p className="text-xs text-muted-foreground mt-1">93% of total inventory</p>
          </CardContent>
        </Card>
        <Card className="border-warning/50 bg-warning/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Routine Service Due</CardTitle>
            <Wrench className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">2</div>
            <p className="text-xs text-muted-foreground mt-1">Scheduled for next week</p>
          </CardContent>
        </Card>
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Out of Order</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">1</div>
            <p className="text-xs text-muted-foreground mt-1">Requires immediate attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-bold tracking-tight mb-4">Active Service Logs</h3>
        <DataTable data={serviceLogs} columns={columns} searchPlaceholder="Search tickets..." />
      </div>
    </div>
  )
}

"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/tables/data-table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import { SlideInText } from "@/components/ui/slide-in-text"

export default function AdminsPage() {
  const [admins, setAdmins] = React.useState<any[]>([])
  const columns: Column<any>[] = [
    { 
      header: "Administrator", 
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={row.avatar} />
            <AvatarFallback>{getInitials(row.fullName)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{row.fullName}</div>
            <div className="text-xs text-muted-foreground">{row.email}</div>
          </div>
        </div>
      )
    },
    { header: "Role", cell: (row) => <Badge variant="outline">{row.role}</Badge> },
    { header: "Status", cell: (row) => <Badge variant="success">{row.status}</Badge> },
    { header: "Phone", accessorKey: "phone" },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SlideInText text="Platform Admins" />
          <p className="text-muted-foreground">Manage system administrators and their access levels.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Invite Admin
        </Button>
      </div>
      <DataTable data={admins} columns={columns} searchPlaceholder="Search admins..." />
    </div>
  )
}

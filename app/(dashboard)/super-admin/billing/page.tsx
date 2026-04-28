"use client"

import * as React from "react"
import { Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/tables/data-table"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { SlideInText } from "@/components/ui/slide-in-text"

export default function BillingPage() {
  const [invoices, setInvoices] = React.useState<any[]>([])

  const columns: Column<any>[] = [
    { header: "Invoice ID", accessorKey: "id" },
    { header: "Gym Branch", accessorKey: "gym" },
    { header: "Amount", cell: (row) => <span className="font-medium">{formatCurrency(row.amount)}</span> },
    { header: "Status", cell: (row) => <Badge variant={row.status === "Paid" ? "success" : "warning"}>{row.status}</Badge> },
    { header: "Date", cell: (row) => formatDate(row.date) },
    { header: "", cell: () => <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button> },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SlideInText text="Billing & Invoices" />
          <p className="text-muted-foreground">View and download transaction history across all branches.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <FileText className="h-4 w-4" /> Export All
        </Button>
      </div>
      <DataTable data={invoices} columns={columns} searchPlaceholder="Search invoices..." />
    </div>
  )
}

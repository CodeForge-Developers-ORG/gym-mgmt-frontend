"use client"

import * as React from "react"
import { Download, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/tables/data-table"
import { api } from "@/lib/api-client"
import { formatCurrency, formatDate, getInitials } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SlideInText } from "@/components/ui/slide-in-text"

export default function PaymentsPage() {
  const [payments, setPayments] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token")
        const userStr = localStorage.getItem("user")
        if (!token || !userStr) return

        const user = JSON.parse(userStr)
        const data = await api.get("/payments/history", {
          token,
          gymId: user.gym_id
        })
        setPayments(data)
      } catch (err) {
        console.error("Failed to fetch payments", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPayments()
  }, [])

  const columns: Column<any>[] = [
    { header: "Transaction ID", accessorKey: "transaction_id" },
    { 
      header: "Member", 
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.user?.avatar} />
            <AvatarFallback>{getInitials(row.user?.name || "??")}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{row.user?.name}</span>
        </div>
      ) 
    },
    { header: "Amount", cell: (row) => <span className="font-medium">{formatCurrency(row.amount)} {row.currency}</span> },
    { header: "Method", accessorKey: "payment_method" },
    { header: "Status", cell: (row) => <Badge variant={row.status === "Successful" || row.status === "paid" ? "success" : "destructive"}>{row.status}</Badge> },
    { header: "Date", cell: (row) => formatDate(row.date) },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SlideInText text="Payments & Revenue" />
          <p className="text-muted-foreground">Track member payments, subscriptions, and POS transactions.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" /> Export Ledger
        </Button>
      </div>
      <DataTable data={payments} columns={columns} searchPlaceholder="Search transactions..." />
    </div>
  )
}

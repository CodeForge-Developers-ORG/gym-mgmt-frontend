"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/tables/data-table"
import { api } from "@/lib/api-client"
import { formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { SlideInText } from "@/components/ui/slide-in-text"

export default function SubscriptionsPage() {
  const [plans, setPlans] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        const data = await api.get("/subscriptions/plans", { token })
        setPlans(data)
      } catch (err) {
        console.error("Failed to fetch plans", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlans()
  }, [])

  const columns: Column<any>[] = [
    { header: "Plan Name", accessorKey: "name" },
    { header: "Price", cell: (row) => <span className="font-medium">{formatCurrency(row.price)}</span> },
    { header: "Billing Cycle", accessorKey: "billing_cycle" },
    { header: "Features", cell: (row) => (
      <div className="flex gap-1 flex-wrap">
        {Array.isArray(row.features) ? row.features.map((f: string, i: number) => (
          <Badge key={i} variant="secondary" className="text-[10px]">{f}</Badge>
        )) : row.features}
      </div>
    )},
    { header: "Status", cell: () => <Badge variant="success">Active</Badge> },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SlideInText text="Subscription Plans" />
          <p className="text-muted-foreground">Manage your pricing tiers and plan features.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Create Plan
        </Button>
      </div>
      <DataTable data={plans} columns={columns} searchPlaceholder="Search plans..." />
    </div>
  )
}

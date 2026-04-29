"use client"

import * as React from "react"
import { Plus, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable, type Column } from "@/components/tables/data-table"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api-client"
import { formatDate } from "@/lib/utils"
import { SlideInText } from "@/components/ui/slide-in-text"

export default function GymsPage() {
  const [gyms, setGyms] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [formLoading, setFormLoading] = React.useState(false)

  const fetchGyms = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const data = await api.get("/super-admin/gyms", { token })
      setGyms(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Failed to fetch gyms", err)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchGyms()
  }, [])

  async function handleAddGym(e: React.FormEvent) {
    e.preventDefault()
    setFormLoading(true)
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    try {
      const token = localStorage.getItem("token")
      if (!token) return

      await api.post("/super-admin/gyms", {
        name: formData.get("name"),
        address: formData.get("address"),
        phone: formData.get("phone"),
        email: formData.get("email"),
      }, { token })

      setDialogOpen(false)
      form.reset()
      fetchGyms()
    } catch (err) {
      console.error("Failed to add gym", err)
    } finally {
      setFormLoading(false)
    }
  }

  const columns: Column<any>[] = [
    {
      header: "Gym Tenant",
      cell: (row) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-xs text-muted-foreground">{row.address}</div>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (row) => (
        <Badge variant={row.status === "Active" ? "success" : row.status === "Maintenance" ? "warning" : "destructive"}>
          {row.status || "Active"}
        </Badge>
      ),
    },
    {
      header: "Tenant ID",
      cell: (row) => <span className="font-mono text-[10px] opacity-50">{row._id ? row._id.substring(0, 8) : "-"}</span>,
    },
    {
      header: "Created",
      cell: (row) => <div className="text-sm text-muted-foreground">{row.created_at ? formatDate(row.created_at) : "-"}</div>,
    },
    {
      header: "",
      cell: () => (
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SlideInText text="Gym Tenants" />
          <p className="text-muted-foreground">Manage all gym tenants, view performance and configure settings.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <form onSubmit={handleAddGym}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Gym Tenant
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Add New Gym Tenant</DialogTitle>
                <DialogDescription>
                  Register a new gym tenant on the platform.
                </DialogDescription>
              </DialogHeader>
              <FieldGroup>
                <Field>
                  <Label htmlFor="gym-name">Gym Name</Label>
                  <Input id="gym-name" name="name" placeholder="e.g. PowerFit Downtown" required />
                </Field>
                <Field>
                  <Label htmlFor="gym-address">Address</Label>
                  <Input id="gym-address" name="address" placeholder="123 Main Street, City" required />
                </Field>
                <Field>
                  <Label htmlFor="gym-phone">Phone</Label>
                  <Input id="gym-phone" name="phone" placeholder="+1 234 567 890" />
                </Field>
                <Field>
                  <Label htmlFor="gym-email">Email</Label>
                  <Input id="gym-email" name="email" type="email" placeholder="contact@gym.com" />
                </Field>
              </FieldGroup>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? "Creating..." : "Create Tenant"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>

      <DataTable 
        data={gyms} 
        columns={columns} 
        searchPlaceholder="Search gym tenants..." 
      />
    </div>
  )
}

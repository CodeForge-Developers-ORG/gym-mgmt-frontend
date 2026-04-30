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
import { useToast } from "@/context/toast-context"
import { ActionMenu, type ActionMenuItem } from "@/components/ui/action-menu"
import { 
  Delete01Icon, 
  ViewOffIcon, 
  Link01Icon,
  CheckmarkCircle01Icon,
  SettingsIcon
} from "@hugeicons/core-free-icons"
import { ConfirmModal } from "@/components/ui/confirm-modal"

export default function GymsPage() {
  const [gyms, setGyms] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [formLoading, setFormLoading] = React.useState(false)
  const [passwordDialogOpen, setPasswordDialogOpen] = React.useState(false)
  const [selectedGymForPassword, setSelectedGymForPassword] = React.useState<any>(null)
  const [confirmConfig, setConfirmConfig] = React.useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant?: "default" | "destructive";
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
  })
  const toast = useToast()

  const fetchGyms = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const data = await api.get("/super-admin/gyms", { token })
      setGyms(Array.isArray(data) ? data : [])
    } catch (err: any) {
      toast.error("Fetch Failed", err.message || "Failed to fetch gyms.")
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

    const loadingId = toast.loading("Adding Gym", "Registering new gym tenant...")

    try {
      const token = localStorage.getItem("token")
      if (!token) return

      await api.post("/super-admin/gyms", {
        name: formData.get("name"),
        address: formData.get("address"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        password: formData.get("password"),
      })

      toast.removeNotification(loadingId)
      toast.success("Gym Added", "Gym and Administrator account created successfully.")
      
      setDialogOpen(false)
      form.reset()
      fetchGyms()
    } catch (err: any) {
      toast.removeNotification(loadingId)
      toast.error("Creation Failed", err.message || "Failed to add gym.")
    } finally {
      setFormLoading(false)
    }
  }

  async function handleAction(gymId: string, actionId: string) {
    const gym = gyms.find(g => g._id === gymId || g.id === gymId)
    if (!gym) return

    const token = localStorage.getItem("token")
    if (!token) return

    switch (actionId) {
      case "delete":
        setConfirmConfig({
          open: true,
          title: "Delete Gym Branch?",
          description: `Are you sure you want to delete ${gym.name}? This action cannot be undone and will remove all associated data.`,
          variant: "destructive",
          onConfirm: async () => {
            const delLoading = toast.loading("Deleting Gym", `Removing ${gym.name}...`)
            try {
              await api.delete(`/super-admin/gyms/${gymId}`, { token })
              toast.removeNotification(delLoading)
              toast.success("Gym Deleted", "Branch has been removed successfully.")
              fetchGyms()
            } catch (err: any) {
              toast.removeNotification(delLoading)
              toast.error("Delete Failed", err.message || "Failed to delete gym.")
            }
          }
        })
        break

      case "toggle-status":
        const newStatus = gym.status === "Active" ? "Inactive" : "Active"
        const statusLoading = toast.loading("Updating Status", `Setting ${gym.name} to ${newStatus}...`)
        try {
          await api.put(`/super-admin/gyms/${gymId}`, { status: newStatus }, { token })
          toast.removeNotification(statusLoading)
          toast.success("Status Updated", `${gym.name} is now ${newStatus}.`)
          fetchGyms()
        } catch (err: any) {
          toast.removeNotification(statusLoading)
          toast.error("Update Failed", err.message || "Failed to update status.")
        }
        break

      case "map":
        toast.info("Map Subscriptions", "Mapping interface coming soon.")
        break

      case "password":
        setSelectedGymForPassword(gym)
        setPasswordDialogOpen(true)
        break
    }
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedGymForPassword) return
    
    setFormLoading(true)
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const password = formData.get("password") as string

    const loadingId = toast.loading("Updating Password", "Setting new administrator password...")

    try {
      await api.put(`/super-admin/gyms/${selectedGymForPassword._id || selectedGymForPassword.id}/admin-password`, { password })
      toast.removeNotification(loadingId)
      toast.success("Password Updated", "Administrator password has been changed.")
      setPasswordDialogOpen(false)
      form.reset()
    } catch (err: any) {
      toast.removeNotification(loadingId)
      toast.error("Update Failed", err.message || "Failed to update password.")
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
      cell: (row) => <span className="font-mono text-[10px] font-bold text-primary">{row.tenant_id || "-"}</span>,
    },
    {
      header: "Created",
      cell: (row) => <div className="text-sm text-muted-foreground">{row.created_at ? formatDate(row.created_at) : "-"}</div>,
    },
    {
      header: "Actions",
      cell: (row) => {
        const menuItems: ActionMenuItem[] = [
          { id: "map", label: "Map Subscriptions", icon: Link01Icon },
          { id: "password", label: "Change Admin Password", icon: SettingsIcon },
          { 
            id: "toggle-status", 
            label: row.status === "Active" ? "Mark Inactive" : "Mark Active", 
            icon: row.status === "Active" ? ViewOffIcon : CheckmarkCircle01Icon 
          },
          { id: "delete", label: "Delete Gym", icon: Delete01Icon, variant: "destructive" },
        ]
        return <ActionMenu items={menuItems} onAction={(id) => handleAction(row._id || row.id, id)} />
      },
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
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Gym Tenant
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <form onSubmit={handleAddGym}>
              <DialogHeader>
                <DialogTitle>Add New Gym Tenant</DialogTitle>
                <DialogDescription>
                  Register a new gym tenant on the platform.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
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
                    <Label htmlFor="gym-email">Email (Admin Account)</Label>
                    <Input id="gym-email" name="email" type="email" placeholder="contact@gym.com" required />
                  </Field>
                  <Field>
                    <Label htmlFor="gym-password">Admin Password</Label>
                    <Input id="gym-password" name="password" type="password" placeholder="••••••••" required minLength={6} />
                  </Field>
                </FieldGroup>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? "Creating..." : "Create Tenant"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable 
        data={gyms} 
        columns={columns} 
        searchPlaceholder="Search gym tenants..." 
      />

      <ConfirmModal
        open={confirmConfig.open}
        onOpenChange={(open) => setConfirmConfig(prev => ({ ...prev, open }))}
        title={confirmConfig.title}
        description={confirmConfig.description}
        onConfirm={confirmConfig.onConfirm}
        variant={confirmConfig.variant}
        confirmText={confirmConfig.variant === "destructive" ? "Delete Branch" : "Confirm"}
      />

      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <form onSubmit={handleUpdatePassword}>
            <DialogHeader>
              <DialogTitle>Update Admin Password</DialogTitle>
              <DialogDescription>
                Change the login password for {selectedGymForPassword?.name}&apos;s administrator.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Field>
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" name="password" type="password" placeholder="••••••••" required minLength={6} />
              </Field>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? "Updating..." : "Update Password"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

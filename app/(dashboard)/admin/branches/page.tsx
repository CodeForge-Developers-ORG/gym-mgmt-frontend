"use client"

import * as React from "react"
import { Plus, Building2, MapPin, Phone, Users, MoreHorizontal } from "lucide-react"
import { useBranch, type Branch } from "@/context/branch-context"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/tables/data-table"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api-client"
import { useToast } from "@/context/toast-context"
import { SlideInText } from "@/components/ui/slide-in-text"
import { ActionMenu } from "@/components/ui/action-menu"
import { cn } from "@/lib/utils"
import { Settings as SettingsIcon, Trash2 as Delete01Icon, Building2 as BuildingIcon, MapPin as Location01Icon, Phone as CallIcon, BarChart3 as ChartBar01Icon, Users as UserMultiple01Icon, User as UserIcon } from "lucide-react"

export default function BranchesPage() {
  const { branches, stats, isLoading, refreshBranches } = useBranch()
  const [isAdding, setIsAdding] = React.useState(false)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const toast = useToast()

  const handleAddBranch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAdding(true)
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    try {
      await api.post("/branches", {
        name: formData.get("name"),
        location: formData.get("location"),
        address: formData.get("address"),
        phone: formData.get("phone"),
        email: formData.get("email"),
      })
      toast.success("Branch Created", "New location added successfully.")
      setDialogOpen(false)
      refreshBranches()
    } catch (err: any) {
      toast.error("Failed", err.message || "Error creating branch.")
    } finally {
      setIsAdding(false)
    }
  }

  const columns: Column<Branch>[] = [
    {
      header: "Branch Name",
      accessorKey: "name",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BuildingIcon className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm">{row.name}</span>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Active Branch</span>
          </div>
        </div>
      )
    },
    {
      header: "Location",
      accessorKey: "location",
      cell: (row) => (
        <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
          <Location01Icon className="h-4 w-4 text-primary" />
          {row.location}
        </div>
      )
    },
    {
      header: "Contact",
      cell: (row: any) => (
        <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-bold uppercase">
          <CallIcon className="h-3 w-3" />
          {row.phone || "No Contact"}
        </div>
      )
    },
    {
      header: "Capacity",
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <UserMultiple01Icon className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-tight">
            {row.members_count || 0} Members
          </span>
        </div>
      )
    },
    {
      header: "Status",
      cell: (row: any) => (
        <Badge 
          variant="outline" 
          className={cn(
            "border-success/20",
            row.status === "Active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
          )}
        >
          {row.status || "Active"}
        </Badge>
      )
    },
    {
      header: "Actions",
      cell: (row) => (
        <ActionMenu 
          items={[
            { id: "edit", label: "Edit Branch", icon: SettingsIcon },
            { id: "delete", label: "Delete", icon: Delete01Icon, variant: "destructive" },
          ]} 
          onAction={(id) => {
            toast.info("Coming Soon", "This feature is being finalized.")
          }} 
        />
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SlideInText text="Gym Branches" />
          <p className="text-sm text-muted-foreground mt-0.5">Manage your multiple gym locations and view branch-specific data.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="font-bold gap-2 shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4" />
              Add New Branch
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleAddBranch}>
              <DialogHeader>
                <DialogTitle>Add Gym Branch</DialogTitle>
                <DialogDescription>
                  Register a new gym location under your management.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Branch Name</Label>
                  <Input id="name" name="name" placeholder="Downtown Fitness" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Area/City</Label>
                  <Input id="location" name="location" placeholder="Downtown" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Branch Email</Label>
                  <Input id="email" name="email" type="email" placeholder="downtown@gym.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Contact Number</Label>
                  <Input id="phone" name="phone" placeholder="+1 (555) 000-0000" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isAdding}>
                  {isAdding ? "Adding..." : "Register Branch"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Branches */}
        <div className="group relative overflow-hidden bg-card p-5 rounded-3xl border shadow-sm transition-all hover:shadow-md">
          <div className="absolute -right-4 -top-4 text-indigo-500/5 transition-transform group-hover:scale-110 group-hover:rotate-12">
            <BuildingIcon className="h-24 w-24" />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 shadow-sm">
              <BuildingIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Total Branches</div>
              <div className="text-2xl font-black tracking-tight">{branches.length}</div>
            </div>
          </div>
        </div>

        {/* Total Staff */}
        <div className="group relative overflow-hidden bg-card p-5 rounded-3xl border shadow-sm transition-all hover:shadow-md">
          <div className="absolute -right-4 -top-4 text-orange-500/5 transition-transform group-hover:scale-110 group-hover:rotate-12">
            <UserIcon className="h-24 w-24" />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 shadow-sm">
              <UserIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Total Staff</div>
              <div className="text-2xl font-black tracking-tight">
                {stats?.total_staff || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Active Members */}
        <div className="group relative overflow-hidden bg-card p-5 rounded-3xl border shadow-sm transition-all hover:shadow-md">
          <div className="absolute -right-4 -top-4 text-emerald-500/5 transition-transform group-hover:scale-110 group-hover:rotate-12">
            <ChartBar01Icon className="h-24 w-24" />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 shadow-sm">
              <ChartBar01Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Active Members</div>
              <div className="text-2xl font-black tracking-tight">
                {stats?.total_members || 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      <DataTable 
        data={branches} 
        columns={columns} 
        isLoading={isLoading} 
        searchPlaceholder="Search branches..." 
      />
    </div>
  )
}

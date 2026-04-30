"use client"

import * as React from "react"
import { Plus, MoreHorizontal, UserPlus, Search, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DataTable, type Column } from "@/components/tables/data-table"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api-client"
import { getInitials, formatDate, cn } from "@/lib/utils"
import { SlideInText } from "@/components/ui/slide-in-text"
import { useToast } from "@/context/toast-context"
import { ActionMenu, type ActionMenuItem } from "@/components/ui/action-menu"
import { Delete01Icon, SettingsIcon, UserIcon } from "@hugeicons/core-free-icons"
import { ConfirmModal } from "@/components/ui/confirm-modal"

export default function MembersPage() {
  const [members, setMembers] = React.useState<any[]>([])
  const [plans, setPlans] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [formLoading, setFormLoading] = React.useState(false)
  const [confirmConfig, setConfirmConfig] = React.useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
  })
  const toast = useToast()
  
  const fetchMembers = async () => {
    setIsLoading(true)
    try {
      const [membersData, plansData] = await Promise.all([
        api.get("/members"),
        api.get("/plans")
      ])
      setMembers(Array.isArray(membersData) ? membersData : [])
      setPlans(Array.isArray(plansData) ? plansData : [])
    } catch (err: any) {
      toast.error("Error", "Failed to fetch members data.")
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchMembers()
  }, [])

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault()
    setFormLoading(true)
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const loadingId = toast.loading("Registering Member", "Creating account and membership details...")

    try {
      await api.post("/members", {
        first_name: formData.get("first_name"),
        last_name: formData.get("last_name"),
        email: formData.get("email"),
        password: formData.get("password") || "Member@123", // Default password if not provided
        membership_type: formData.get("plan"),
        status: "Active",
        join_date: new Date().toISOString().split('T')[0],
      })

      toast.removeNotification(loadingId)
      toast.success("Member Added", "Registration successful.")
      setDialogOpen(false)
      fetchMembers()
    } catch (err: any) {
      toast.removeNotification(loadingId)
      toast.error("Registration Failed", err.message)
    } finally {
      setFormLoading(false)
    }
  }

  async function handleDelete(id: string, name: string) {
    setConfirmConfig({
      open: true,
      title: "Terminate Membership?",
      description: `Are you sure you want to delete ${name}? This will remove their user account and gym access.`,
      onConfirm: async () => {
        const loading = toast.loading("Deleting", "Removing member...")
        try {
          await api.delete(`/members/${id}`)
          toast.removeNotification(loading)
          toast.success("Member Deleted")
          fetchMembers()
        } catch (err: any) {
          toast.removeNotification(loading)
          toast.error("Error", err.message)
        }
      }
    })
  }

  const columns: Column<any>[] = [
    {
      header: "Member",
      cell: (row) => {
        const name = row.user?.name || "Unknown Member"
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={row.user?.avatar} alt={name} />
              <AvatarFallback className="bg-primary/5 text-primary font-bold">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">{name}</span>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{row.user?.email}</span>
            </div>
          </div>
        )
      },
    },
    {
      header: "Membership Status",
      cell: (row) => (
        <Badge variant={row.status === "Active" ? "success" : "destructive"} className="text-[10px] uppercase">
          {row.status}
        </Badge>
      ),
    },
    {
      header: "Plan Type",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="text-xs font-medium">{row.membership_type}</span>
          <span className="text-[9px] text-muted-foreground uppercase font-bold">Joined {formatDate(row.join_date)}</span>
        </div>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <ActionMenu 
          items={[
            { id: "view", label: "View Profile", icon: UserIcon },
            { id: "edit", label: "Edit Member", icon: SettingsIcon },
            { id: "delete", label: "Delete", icon: Delete01Icon, variant: "destructive" },
          ]} 
          onAction={(id) => {
            if (id === "delete") handleDelete(row._id || row.id, row.user?.name)
            else toast.info("Coming Soon", "This feature is being finalized.")
          }} 
        />
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SlideInText text="Members Directory" />
          <p className="text-sm text-muted-foreground mt-0.5">Comprehensive list of all registered branch members.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchMembers} disabled={isLoading}>
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add New Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <form onSubmit={handleAddMember}>
                <DialogHeader>
                  <DialogTitle>Register Member</DialogTitle>
                  <DialogDescription>
                    Create a new user account and gym membership.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <FieldGroup>
                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <Label>First Name</Label>
                        <Input name="first_name" placeholder="John" required />
                      </Field>
                      <Field>
                        <Label>Last Name</Label>
                        <Input name="last_name" placeholder="Doe" required />
                      </Field>
                    </div>
                    <Field>
                      <Label>Email Address</Label>
                      <Input name="email" type="email" placeholder="john.doe@example.com" required />
                    </Field>
                    <Field>
                      <Label>Temporary Password</Label>
                      <Input name="password" type="password" placeholder="••••••••" minLength={6} />
                      <p className="text-[10px] text-muted-foreground">Defaults to Member@123 if empty</p>
                    </Field>
                    <Field>
                      <Label>Membership Plan</Label>
                      <select name="plan" className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30">
                        {plans.length > 0 ? (
                          plans.map(plan => (
                            <option key={plan._id || plan.id} value={plan.name}>
                              {plan.name} (${plan.monthly_price}/mo)
                            </option>
                          ))
                        ) : (
                          <option value="">No plans available</option>
                        )}
                      </select>
                    </Field>
                  </FieldGroup>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={formLoading}>
                    {formLoading ? "Registering..." : "Complete Registration"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <DataTable 
        data={members} 
        columns={columns} 
        searchPlaceholder="Search by name or email..." 
        isLoading={isLoading}
      />

      <ConfirmModal 
        open={confirmConfig.open}
        onOpenChange={(open) => setConfirmConfig(prev => ({ ...prev, open }))}
        title={confirmConfig.title}
        description={confirmConfig.description}
        onConfirm={confirmConfig.onConfirm}
        variant="destructive"
      />
    </div>
  )
}

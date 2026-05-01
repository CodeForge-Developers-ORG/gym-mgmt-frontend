"use client"

import * as React from "react"
import { Plus, UserPlus, RefreshCw, Star, Trash2, Edit, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/tables/data-table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api-client"
import { getInitials, cn } from "@/lib/utils"
import { SlideInText } from "@/components/ui/slide-in-text"
import { useToast } from "@/context/toast-context"
import { ActionMenu } from "@/components/ui/action-menu"

import { ConfirmModal } from "@/components/ui/confirm-modal"

export default function TrainersPage() {
  const [trainers, setTrainers] = React.useState<any[]>([])
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

  const fetchTrainers = async () => {
    setIsLoading(true)
    try {
      const data = await api.get("/trainers")
      setTrainers(Array.isArray(data) ? data : [])
    } catch (err: any) {
      toast.error("Error", "Failed to fetch trainers.")
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchTrainers()
  }, [])

  async function handleAddTrainer(e: React.FormEvent) {
    e.preventDefault()
    setFormLoading(true)
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const loadingId = toast.loading("Adding Trainer", "Creating trainer account...")

    try {
      await api.post("/trainers", {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password") || "Trainer@123",
        specialization: formData.get("specialization"),
        status: "Active",
      })

      toast.removeNotification(loadingId)
      toast.success("Trainer Added")
      setDialogOpen(false)
      fetchTrainers()
    } catch (err: any) {
      toast.removeNotification(loadingId)
      toast.error("Failed", err.message)
    } finally {
      setFormLoading(false)
    }
  }

  async function handleDelete(id: string, name: string) {
    setConfirmConfig({
      open: true,
      title: "Remove Trainer?",
      description: `Are you sure you want to delete ${name}? This will remove their access to the gym portal.`,
      onConfirm: async () => {
        const loading = toast.loading("Deleting", "Removing trainer...")
        try {
          await api.delete(`/trainers/${id}`)
          toast.removeNotification(loading)
          toast.success("Trainer Removed")
          fetchTrainers()
        } catch (err: any) {
          toast.removeNotification(loading)
          toast.error("Error", err.message)
        }
      }
    })
  }

  const columns: Column<any>[] = [
    { 
      header: "Trainer", 
      cell: (row) => {
        const name = row.user?.name || "Unknown"
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border-2 border-primary/5">
              <AvatarImage src={row.user?.avatar} />
              <AvatarFallback className="bg-primary/5 text-primary font-bold">{getInitials(name)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-sm">{name}</div>
              <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{row.user?.email}</div>
            </div>
          </div>
        )
      }
    },
    { 
      header: "Specialization", 
      cell: (row) => <Badge variant="secondary" className="text-[10px] uppercase font-bold">{row.specialization}</Badge> 
    },
    { 
      header: "Performance", 
      cell: (row) => (
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold">{row.rating?.toFixed(1) || "0.0"}</span>
        </div>
      )
    },
    { 
      header: "Status", 
      cell: (row) => (
        <Badge variant={row.status === "Active" ? "success" : "outline"} className="text-[10px] uppercase">
          {row.status}
        </Badge>
      )
    },
    {
      header: "Actions",
      cell: (row) => (
        <ActionMenu 
          items={[
            { id: "view", label: "View Profile", icon: User },
            { id: "edit", label: "Edit Details", icon: Settings },
            { id: "delete", label: "Remove", icon: Trash2, variant: "destructive" },
          ]} 
          onAction={(id) => {
            if (id === "delete") handleDelete(row._id || row.id, row.user?.name)
            else toast.info("Coming Soon", "Management features are being finalized.")
          }} 
        />
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SlideInText text="Trainers Directory" />
          <p className="text-sm text-muted-foreground mt-0.5">Manage your branch trainers and their specializations.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchTrainers} disabled={isLoading}>
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Trainer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <form onSubmit={handleAddTrainer}>
                <DialogHeader>
                  <DialogTitle>Add New Trainer</DialogTitle>
                  <DialogDescription>Register a new certified trainer for this branch.</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <FieldGroup>
                    <Field>
                      <Label>Full Name</Label>
                      <Input name="name" placeholder="Trainer Name" required />
                    </Field>
                    <Field>
                      <Label>Email Address</Label>
                      <Input name="email" type="email" placeholder="trainer@gym.com" required />
                    </Field>
                    <Field>
                      <Label>Login Password</Label>
                      <Input name="password" type="password" placeholder="••••••••" minLength={6} />
                      <p className="text-[10px] text-muted-foreground">Defaults to Trainer@123 if empty</p>
                    </Field>
                    <Field>
                      <Label>Specialization</Label>
                      <select name="specialization" className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                        <option value="Bodybuilding">Bodybuilding</option>
                        <option value="Yoga & Pilates">Yoga & Pilates</option>
                        <option value="Cardio & HIIT">Cardio & HIIT</option>
                        <option value="Nutritionist">Nutritionist</option>
                        <option value="CrossFit">CrossFit</option>
                      </select>
                    </Field>
                  </FieldGroup>
                </div>
                <DialogFooter>
                  <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                  <Button type="submit" disabled={formLoading}>
                    {formLoading ? "Adding..." : "Add Trainer Account"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <DataTable data={trainers} columns={columns} searchPlaceholder="Search trainers..." isLoading={isLoading} />
      
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

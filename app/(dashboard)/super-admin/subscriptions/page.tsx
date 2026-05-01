"use client"

import * as React from "react"
import { Plus, Check, Shield, User, Activity, Search, RefreshCw, Layers, MoreHorizontal, Settings, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/tables/data-table"
import { api } from "@/lib/api-client"
import { formatCurrency, cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { SlideInText } from "@/components/ui/slide-in-text"
import { ActionMenu, type ActionMenuItem } from "@/components/ui/action-menu"
import { ConfirmModal } from "@/components/ui/confirm-modal"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/context/toast-context"

// Menu lists from sidebar.tsx (hardcoded here to avoid import issues or for simplicity in this specific admin view)
const ADMIN_MENU = [
  { title: "Dashboard", href: "/admin" },
  { title: "Gym Branches", href: "/admin/branches" },
  { title: "Members", href: "/admin/members" },
  { title: "Trainers", href: "/admin/trainers" },
  { title: "Classes", href: "/admin/classes" },
  { title: "Schedule", href: "/admin/schedule" },
  { title: "Machine Directory", href: "/admin/machines/directory" },
  { title: "Gym Machines", href: "/admin/machines" },
  { title: "Machine Health", href: "/admin/machines/health" },
  { title: "Exercises", href: "/admin/exercises" },
  { title: "Membership Plans", href: "/admin/plans" },
  { title: "Biometric Setup", href: "/admin/biometric-setup" },
  { title: "Payments", href: "/admin/payments" },
  { title: "Settings", href: "/admin/settings" },
];

const TRAINER_MENU = [
  { title: "Dashboard", href: "/trainer" },
  { title: "My Classes", href: "/trainer/classes" },
  { title: "Clients", href: "/trainer/clients" },
  { title: "Workout Plans", href: "/trainer/workouts" },
  { title: "Diet Calculator", href: "/trainer/diet-calculator" },
  { title: "Diet Plans", href: "/trainer/diet" },
  { title: "Ingredients DB", href: "/trainer/ingredients" },
  { title: "Diet Monitoring", href: "/trainer/diet-monitoring" },
  { title: "Profile", href: "/trainer/profile" },
];

const MEMBER_MENU = [
  { title: "Dashboard", href: "/customer" },
  { title: "Browse Classes", href: "/customer/classes" },
  { title: "My Progress", href: "/customer/progress" },
  { title: "Achievements", href: "/customer/achievements" },
  { title: "Workout Plan", href: "/customer/workout" },
  { title: "Diet Plan", href: "/customer/diet" },
  { title: "Membership", href: "/customer/membership" },
  { title: "Profile", href: "/customer/profile" },
];

export default function SubscriptionsPage() {
  const [plans, setPlans] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [selectedMenus, setSelectedMenus] = React.useState<string[]>([])
  const [activeTab, setActiveTab] = React.useState<"admin" | "trainer" | "member">("admin")
  const [editingPlan, setEditingPlan] = React.useState<any>(null)
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

  const fetchPlans = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await api.get("/super-admin/saas-plans")
      setPlans(data)
    } catch (err) {
      console.error("Failed to fetch plans", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchPlans()
  }, [fetchPlans])

  const toggleMenu = (href: string) => {
    setSelectedMenus(prev => 
      prev.includes(href) ? prev.filter(h => h !== href) : [...prev, href]
    )
  }

  const handleCreateOrUpdatePlan = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.target as HTMLFormElement)
    const data = {
      name: formData.get("name"),
      price_monthly: Number(formData.get("price_monthly")),
      price_yearly: Number(formData.get("price_yearly")),
      menu_permissions: selectedMenus,
      status: "Active"
    }

    try {
      if (editingPlan) {
        await api.put(`/super-admin/saas-plans/${editingPlan.id || editingPlan._id}`, data)
        toast.success("Success", "Subscription plan updated successfully.")
      } else {
        await api.post("/super-admin/saas-plans", data)
        toast.success("Success", "Subscription plan created successfully.")
      }
      setDialogOpen(false)
      setEditingPlan(null)
      setSelectedMenus([])
      fetchPlans()
    } catch (err: any) {
      toast.error("Error", err.message || "Failed to save plan")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (plan: any) => {
    setEditingPlan(plan)
    setSelectedMenus(plan.menu_permissions || [])
    setDialogOpen(true)
  }

  const handleDelete = (plan: any) => {
    setConfirmConfig({
      open: true,
      title: "Delete Plan?",
      description: `Are you sure you want to delete the ${plan.name} plan? This will affect gyms mapped to this plan.`,
      onConfirm: async () => {
        try {
          await api.delete(`/super-admin/saas-plans/${plan.id || plan._id}`)
          toast.success("Deleted", "Plan removed successfully.")
          fetchPlans()
        } catch (err: any) {
          toast.error("Error", err.message || "Failed to delete plan")
        }
      }
    })
  }

  const columns: Column<any>[] = [
    { 
      header: "Plan Name", 
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Layers className="h-4 w-4 text-primary" />
          </div>
          <span className="font-bold">{row.name}</span>
        </div>
      )
    },
    { 
      header: "Pricing", 
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-xs">{formatCurrency(row.price_monthly)}/mo</span>
          <span className="text-[10px] text-muted-foreground">{formatCurrency(row.price_yearly)}/yr</span>
        </div>
      )
    },
    { 
      header: "Permissions", 
      cell: (row) => {
        const allPossibleMenus = [...ADMIN_MENU, ...TRAINER_MENU, ...MEMBER_MENU]
        const allowed = allPossibleMenus.filter(m => row.menu_permissions?.includes(m.href))
        
        return (
          <div className="flex flex-wrap gap-1 max-w-[300px]">
            {allowed.slice(0, 3).map((m, i) => (
              <Badge key={i} variant="outline" className="text-[9px] px-1.5 py-0 border-primary/20 bg-primary/5 text-primary">
                {m.title}
              </Badge>
            ))}
            {allowed.length > 3 && (
              <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                +{allowed.length - 3} More
              </Badge>
            )}
            {allowed.length === 0 && <span className="text-[10px] text-muted-foreground italic">No Menus Selected</span>}
          </div>
        )
      }
    },
    { 
      header: "Status", 
      cell: (row) => (
        <Badge variant={row.status === "Active" ? "success" : "secondary"}>
          {row.status}
        </Badge>
      ) 
    },
    {
      header: "Actions",
      cell: (row) => (
        <ActionMenu 
          items={[
            { id: "edit", label: "Edit Plan", icon: Settings },
            { id: "delete", label: "Delete", icon: Trash2, variant: "destructive" },
          ]}
          onAction={(id) => {
            if (id === "edit") handleEdit(row)
            if (id === "delete") handleDelete(row)
          }}
        />
      )
    }
  ]

  const currentMenu = activeTab === "admin" ? ADMIN_MENU : activeTab === "trainer" ? TRAINER_MENU : MEMBER_MENU

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SlideInText text="Subscription Plans" />
          <p className="text-muted-foreground text-sm">Design pricing tiers and map sidebar menu access for each role.</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) {
            setEditingPlan(null)
            setSelectedMenus([])
          }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-lg shadow-primary/20" onClick={() => {
              setEditingPlan(null)
              setSelectedMenus([])
            }}>
              <Plus className="h-4 w-4" /> Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleCreateOrUpdatePlan}>
              <DialogHeader>
                <DialogTitle>{editingPlan ? "Edit Subscription Plan" : "New Subscription Plan"}</DialogTitle>
                <DialogDescription>
                  {editingPlan 
                    ? "Modify the features and pricing for this existing tier." 
                    : "Define a plan and select which features will be visible to the users."}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Plan Name</Label>
                    <Input id="name" name="name" defaultValue={editingPlan?.name} placeholder="Premium / Basic" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price_monthly">Monthly Price</Label>
                    <Input id="price_monthly" name="price_monthly" type="number" defaultValue={editingPlan?.price_monthly} placeholder="99.99" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price_yearly">Yearly Price</Label>
                    <Input id="price_yearly" name="price_yearly" type="number" defaultValue={editingPlan?.price_yearly} placeholder="999.99" required />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-3">
                      <Label className="text-base font-bold">Feature Permissions</Label>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-[10px] font-bold uppercase tracking-wider text-primary hover:text-primary hover:bg-primary/10"
                        onClick={() => {
                          const allHrefs = currentMenu.map(m => m.href)
                          const areAllSelected = allHrefs.every(h => selectedMenus.includes(h))
                          
                          if (areAllSelected) {
                            setSelectedMenus(prev => prev.filter(h => !allHrefs.includes(h)))
                          } else {
                            setSelectedMenus(prev => [...new Set([...prev, ...allHrefs])])
                          }
                        }}
                      >
                        {currentMenu.every(m => selectedMenus.includes(m.href)) ? "Deselect All" : "Select All"}
                      </Button>
                    </div>
                    <div className="flex bg-muted p-1 rounded-lg">
                      <button 
                        type="button"
                        onClick={() => setActiveTab("admin")}
                        className={cn("px-3 py-1 text-[10px] font-bold rounded-md transition-all", activeTab === "admin" ? "bg-white shadow-sm" : "text-muted-foreground")}
                      >
                        ADMIN
                      </button>
                      <button 
                        type="button"
                        onClick={() => setActiveTab("trainer")}
                        className={cn("px-3 py-1 text-[10px] font-bold rounded-md transition-all", activeTab === "trainer" ? "bg-white shadow-sm" : "text-muted-foreground")}
                      >
                        TRAINER
                      </button>
                      <button 
                        type="button"
                        onClick={() => setActiveTab("member")}
                        className={cn("px-3 py-1 text-[10px] font-bold rounded-md transition-all", activeTab === "member" ? "bg-white shadow-sm" : "text-muted-foreground")}
                      >
                        MEMBER
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2">
                    {currentMenu.map((menu) => (
                      <button
                        key={menu.href}
                        type="button"
                        onClick={() => toggleMenu(menu.href)}
                        className={cn(
                          "flex items-center justify-between p-2.5 rounded-xl border text-left transition-all",
                          selectedMenus.includes(menu.href) 
                            ? "border-primary bg-primary/5 text-primary" 
                            : "border-border hover:bg-muted"
                        )}
                      >
                        <span className="text-xs font-bold truncate">{menu.title}</span>
                        {selectedMenus.includes(menu.href) && <Check className="h-3 w-3" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : (editingPlan ? "Update Plan" : "Save Plan")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable 
        data={plans} 
        columns={columns} 
        searchPlaceholder="Search subscription plans..." 
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

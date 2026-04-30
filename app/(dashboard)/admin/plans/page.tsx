"use client"

import * as React from "react"
import { Plus, Receipt, Check, Trash2, Edit, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { api } from "@/lib/api-client"
import { useToast } from "@/context/toast-context"
import { SlideInText } from "@/components/ui/slide-in-text"
import { cn } from "@/lib/utils"

interface MembershipPlan {
  _id?: string;
  id?: string;
  name: string;
  monthly_price: number;
  yearly_price: number;
  features: string[];
  status: "Active" | "Inactive";
}

export default function PlansPage() {
  const [plans, setPlans] = React.useState<MembershipPlan[]>([])
  const [currency, setCurrency] = React.useState("$")
  const [isLoading, setIsLoading] = React.useState(true)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [newPlan, setNewPlan] = React.useState<Partial<MembershipPlan>>({
    name: "",
    monthly_price: 0,
    yearly_price: 0,
    features: [""],
    status: "Active"
  })
  const toast = useToast()
  
  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [plansData, gymData] = await Promise.all([
        api.get("/plans"),
        api.get("/gym/my-gym")
      ])
      setPlans(Array.isArray(plansData) ? plansData : [])
      
      // Map currency code to symbol
      const symbols: Record<string, string> = {
        USD: "$", EUR: "€", GBP: "£", INR: "₹", AED: "د.إ", SAR: "﷼", PKR: "Rs", BDT: "৳"
      }
      setCurrency(symbols[gymData.currency] || gymData.currency || "$")
    } catch (err) {
      toast.error("Error", "Failed to load data.")
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData()
  }, [])

  const addFeatureField = () => {
    setNewPlan({ ...newPlan, features: [...(newPlan.features || []), ""] })
  }

  const updateFeature = (index: number, value: string) => {
    const updatedFeatures = [...(newPlan.features || [])]
    updatedFeatures[index] = value
    setNewPlan({ ...newPlan, features: updatedFeatures })
  }

  const removeFeature = (index: number) => {
    const updatedFeatures = (newPlan.features || []).filter((_, i) => i !== index)
    setNewPlan({ ...newPlan, features: updatedFeatures })
  }

  const handleSave = async () => {
    if (!newPlan.name || !newPlan.monthly_price || !newPlan.yearly_price) {
      toast.error("Invalid Input", "Please fill in all required fields.")
      return
    }

    try {
      await api.post("/plans", {
        ...newPlan,
        features: (newPlan.features || []).filter(f => f.trim() !== "")
      })
      toast.success("Success", "Membership plan created.")
      setDialogOpen(false)
      fetchData()
      setNewPlan({ name: "", monthly_price: 0, yearly_price: 0, features: [""], status: "Active" })
    } catch (err) {
      toast.error("Error", "Failed to create plan.")
    }
  }

  const deletePlan = async (id: string) => {
    try {
      await api.delete(`/plans/${id}`)
      toast.success("Deleted", "Plan has been removed.")
      fetchData()
    } catch (err) {
      toast.error("Error", "Failed to delete plan.")
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SlideInText text="Membership Plans" />
          <p className="text-muted-foreground mt-0.5">Define your gym's membership tiers and features.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Membership Plan</DialogTitle>
              <DialogDescription>Add a new tier for your gym members.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Plan Name</Label>
                <Input id="name" placeholder="e.g. Platinum Plus" value={newPlan.name} onChange={e => setNewPlan({ ...newPlan, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="monthly">Monthly Price ({currency})</Label>
                  <Input id="monthly" type="number" value={newPlan.monthly_price} onChange={e => setNewPlan({ ...newPlan, monthly_price: Number(e.target.value) })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="yearly">Yearly Price ({currency})</Label>
                  <Input id="yearly" type="number" value={newPlan.yearly_price} onChange={e => setNewPlan({ ...newPlan, yearly_price: Number(e.target.value) })} />
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label>Features</Label>
                  <Button variant="ghost" size="sm" onClick={addFeatureField} className="h-7 text-[10px] font-bold uppercase tracking-widest text-primary">Add Feature</Button>
                </div>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                  {(newPlan.features || []).map((feature, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input placeholder="e.g. Free Personal Training" value={feature} onChange={e => updateFeature(idx, e.target.value)} />
                      <Button variant="ghost" size="icon" onClick={() => removeFeature(idx)} className="text-destructive shrink-0">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save Plan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-80 rounded-2xl border bg-muted/50 animate-pulse" />)}
        </div>
      ) : plans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan._id || plan.id} className="relative group overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant={plan.status === "Active" ? "success" : "outline"} className="text-[10px] uppercase font-bold tracking-widest">
                    {plan.status}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deletePlan(plan._id || plan.id!)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-2xl mt-2">{plan.name}</CardTitle>
                <CardDescription>Comprehensive gym access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black">{currency}{plan.monthly_price}</span>
                    <span className="text-sm text-muted-foreground font-medium">/ month</span>
                  </div>
                  <div className="text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded w-fit">
                    {currency}{plan.yearly_price} / year <span className="text-[10px] opacity-70">(Save {Math.round((1 - plan.yearly_price / (plan.monthly_price * 12)) * 100)}%)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Included Features</p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs font-medium">
                        <div className="bg-success/20 text-success rounded-full p-0.5">
                          <Check className="h-3 w-3" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  Edit Plan
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-3xl opacity-50">
          <Receipt className="h-12 w-12 mb-4" />
          <h3 className="text-lg font-bold">No Membership Plans</h3>
          <p className="text-sm max-w-[300px]">Create your first membership plan to start registering members.</p>
        </div>
      )}
    </div>
  )
}

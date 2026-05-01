"use client"

import * as React from "react"
import { Plus, MoreHorizontal, UserPlus, Search, RefreshCw, Fingerprint, Cpu } from "lucide-react"

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
import { Settings, Trash2, User } from "lucide-react"
import { ConfirmModal } from "@/components/ui/confirm-modal"
import { useBranch } from "@/context/branch-context"
import { DatePicker } from "@/components/ui/date-picker"

export default function MembersPage() {
  const { selectedBranch, branches } = useBranch()
  const [members, setMembers] = React.useState<any[]>([])
  const [plans, setPlans] = React.useState<any[]>([])
  const [biometricDevices, setBiometricDevices] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  
  // Date Picker States
  const [dob, setDob] = React.useState<Date | undefined>()
  const [joinDate, setJoinDate] = React.useState<Date | undefined>(new Date())
  const [expiryDate, setExpiryDate] = React.useState<Date | undefined>()

  // Filter members by selected branch (mock logic if data doesn't have branch_id yet)
  const filteredMembers = React.useMemo(() => {
    if (!selectedBranch) return members
    // For demo purposes, we filter by a mock branch logic or show all if it matches the first branch
    return members.filter((m: any) => !m.branch_id || m.branch_id === selectedBranch.id)
  }, [members, selectedBranch])
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
  
  const fetchMembers = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const [membersData, plansData, devicesData] = await Promise.all([
        api.get("/members"),
        api.get("/plans"),
        api.get("/biometrics/devices")
      ])
      setMembers(Array.isArray(membersData) ? membersData : [])
      setPlans(Array.isArray(plansData) ? plansData : [])
      setBiometricDevices(Array.isArray(devicesData) ? devicesData : [])
    } catch (err) {
      console.error("Failed to fetch members data:", err)
      toast.error("Error", "Failed to fetch members data.")
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  React.useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault()
    setFormLoading(true)
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const loadingId = toast.loading("Registering Member", "Creating account and membership details...")

    try {
      const payload = Object.fromEntries(formData.entries());
      await api.post("/members", {
        ...payload,
        status: "Active",
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

  async function handleEnroll(memberId: string) {
    if (biometricDevices.length === 0) {
      return toast.error("No Machines", "Please setup a biometric machine first.")
    }
    
    const loadingId = toast.loading("Enrolling", "Triggering enrollment on the default machine...")
    try {
      await api.post(`/members/${memberId}/enroll`, { 
        device_id: biometricDevices[0].id || biometricDevices[0]._id,
        type: 'face'
      })
      toast.success("Success", "Machine is now in enrollment mode. Please look at the camera.")
    } catch (err: any) {
      toast.error("Enrollment Failed", err.message)
    } finally {
      toast.removeNotification(loadingId)
    }
  }

  async function handlePush(memberId: string) {
    if (biometricDevices.length === 0) {
      return toast.error("No Machines", "Please setup a biometric machine first.")
    }

    const loadingId = toast.loading("Syncing", "Pushing user data to machine...")
    try {
      await api.post(`/members/${memberId}/push`, {
        device_id: biometricDevices[0].id || biometricDevices[0]._id
      })
      toast.success("Synced", "Member pushed to machine successfully.")
    } catch (err: any) {
      toast.error("Sync Failed", err.message)
    } finally {
      toast.removeNotification(loadingId)
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
            { id: "view", label: "View Profile", icon: User },
            { id: "edit", label: "Edit Member", icon: Settings },
            { id: "enroll", label: "Enroll Biometrics", icon: Fingerprint },
            { id: "push", label: "Sync to Machine", icon: Cpu },
            { id: "delete", label: "Delete", icon: Trash2, variant: "destructive" },
          ]} 
          onAction={(id) => {
            if (id === "delete") handleDelete(row._id || row.id, row.user?.name)
            else if (id === "enroll") handleEnroll(row._id || row.id)
            else if (id === "push") handlePush(row._id || row.id)
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
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0">
              <form onSubmit={handleAddMember} className="flex flex-col h-full">
                <DialogHeader className="p-6 pb-0">
                  <DialogTitle className="text-xl font-black">Register New Member</DialogTitle>
                  <DialogDescription>
                    Fill in the details below to create a new gym membership account.
                  </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  {/* Personal Details Section */}
                  <section className="space-y-4">
                    <div className="flex items-center gap-2 border-b pb-2">
                      <div className="h-6 w-1 bg-primary rounded-full" />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-primary">Personal Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="grid gap-1.5">
                        <Label htmlFor="name">Member Name *</Label>
                        <Input id="name" name="name" placeholder="Full Name" required />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="father_husband_name">Father/Husband</Label>
                        <Input id="father_husband_name" name="father_husband_name" placeholder="Name" />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="biometric_id">Biometric ID</Label>
                        <Input id="biometric_id" name="biometric_id" placeholder="BIO-000" />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="member_id_custom">Member ID *</Label>
                        <Input id="member_id_custom" name="member_id_custom" placeholder="MEM-2024" required />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="proximity_card_no">Proximity Card No.</Label>
                        <Input id="proximity_card_no" name="proximity_card_no" placeholder="CARD-000" />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <DatePicker 
                          date={dob} 
                          setDate={setDob} 
                          name="dob" 
                          placeholder="Select birthday"
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="mobile_no">Mobile No.</Label>
                        <Input id="mobile_no" name="mobile_no" placeholder="+1 (555) 000-0000" />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" name="email" type="email" placeholder="email@example.com" required />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="govt_uid">Govt. UID (Aadhar/SSN)</Label>
                        <Input id="govt_uid" name="govt_uid" placeholder="0000-0000-0000" />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="gender">Gender</Label>
                        <select name="gender" className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30">
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="address">Full Address</Label>
                      <textarea 
                        name="address" 
                        className="flex min-h-[80px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Street, City, State, Zip"
                      />
                    </div>
                  </section>

                  {/* Member Details Section */}
                  <section className="space-y-4">
                    <div className="flex items-center gap-2 border-b pb-2">
                      <div className="h-6 w-1 bg-primary rounded-full" />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-primary">Member Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="grid gap-1.5">
                        <Label htmlFor="join_date">Date Of Joining *</Label>
                        <DatePicker 
                          date={joinDate} 
                          setDate={setJoinDate} 
                          name="join_date" 
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="membership_type">Membership Plan</Label>
                        <select name="membership_type" className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30">
                          {plans.length > 0 ? (
                            plans.map(plan => (
                              <option key={plan._id || plan.id} value={plan.name}>
                                {plan.name}
                              </option>
                            ))
                          ) : (
                            <option value="">No plans available</option>
                          )}
                        </select>
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="validity_expiry_date">Validity Expire Date *</Label>
                        <DatePicker 
                          date={expiryDate} 
                          setDate={setExpiryDate} 
                          name="validity_expiry_date" 
                          placeholder="Select expiry"
                        />
                      </div>
                    </div>
                  </section>

                  {/* Gym Details Section */}
                  <section className="space-y-4 pb-4">
                    <div className="flex items-center gap-2 border-b pb-2">
                      <div className="h-6 w-1 bg-primary rounded-full" />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-primary">Gym Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="grid gap-1.5">
                        <Label htmlFor="branch_id">Branch Name *</Label>
                        <select name="branch_id" className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30" required defaultValue={selectedBranch?.id || selectedBranch?._id}>
                          {branches.map(branch => (
                            <option key={branch.id || branch._id} value={branch.id || branch._id}>
                              {branch.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="biometric_device_id">Link Biometric Machine</Label>
                        <select name="biometric_device_id" className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30">
                          <option value="">Don't Link Machine</option>
                          {biometricDevices.map(device => (
                            <option key={device.id || device._id} value={device.id || device._id}>
                              {device.name} ({device.device_id})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="weekly_off">First Weekly Off</Label>
                        <select name="weekly_off" className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30">
                          <option value="None">None</option>
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                          <option value="Saturday">Saturday</option>
                          <option value="Sunday">Sunday</option>
                        </select>
                      </div>
                    </div>
                  </section>
                </div>

                <DialogFooter className="p-6 border-t bg-muted/20">
                  <DialogClose asChild>
                    <Button type="button" variant="outline" className="font-bold">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={formLoading} className="font-bold shadow-lg shadow-primary/20">
                    {formLoading ? "Registering..." : "Complete Registration"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <DataTable 
        data={filteredMembers} 
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

"use client"

import * as React from "react"
import { Plus, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DataTable, type Column } from "@/components/tables/data-table"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api-client"
import { getInitials, formatDate } from "@/lib/utils"
import { SlideInText } from "@/components/ui/slide-in-text"

export default function MembersPage() {
  const [members, setMembers] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem("token")
        const userStr = localStorage.getItem("user")
        if (!token || !userStr) return

        const user = JSON.parse(userStr)
        const data = await api.get("/members", {
          token,
          gymId: user.gym_id
        })
        setMembers(data)
      } catch (err) {
        console.error("Failed to fetch members", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMembers()
  }, [])

  const columns: Column<any>[] = [
    {
      header: "Member",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={row.avatar} alt={row.fullName} />
            <AvatarFallback>{getInitials(row.fullName)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{row.fullName}</span>
            <span className="text-xs text-muted-foreground">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (row) => (
        <Badge variant={row.status === "Active" ? "success" : "destructive"}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: "Plan",
      cell: (row) => (
        <div className="font-medium">{row.membershipPlan}</div>
      ),
    },
    {
      header: "Attendance",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-full bg-secondary rounded-full h-2 max-w-[100px]">
            <div 
              className={`h-2 rounded-full ${row.attendanceRate > 70 ? 'bg-success' : row.attendanceRate > 40 ? 'bg-warning' : 'bg-destructive'}`} 
              style={{ width: `${row.attendanceRate}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">{row.attendanceRate}%</span>
        </div>
      ),
    },
    {
      header: "Next Billing",
      cell: (row) => <div className="text-sm">{row.nextBillingDate ? formatDate(row.nextBillingDate) : '-'}</div>,
    },
    {
      header: "Join Date",
      cell: (row) => <div className="text-sm text-muted-foreground">{formatDate(row.joinDate)}</div>,
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
          <SlideInText text="Members Directory" />
          <p className="text-muted-foreground">Manage your gym members, plans, and statuses.</p>
        </div>
        <Dialog>
          <form>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Add New Member</DialogTitle>
                <DialogDescription>
                  Register a new member to your gym branch.
                </DialogDescription>
              </DialogHeader>
              <FieldGroup>
                <Field>
                  <Label htmlFor="member-first-name">First Name</Label>
                  <Input id="member-first-name" name="first_name" placeholder="John" required />
                </Field>
                <Field>
                  <Label htmlFor="member-last-name">Last Name</Label>
                  <Input id="member-last-name" name="last_name" placeholder="Doe" required />
                </Field>
                <Field>
                  <Label htmlFor="member-email">Email</Label>
                  <Input id="member-email" name="email" type="email" placeholder="john.doe@example.com" required />
                </Field>
                <Field>
                  <Label htmlFor="member-plan">Select Plan</Label>
                  <select id="member-plan" name="plan" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    <option value="basic">Basic Plan ($29.99/mo)</option>
                    <option value="pro">Pro Plan ($59.99/mo)</option>
                    <option value="elite">Elite Plan ($99.99/mo)</option>
                  </select>
                </Field>
              </FieldGroup>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Complete Registration</Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>

      <DataTable 
        data={members} 
        columns={columns} 
        searchPlaceholder="Search members by name or email..." 
      />
    </div>
  )
}

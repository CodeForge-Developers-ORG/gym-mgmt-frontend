"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FieldGroup } from "@/components/ui/field"
import { Dumbbell } from "lucide-react"
import { api } from "@/lib/api-client"
import { SlideInText } from "@/components/ui/slide-in-text"

export default function MembershipPage() {
  const [subscription, setSubscription] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchSub = async () => {
      try {
        const token = localStorage.getItem("token")
        const userStr = localStorage.getItem("user")
        if (!token || !userStr) return

        const user = JSON.parse(userStr)
        const data = await api.get("/subscriptions", {
          token,
          gymId: user.gym_id
        })
        setSubscription(data)
      } catch (err) {
        console.error("Failed to fetch subscription", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSub()
  }, [])

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SlideInText text="Membership Status" />
          <p className="text-muted-foreground">Manage your plan and billing information.</p>
        </div>
      </div>

      <Card className="border-primary shadow-lg overflow-hidden relative">
        <div className="absolute -right-12 -top-12 opacity-10">
          <Dumbbell className="h-64 w-64 text-primary" />
        </div>
        <CardHeader>
          <CardTitle className="text-2xl">{subscription?.plan_name || "Standard"} Plan</CardTitle>
          <CardDescription>Your current active subscription</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 relative z-10">
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Status</span>
            <span className={`font-semibold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-full ${subscription?.status === 'active' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
              {subscription?.status || "Active"}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Billing Cycle</span>
            <span className="font-semibold">{subscription?.billing_cycle || "Monthly"}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Next Payment</span>
            <span className="font-semibold italic text-muted-foreground">
              {subscription?.next_payment ? `${subscription.next_payment}` : "Contact administration"}
            </span>
          </div>
        </CardContent>
        <CardFooter className="gap-4 relative z-10">
          <Dialog>
            <form>
              <DialogTrigger asChild>
                <Button>Upgrade Plan</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Upgrade Membership</DialogTitle>
                  <DialogDescription>
                    Choose a new plan. Your billing will be pro-rated for the remainder of the month.
                  </DialogDescription>
                </DialogHeader>
                <FieldGroup>
                  <Button variant="outline" className="justify-between h-auto py-4 px-6 text-left hover:border-primary">
                    <div>
                      <div className="font-bold text-lg">Elite Plan</div>
                      <div className="text-sm text-muted-foreground">All Access + Personal Training</div>
                    </div>
                    <div className="text-xl font-bold">$99.99/mo</div>
                  </Button>
                </FieldGroup>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Confirm Upgrade</Button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>
          
          <Button variant="outline">Cancel Subscription</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

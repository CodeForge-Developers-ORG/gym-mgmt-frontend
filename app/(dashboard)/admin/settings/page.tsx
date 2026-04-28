"use client"

import * as React from "react"
import { Building, Clock, Bell, MapPin, Phone, Mail, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SlideInText } from "@/components/ui/slide-in-text"

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-8 max-w-6xl pb-10">
      <div>
        <SlideInText text="Branch Settings" />
        <p className="text-muted-foreground">Manage your gym location details, operating hours, and automated systems.</p>
      </div>

      <Tabs defaultValue="profile" className="flex flex-col md:flex-row gap-8">
        <TabsList className="flex md:flex-col h-auto w-full md:w-64 bg-transparent p-0 space-y-2 justify-start items-start gap-2 overflow-x-auto">
          <TabsTrigger 
            value="profile" 
            className="w-full justify-start gap-3 py-3 px-4 text-left data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none hover:bg-muted/50"
          >
            <Building className="h-4 w-4" />
            Branch Profile
          </TabsTrigger>
          <TabsTrigger 
            value="hours" 
            className="w-full justify-start gap-3 py-3 px-4 text-left data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none hover:bg-muted/50"
          >
            <Clock className="h-4 w-4" />
            Operating Hours
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className="w-full justify-start gap-3 py-3 px-4 text-left data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none hover:bg-muted/50"
          >
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>
        
        <div className="flex-1 min-w-0">
          <TabsContent value="profile" className="mt-0 space-y-6 animate-fade-in">
            <Card className="glass border-border/50">
              <CardHeader className="pb-4 border-b border-border/50 bg-muted/20">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <ShieldCheck className="h-5 w-5 text-primary" /> General Information
                </CardTitle>
                <CardDescription>This information is visible to your members and on public schedules.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid gap-2">
                  <Label className="text-sm font-semibold">Branch Name</Label>
                  <Input defaultValue="Main Hub - Downtown" className="max-w-md h-10" />
                </div>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label className="text-sm font-semibold flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> Contact Phone</Label>
                    <Input defaultValue="+1 (555) 123-4567" className="h-10" />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-semibold flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> Contact Email</Label>
                    <Input defaultValue="downtown@staffkhata.com" className="h-10" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-border/50">
              <CardHeader className="pb-4 border-b border-border/50 bg-muted/20">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MapPin className="h-5 w-5 text-primary" /> Location Details
                </CardTitle>
                <CardDescription>Your physical address for billing and map routing.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid gap-2">
                  <Label className="text-sm font-semibold">Street Address</Label>
                  <Input defaultValue="123 Fitness Blvd, Suite 100" className="h-10" />
                </div>
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="grid gap-2">
                    <Label className="text-sm font-semibold">City</Label>
                    <Input defaultValue="New York" className="h-10" />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-semibold">State / Province</Label>
                    <Input defaultValue="NY" className="h-10" />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-semibold">Postal Code</Label>
                    <Input defaultValue="10001" className="h-10" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border/50 bg-muted/10 pt-6">
                <Button className="ml-auto px-8">Save Profile Details</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="hours" className="mt-0 animate-fade-in">
            <Card className="glass border-border/50">
              <CardHeader className="pb-4 border-b border-border/50 bg-muted/20">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Clock className="h-5 w-5 text-primary" /> Weekly Schedule
                </CardTitle>
                <CardDescription>Define when the gym is open. This affects class scheduling boundaries.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="rounded-lg border bg-background/50 divide-y overflow-hidden">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                    <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                      <div className="w-40 font-medium mb-3 sm:mb-0 flex items-center gap-3">
                        <Switch defaultChecked />
                        {day}
                      </div>
                      <div className="flex items-center gap-3">
                        <Input type="time" defaultValue="05:00" className="w-32 bg-background shadow-none border-input/50" />
                        <span className="text-muted-foreground text-sm font-medium">to</span>
                        <Input type="time" defaultValue="23:00" className="w-32 bg-background shadow-none border-input/50" />
                      </div>
                    </div>
                  ))}
                  {['Saturday', 'Sunday'].map(day => (
                    <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/10 hover:bg-muted/30 transition-colors">
                      <div className="w-40 font-medium mb-3 sm:mb-0 flex items-center gap-3">
                        <Switch defaultChecked />
                        <span className="text-primary font-semibold">{day}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Input type="time" defaultValue="07:00" className="w-32 bg-background shadow-none border-input/50" />
                        <span className="text-muted-foreground text-sm font-medium">to</span>
                        <Input type="time" defaultValue="20:00" className="w-32 bg-background shadow-none border-input/50" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t border-border/50 bg-muted/10 pt-6">
                <Button className="ml-auto px-8">Update Schedule</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-0 animate-fade-in">
            <Card className="glass border-border/50">
              <CardHeader className="pb-4 border-b border-border/50 bg-muted/20">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Bell className="h-5 w-5 text-primary" /> Automated Triggers
                </CardTitle>
                <CardDescription>Select which system emails and push notifications are active for this branch.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-2">
                {[
                  { title: "New Member Welcome Sequence", desc: "Send onboarding emails and app setup instructions immediately upon registration.", checked: true },
                  { title: "Class Reminders (24h prior)", desc: "Send an email and push notification reminder a day before a booked class.", checked: true },
                  { title: "Payment Failed Alert", desc: "Immediately notify members if their recurring subscription charge declines.", checked: true },
                  { title: "Membership Expiring Warning", desc: "Send an alert 7 days before a fixed-term membership is set to expire.", checked: false },
                  { title: "Missed Check-in Checkup", desc: "Send a motivational check-in email if a member hasn't visited in 14 days.", checked: false },
                ].map((item, i) => (
                  <div key={i} className="group flex items-start sm:items-center justify-between border rounded-lg p-4 hover:border-primary/50 transition-colors bg-background/40">
                    <div className="pr-8">
                      <Label className="text-base font-semibold cursor-pointer block mb-1">{item.title}</Label>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.checked} className="mt-1 sm:mt-0" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

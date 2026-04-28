"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SlideInText } from "@/components/ui/slide-in-text"

export default function SuperAdminSettingsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <SlideInText text="Platform Settings" />
          <p className="text-muted-foreground">Manage global SaaS configurations, branding, and integrations.</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px] mb-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Configuration</CardTitle>
              <CardDescription>Update your SaaS platform details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Platform Name</Label>
                  <Input defaultValue="Staff Khata Gym Management" />
                </div>
                <div className="grid gap-2">
                  <Label>Support Email</Label>
                  <Input defaultValue="support@staffkhata.com" type="email" />
                </div>
                <div className="grid gap-2">
                  <Label>Default Currency</Label>
                  <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label>Timezone</Label>
                  <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    <option>UTC (GMT+0)</option>
                    <option>EST (GMT-5)</option>
                    <option>PST (GMT-8)</option>
                  </select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance & Branding</CardTitle>
              <CardDescription>Customize the look and feel of the tenant portals.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Primary Brand Color</Label>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-[#8B5CF6] border-2 shadow-sm"></div>
                  <Input defaultValue="#8B5CF6" className="w-[150px]" />
                </div>
              </div>
              <div className="grid gap-2 mt-4">
                <Label>Company Logo</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center bg-muted/20">
                  <Button variant="outline">Upload New Logo</Button>
                  <p className="text-xs text-muted-foreground mt-2">SVG, PNG, JPG or GIF (max. 2MB)</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-end">
              <Button>Save Branding</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Gateways</CardTitle>
              <CardDescription>Configure Stripe or PayPal for global subscription billing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">Stripe Connect</h4>
                  <p className="text-sm text-muted-foreground">Status: <span className="text-success">Connected</span></p>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">PayPal Business</h4>
                  <p className="text-sm text-muted-foreground">Status: Not Connected</p>
                </div>
                <Button variant="secondary">Connect</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage keys for external third-party integrations.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <Label>Production Webhook Secret</Label>
                <div className="flex gap-2">
                  <Input type="password" defaultValue="whsec_1234567890abcdef" readOnly />
                  <Button variant="outline">Reveal</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-end">
              <Button variant="destructive">Regenerate Keys</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Global Security Policies</CardTitle>
              <CardDescription>Enforce security rules across all gym branches.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <Label className="text-base">Require 2FA for Admins</Label>
                  <p className="text-sm text-muted-foreground">Force all branch managers to use Two-Factor Authentication.</p>
                </div>
                <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                  <span className="pointer-events-none block h-5 w-5 translate-x-5 rounded-full bg-background shadow-lg ring-0 transition-transform"></span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div>
                  <Label className="text-base">Session Timeout</Label>
                  <p className="text-sm text-muted-foreground">Automatically log out inactive users.</p>
                </div>
                <select className="flex h-9 w-32 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>4 hours</option>
                  <option>24 hours</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

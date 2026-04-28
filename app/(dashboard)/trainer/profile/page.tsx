"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import { SlideInText } from "@/components/ui/slide-in-text"

export default function ProfilePage() {
  const [user, setUser] = React.useState<any>(null)

  React.useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      setUser(JSON.parse(userStr))
    }
  }, [])

  if (!user) return null

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <SlideInText text="My Profile" />
      
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <Button variant="outline">Change Photo</Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Full Name</Label>
              <Input defaultValue={user.name} />
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input defaultValue={user.email} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button>Save Profile</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

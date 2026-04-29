"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { SlideInText } from "@/components/ui/slide-in-text"

export default function WorkoutsPage() {
  const plans = [
    { name: "Beginner Full Body", target: "Strength", duration: "4 Weeks" },
    { name: "HIIT Cardio Blast", target: "Weight Loss", duration: "2 Weeks" },
    { name: "Advanced Powerlifting", target: "Strength", duration: "8 Weeks" },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SlideInText text="Workout Plans" />
          <p className="text-muted-foreground">Create and manage workout templates for clients.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Create New Plan
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.target} • {plan.duration}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full">Edit Plan</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

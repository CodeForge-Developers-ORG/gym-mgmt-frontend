"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { SlideInText } from "@/components/ui/slide-in-text"

export default function DietPage() {
  const diets = [
    { name: "Keto Kickstart", calories: "1800", type: "Low Carb" },
    { name: "Muscle Building Bulker", calories: "3200", type: "High Protein" },
    { name: "Balanced Maintenance", calories: "2200", type: "Balanced" },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SlideInText text="Diet & Nutrition" />
          <p className="text-muted-foreground">Manage meal plans and nutritional macros.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Create Meal Plan
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {diets.map((diet, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>{diet.name}</CardTitle>
              <CardDescription>{diet.type} • ~{diet.calories} kcal/day</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full">Edit Macros</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

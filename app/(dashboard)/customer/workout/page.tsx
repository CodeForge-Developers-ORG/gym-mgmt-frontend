"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { SlideInText } from "@/components/ui/slide-in-text"

export default function WorkoutPlanPage() {
  const exercises = [
    { name: "Barbell Squats", sets: "4", reps: "8-10", rest: "90s" },
    { name: "Romanian Deadlifts", sets: "3", reps: "10-12", rest: "60s" },
    { name: "Leg Press", sets: "3", reps: "12-15", rest: "60s" },
    { name: "Calf Raises", sets: "4", reps: "15-20", rest: "45s" },
  ]

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SlideInText text="Today's Workout" />
          <p className="text-muted-foreground">Leg Day Builder - Week 2, Day 3</p>
        </div>
      </div>

      <div className="space-y-4">
        {exercises.map((ex, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardTitle>{ex.name}</CardTitle>
              <CardDescription>Target: Lower Body</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm font-medium bg-muted/50 p-4 rounded-lg">
                <div>Sets: <span className="text-primary">{ex.sets}</span></div>
                <div>Reps: <span className="text-primary">{ex.reps}</span></div>
                <div>Rest: <span className="text-primary">{ex.rest}</span></div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full gap-2">
                <CheckCircle2 className="h-4 w-4" /> Mark Complete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

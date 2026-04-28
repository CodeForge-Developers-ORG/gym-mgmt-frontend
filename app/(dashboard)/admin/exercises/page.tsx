"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BodyAnatomySvg } from "@/components/illustrations/gym-svgs"
import Image from "next/image"
import { SlideInText } from "@/components/ui/slide-in-text"

export default function ExercisesPage() {
  const [search, setSearch] = React.useState("");

  const exercises = [
    { name: "Dumbbell Press", muscle: "Chest", equipment: "Free Weights", type: "Compound", image: "/vector_icons/Dumbell.png" },
    { name: "Kettlebell Swings", muscle: "Legs", equipment: "Free Weights", type: "Compound", image: "/vector_icons/Kettlebell.png" },
    { name: "Gymnast Rings Pull", muscle: "Back", equipment: "Rings", type: "Compound", image: "/vector_icons/Ring.png" },
    { name: "Plate Raises", muscle: "Shoulders", equipment: "Plates", type: "Isolation", image: "/vector_icons/Gym Plate.png" },
    { name: "Speed Bag Boxing", muscle: "Arms", equipment: "Speed Bag", type: "Cardio", image: "/vector_icons/Standing Speed Ball.png" },
    { name: "Ab Wheel Rollouts", muscle: "Core", equipment: "Wheel", type: "Isolation", image: "/vector_icons/wheele_roller.png" },
  ]

  const filtered = exercises.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.muscle.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SlideInText text="Exercise Dictionary" />
          <p className="text-muted-foreground">Standardized exercise definitions with visualizations.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Filter */}
        <div className="lg:col-span-1 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search exercises..." 
              className="pl-9 h-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Card className="glass">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Muscle Map</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center pb-6">
              <BodyAnatomySvg className="w-full max-w-[200px] text-primary/40" activePart="all" />
            </CardContent>
          </Card>
        </div>

        {/* Exercises Grid */}
        <div className="lg:col-span-3 grid sm:grid-cols-3 gap-6 content-start">
          {filtered.map((ex, i) => (
            <Card key={i} className="hover:border-primary/50 transition-colors flex flex-col group">
              <CardHeader className="pb-2 flex-grow-0">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{ex.name}</CardTitle>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary">{ex.muscle}</Badge>
                      <Badge variant="outline">{ex.equipment}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex justify-center items-center p-6 bg-muted/10 rounded-b-xl border-t mt-4 relative min-h-[200px]">
                <Image 
                  src={ex.image} 
                  alt={ex.name}
                  fill
                  className="object-contain p-6 group-hover:scale-110 transition-transform drop-shadow-lg"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="sm:col-span-3 text-center py-20 text-muted-foreground border-2 border-dashed rounded-xl">
              No exercises match your search.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

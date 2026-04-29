"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api-client"
import Image from "next/image"
import { SlideInText } from "@/components/ui/slide-in-text"

export default function DietPlanPage() {
  const [plans, setPlans] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchDiet = async () => {
      try {
        const token = localStorage.getItem("token")
        const userStr = localStorage.getItem("user")
        if (!token || !userStr) return

        const user = JSON.parse(userStr)
        const data = await api.get("/diet-plans", {
          token,
          gymId: user.gym_id
        })
        setPlans(data)
      } catch (err) {
        console.error("Failed to fetch diet plans", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDiet()
  }, [])

  const [search, setSearch] = React.useState("")
  const [ingredients, setIngredients] = React.useState<any[]>([])
  const [isSearching, setIsSearching] = React.useState(false)

  const handleSearch = async (val: string) => {
    setSearch(val)
    if (val.length < 3) {
      setIngredients([])
      return
    }

    setIsSearching(true)
    try {
      const token = localStorage.getItem("token") ?? undefined
      const userStr = localStorage.getItem("user")
      const user = userStr ? JSON.parse(userStr) : {}
      const data = await api.get(`/ingredients?search=${val}`, {
        token,
        gymId: user.gym_id
      })
      setIngredients(data)
    } catch (err) {
      console.error("Search failed", err)
    } finally {
      setIsSearching(false)
    }
  }

  const currentPlan = plans[0]

  return (
    <div className="flex flex-col gap-8 max-w-5xl pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SlideInText text={currentPlan ? currentPlan.name : "My Diet Plan"} />
          <p className="text-muted-foreground">{currentPlan ? `~${currentPlan.total_calories} kcal/day` : "No plan assigned yet"}</p>
        </div>
        {currentPlan && <Badge className="text-sm px-4 py-1">Assigned by Trainer</Badge>}
      </div>

      {/* Ingredient Search */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            🥗 Ingredient Database
            {isSearching && <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />}
          </CardTitle>
          <CardDescription>Search for foods to see their nutritional breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <input 
              type="text"
              placeholder="Search e.g. Apple, Chicken, Oats..."
              className="w-full bg-background border-2 border-primary/10 rounded-2xl p-4 pl-6 outline-none focus:border-primary/40 transition-all"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          
          {ingredients.length > 0 && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ingredients.map((ing, i) => (
                <div key={i} className="bg-card border rounded-2xl p-4 flex flex-col gap-1 hover:border-primary/40 transition-colors">
                  <div className="font-bold text-sm uppercase tracking-tight">{ing.name}</div>
                  <div className="text-xs text-muted-foreground flex justify-between">
                    <span>{ing.calories} kcal</span>
                    <span className="text-primary font-bold">{ing.protein}g Protein</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {currentPlan ? (
          currentPlan.meals.map((meal: any, idx: number) => (
            <Card key={idx} className="glass relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-50 group-hover:scale-110 transition-transform">
                <Image 
                  src={`/vector_icons/health/3d Health(${[5, 8, 33, 40][idx % 4]}).png`} 
                  alt={meal.name} 
                  width={140} 
                  height={140} 
                  className="drop-shadow-xl" 
                />
              </div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-xl">{meal.name}</CardTitle>
                <CardDescription className="font-semibold text-primary">{meal.calories} kcal • {meal.protein}g Protein</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground relative z-10 pb-12">
                {meal.items.map((item: string, i: number) => (
                  <p key={i} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {item}
                  </p>
                ))}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-muted-foreground italic border border-dashed rounded-3xl">
            Stay tuned! Your personal trainer will assign your custom diet plan here soon.
          </div>
        )}
      </div>
    </div>
  )
}

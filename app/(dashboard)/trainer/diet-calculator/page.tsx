"use client"

import * as React from "react"
import { Calculator, Target, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { SlideInText } from "@/components/ui/slide-in-text"

export default function DietCalculatorPage() {
  const [macros, setMacros] = React.useState<{cals: number, p: number, c: number, f: number} | null>(null);

  const calculateMacros = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy calculation for demonstration
    setMacros({
      cals: 2450,
      p: 180,
      c: 250,
      f: 80
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SlideInText text="Diet & Macro Calculator" />
          <p className="text-muted-foreground">Calculate Total Daily Energy Expenditure (TDEE) and generate macro splits.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="glass relative overflow-hidden">
          <div className="absolute top-2 right-2 opacity-20 pointer-events-none">
             <Image src="/vector_icons/health/3d Health(30).png" alt="Health" width={100} height={100} />
          </div>
          <form onSubmit={calculateMacros} className="relative z-10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5 text-primary" /> Client Metrics</CardTitle>
              <CardDescription>Enter client details to estimate metabolic rate.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Age (years)</Label>
                  <Input type="number" defaultValue="28" required />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Weight (kg)</Label>
                  <Input type="number" defaultValue="82" required />
                </div>
                <div className="space-y-2">
                  <Label>Height (cm)</Label>
                  <Input type="number" defaultValue="180" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Activity Level</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  <option>Sedentary (Little to no exercise)</option>
                  <option>Lightly Active (1-3 days/week)</option>
                  <option defaultValue="true">Moderately Active (3-5 days/week)</option>
                  <option>Very Active (6-7 days/week)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Primary Goal</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  <option>Weight Loss (Deficit)</option>
                  <option defaultValue="true">Maintenance</option>
                  <option>Muscle Gain (Surplus)</option>
                </select>
              </div>
            </CardContent>
            <CardFooter className="pt-6 border-t bg-muted/10">
              <Button type="submit" className="w-full h-12 text-lg">Calculate Macros</Button>
            </CardFooter>
          </form>
        </Card>

        <div className="space-y-6">
          <Card className={`glass transition-all duration-500 relative overflow-hidden ${macros ? 'opacity-100 scale-100' : 'opacity-50 grayscale pointer-events-none'}`}>
            <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
              <Image src="/vector_icons/health/3d Health(11).png" alt="Target" width={120} height={120} />
            </div>
            <CardHeader className="pb-4 relative z-10">
              <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> Calculated Targets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="text-center p-6 bg-primary/10 rounded-xl border border-primary/20">
                <div className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">Target Daily Calories</div>
                <div className="text-5xl font-black flex items-center justify-center gap-4">
                  <Image src="/vector_icons/energy_drink.png" alt="Energy" width={40} height={40} className="drop-shadow-sm" />
                  {macros?.cals || '0000'} <span className="text-xl text-muted-foreground font-medium">kcal</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-muted/30 p-4 rounded-xl text-center border relative overflow-hidden group">
                  <div className="absolute -bottom-4 -right-4 opacity-20 group-hover:opacity-40 transition-opacity">
                    <Image src="/vector_icons/health/3d Health(8).png" alt="Protein" width={60} height={60} />
                  </div>
                  <div className="text-sm font-medium text-muted-foreground mb-2 relative z-10">Protein</div>
                  <div className="text-2xl font-bold text-blue-500 relative z-10">{macros?.p || '0'}g</div>
                  <div className="text-xs text-muted-foreground mt-1 relative z-10">40%</div>
                </div>
                <div className="bg-muted/30 p-4 rounded-xl text-center border relative overflow-hidden group">
                  <div className="absolute -bottom-4 -right-4 opacity-20 group-hover:opacity-40 transition-opacity">
                    <Image src="/vector_icons/fruits-and-vegetables/Potato from Recraft.png" alt="Carbs" width={60} height={60} />
                  </div>
                  <div className="text-sm font-medium text-muted-foreground mb-2 relative z-10">Carbs</div>
                  <div className="text-2xl font-bold text-orange-500 relative z-10">{macros?.c || '0'}g</div>
                  <div className="text-xs text-muted-foreground mt-1 relative z-10">40%</div>
                </div>
                <div className="bg-muted/30 p-4 rounded-xl text-center border relative overflow-hidden group">
                  <div className="absolute -bottom-4 -right-4 opacity-20 group-hover:opacity-40 transition-opacity">
                    <Image src="/vector_icons/fruits-and-vegetables/Avocado from Recraft.png" alt="Fats" width={60} height={60} />
                  </div>
                  <div className="text-sm font-medium text-muted-foreground mb-2 relative z-10">Fats</div>
                  <div className="text-2xl font-bold text-yellow-500 relative z-10">{macros?.f || '0'}g</div>
                  <div className="text-xs text-muted-foreground mt-1 relative z-10">20%</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0 relative z-10">
              <Button variant="secondary" className="w-full gap-2"><Activity className="h-4 w-4" /> Save to Client Profile</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

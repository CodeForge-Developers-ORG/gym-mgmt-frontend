"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { assetData } from "@/lib/asset-data"
import { SlideInText } from "@/components/ui/slide-in-text"

export default function AchievementsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SlideInText text="Trophy Room & Badges" />
          <p className="text-muted-foreground">Unlock health achievements and collect milestones!</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {assetData.health.map((path, i) => {
          // Generate a fake unlock status for demonstration
          const isUnlocked = i % 3 !== 0; // 66% unlocked
          const fakeBadgeName = `Achievement ${i + 1}`;
          
          return (
            <Card key={i} className={`overflow-hidden transition-all duration-300 ${isUnlocked ? 'border-primary/50 bg-primary/5 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20' : 'opacity-60 grayscale bg-muted/50'}`}>
              <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-3">
                <div className="relative w-24 h-24">
                  <Image 
                    src={path} 
                    alt={fakeBadgeName} 
                    fill 
                    className="object-contain drop-shadow-md" 
                    sizes="100px" 
                  />
                </div>
                <div className="space-y-1 w-full">
                  <span className="font-bold text-sm block truncate">{fakeBadgeName}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
                    {isUnlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

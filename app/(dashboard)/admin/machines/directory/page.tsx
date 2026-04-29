"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { BodyAnatomySvg } from "@/components/illustrations/gym-svgs"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { assetData } from "@/lib/asset-data"
import { SlideInText } from "@/components/ui/slide-in-text"

export default function MachineDirectoryPage() {
  const [activePart, setActivePart] = React.useState<string>('all');

  // Map the raw asset paths into a catalog format
  const catalog = assetData.equipment.map(path => {
    let name = path.split('/').pop()?.replace('.png', '') || 'Unknown';
    name = name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    // Assign mock categories based on filename hints for filtering
    let part = 'core';
    let type = 'Accessories';
    
    if (name.toLowerCase().includes('tredmill') || name.toLowerCase().includes('cycle') || name.toLowerCase().includes('skipping')) {
      part = 'legs';
      type = 'Cardio';
    } else if (name.toLowerCase().includes('dumbl') || name.toLowerCase().includes('dumbell') || name.toLowerCase().includes('plate') || name.toLowerCase().includes('kettlebell')) {
      part = 'arms';
      type = 'Free Weights';
    } else if (name.toLowerCase().includes('machine') || name.toLowerCase().includes('bench')) {
      part = 'chest';
      type = 'Strength';
    }

    return { name, part, type, image: path };
  });

  const filtered = catalog.filter(c => c.part === activePart || activePart === 'all');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SlideInText text="Full Equipment Catalog" />
          <p className="text-muted-foreground">Browse all {catalog.length} available equipment types for your inventory.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Interactive Anatomy Map */}
        <div className="lg:col-span-1">
          <Card className="glass h-full sticky top-24">
            <CardHeader>
              <CardTitle>Filter by Area</CardTitle>
              <CardDescription>Click a body part to filter.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <BodyAnatomySvg className="w-full max-w-[250px] text-muted-foreground" activePart={activePart} />
              
              <div className="flex flex-wrap gap-2 mt-6 justify-center">
                <Badge variant={activePart === 'all' ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setActivePart('all')}>All</Badge>
                <Badge variant={activePart === 'chest' ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setActivePart('chest')}>Chest & Back</Badge>
                <Badge variant={activePart === 'arms' ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setActivePart('arms')}>Arms & Shoulders</Badge>
                <Badge variant={activePart === 'legs' ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setActivePart('legs')}>Legs & Cardio</Badge>
                <Badge variant={activePart === 'core' ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setActivePart('core')}>Core & Accessories</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Machine Catalog Grid */}
        <div className="lg:col-span-3">
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((machine, i) => (
              <Card key={i} className="hover:border-primary/50 transition-all duration-300 group">
                <CardHeader className="pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{machine.name}</CardTitle>
                      <CardDescription className="uppercase text-xs mt-1 font-semibold">{machine.type}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex justify-center p-6">
                  <div className="bg-muted/20 p-8 rounded-full border border-border/50 group-hover:scale-105 transition-transform relative h-40 w-40 flex items-center justify-center">
                    <Image 
                      src={machine.image} 
                      alt={machine.name} 
                      fill
                      className="object-contain p-4 drop-shadow-xl"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full gap-2 group-hover:bg-primary">
                    <Plus className="h-4 w-4" /> Add to Inventory
                  </Button>
                </CardFooter>
              </Card>
            ))}
            {filtered.length === 0 && (
              <div className="sm:col-span-2 text-center py-20 text-muted-foreground border-2 border-dashed rounded-xl">
                No machines found for this target area in the directory yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

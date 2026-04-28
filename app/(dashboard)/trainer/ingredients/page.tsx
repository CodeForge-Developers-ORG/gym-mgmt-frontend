"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { assetData } from "@/lib/asset-data"
import { SlideInText } from "@/components/ui/slide-in-text"

export default function IngredientsGalleryPage() {
  const [search, setSearch] = React.useState("");

  const filtered = assetData.fruitsAndVegetables.filter(path => 
    path.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SlideInText text="Nutrition Database" />
          <p className="text-muted-foreground">Browse all {assetData.fruitsAndVegetables.length} available ingredients to build diet plans.</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search ingredients..." 
          className="pl-9 h-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map((path, i) => {
          // Extract name from path e.g. "/vector_icons/fruits/Apple.png" -> "Apple"
          let name = path.split('/').pop()?.replace('.png', '') || 'Unknown';
          name = name.replace(' from Recraft', '').replace(' (1)', '').replace(' Vegetable', '');
          
          return (
            <Card key={i} className="hover:border-primary/50 transition-colors group overflow-hidden">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-3">
                <div className="relative w-24 h-24 group-hover:scale-110 transition-transform">
                  <Image src={path} alt={name} fill className="object-contain drop-shadow-md" sizes="100px" />
                </div>
                <span className="font-medium text-sm truncate w-full" title={name}>{name}</span>
              </CardContent>
            </Card>
          )
        })}
      </div>
      
      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-xl">
          No ingredients found matching your search.
        </div>
      )}
    </div>
  )
}

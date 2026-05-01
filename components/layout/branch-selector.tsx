"use client"

import * as React from "react"
import { Building2, ChevronDown, Check } from "lucide-react"
import { useBranch, type Branch } from "@/context/branch-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function BranchSelector() {
  const { branches, selectedBranch, setSelectedBranch, isLoading } = useBranch()

  if (isLoading) {
    return (
      <div className="h-9 w-40 animate-pulse rounded-md bg-muted/50" />
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="h-9 gap-2 border-dashed bg-background px-3 font-semibold shadow-sm hover:bg-accent"
        >
          <Building2 className="h-4 w-4 text-primary" />
          <span className="max-w-[120px] truncate">
            {selectedBranch?.name || "All Branches"}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px]">
        <DropdownMenuLabel>Switch Branch</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {branches.map((branch) => (
          <DropdownMenuItem
            key={branch.id}
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setSelectedBranch(branch)}
          >
            <div className="flex flex-col">
              <span className="font-medium">{branch.name}</span>
              <span className="text-[10px] text-muted-foreground">{branch.location}</span>
            </div>
            {selectedBranch?.id === branch.id && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="justify-center text-primary font-bold cursor-pointer"
          onClick={() => window.location.href = "/admin/branches"}
        >
          Manage Branches
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

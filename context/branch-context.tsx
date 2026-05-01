"use client"

import * as React from "react"
import { api } from "@/lib/api-client"

export interface Branch {
  id: string;
  _id?: string; // MongoDB ID
  name: string;
  location: string;
}

interface BranchStats {
  total_members: number;
  total_staff: number;
}

interface BranchContextType {
  branches: Branch[];
  selectedBranch: Branch | null;
  setSelectedBranch: (branch: Branch | null) => void;
  isLoading: boolean;
  refreshBranches: () => Promise<void>;
  stats: BranchStats | null;
}

const BranchContext = React.createContext<BranchContextType | undefined>(undefined)

export function BranchProvider({ children }: { children: React.ReactNode }) {
  const [branches, setBranches] = React.useState<Branch[]>([])
  const [selectedBranch, setSelectedBranch] = React.useState<Branch | null>(null)
  const [stats, setStats] = React.useState<BranchStats | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  const fetchBranches = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await api.get("/branches")
      
      let branchesList: Branch[] = []
      if (data && typeof data === 'object') {
        if (Array.isArray(data)) {
          branchesList = data
        } else if (data.branches && Array.isArray(data.branches)) {
          branchesList = data.branches
          if (data.stats) setStats(data.stats)
        }
      }

      setBranches(branchesList)
      
      // Persist selection or default to first
      const savedBranchId = localStorage.getItem("selected_branch_id")
      const found = branchesList.find(b => (b.id || b._id) === savedBranchId)
      
      if (found) {
        setSelectedBranch(found)
      } else if (branchesList.length > 0 && !selectedBranch) {
        setSelectedBranch(branchesList[0])
      }
    } catch (error) {
      console.error("Failed to fetch branches:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchBranches()
  }, [fetchBranches])

  const handleSetSelectedBranch = (branch: Branch | null) => {
    setSelectedBranch(branch)
    if (branch) {
      localStorage.setItem("selected_branch_id", (branch.id || branch._id) as string)
    } else {
      localStorage.removeItem("selected_branch_id")
    }
  }

  return (
    <BranchContext.Provider value={{ 
      branches, 
      selectedBranch, 
      setSelectedBranch: handleSetSelectedBranch, 
      isLoading,
      refreshBranches: fetchBranches,
      stats
    }}>
      {children}
    </BranchContext.Provider>
  )
}

export function useBranch() {
  const context = React.useContext(BranchContext)
  if (context === undefined) {
    throw new Error("useBranch must be used within a BranchProvider")
  }
  return context
}

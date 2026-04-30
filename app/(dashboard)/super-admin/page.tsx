"use client"

import * as React from "react"
import Link from "next/link"
import {
  Building2, CreditCard, Users, Activity, TrendingUp,
  ArrowUpRight, ArrowDownRight, MoreHorizontal, ExternalLink,
  RefreshCw, Globe, CheckCircle2, AlertCircle, Clock
} from "lucide-react"
import { ActionMenu, type ActionMenuItem } from "@/components/ui/action-menu"
import { 
  Delete01Icon, 
  ViewOffIcon, 
  Link01Icon,
  CheckmarkCircle01Icon
} from "@hugeicons/core-free-icons"
import { useToast } from "@/context/toast-context"
import { ConfirmModal } from "@/components/ui/confirm-modal"
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis, BarChart, Bar
} from "recharts"

import { api } from "@/lib/api-client"
import { formatCurrency, formatDate, cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// ─── Types ─────────────────────────────────────────────────────────────────

interface DashboardStats {
  total_gyms?: number
  active_gyms?: number
  gym_growth?: number | null
  total_revenue?: number
  revenue_growth?: number | null
  active_subscriptions?: number
  subs_growth?: number | null
  total_members?: number
  member_growth?: number | null
}

interface Gym {
  id?: string | number
  _id?: string
  name: string
  address?: string
  status?: string
  email?: string
  phone?: string
  created_at?: string
  members_count?: number
}

interface RevenuePoint {
  name: string
  total: number
  subscriptions: number
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  loading,
  colorClass,
}: {
  title: string
  value: string | number
  icon: React.ElementType
  trend?: number
  trendLabel?: string
  loading?: boolean
  colorClass?: string
}) {
  const isPositive = (trend ?? 0) >= 0

  return (
    <div className="relative flex flex-col gap-3 rounded-2xl border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 overflow-hidden group">
      {/* BG glow */}
      <div className="absolute inset-0 bg-primary/3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{title}</p>
        <div className={cn("rounded-xl p-2 transition-all duration-300 group-hover:scale-110", colorClass ?? "bg-primary/10")}>
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>

      <div className="flex items-end justify-between gap-2">
        {loading ? (
          <div className="h-8 w-24 animate-pulse rounded-lg bg-muted" />
        ) : (
          <p className="text-2xl font-bold tracking-tight">{value}</p>
        )}
        {trend !== undefined && !loading && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full",
            isPositive ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400"
                       : "text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400"
          )}>
            {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      {trendLabel && !loading && (
        <p className="text-[10px] text-muted-foreground font-medium">{trendLabel}</p>
      )}
    </div>
  )
}

function GymStatusBadge({ status }: { status?: string }) {
  const s = status?.toLowerCase() ?? "active"
  if (s === "active") return <Badge variant="success" className="text-[10px]">Active</Badge>
  if (s === "maintenance") return <Badge variant="warning" className="text-[10px]">Maintenance</Badge>
  return <Badge variant="destructive" className="text-[10px]">Inactive</Badge>
}

function GymStatusIcon({ status }: { status?: string }) {
  const s = status?.toLowerCase() ?? "active"
  if (s === "active") return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
  if (s === "maintenance") return <Clock className="h-3.5 w-3.5 text-amber-500" />
  return <AlertCircle className="h-3.5 w-3.5 text-red-500" />
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function SuperAdminDashboard() {
  const [stats, setStats] = React.useState<DashboardStats | null>(null)
  const [gyms, setGyms] = React.useState<Gym[]>([])
  const [revenueData, setRevenueData] = React.useState<RevenuePoint[]>([])
  const [loading, setLoading] = React.useState(true)
  const [gymsLoading, setGymsLoading] = React.useState(true)
  const [lastRefreshed, setLastRefreshed] = React.useState(new Date())
  const [confirmConfig, setConfirmConfig] = React.useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant?: "default" | "destructive";
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
  })
  const toast = useToast()

  const handleAction = async (gymId: string, actionId: string) => {
    const gym = gyms.find(g => (g._id || g.id) === gymId)
    if (!gym) return
    const token = localStorage.getItem("token")
    if (!token) return

    switch (actionId) {
      case "delete":
        setConfirmConfig({
          open: true,
          title: "Delete Gym Branch?",
          description: `Are you sure you want to permanently delete ${gym.name}?`,
          variant: "destructive",
          onConfirm: async () => {
            const delLoading = toast.loading("Deleting Gym", `Removing ${gym.name}...`)
            try {
              await api.delete(`/super-admin/gyms/${gymId}`, { token })
              toast.removeNotification(delLoading)
              toast.success("Gym Deleted")
              fetchAll()
            } catch (err: any) {
              toast.removeNotification(delLoading)
              toast.error("Delete Failed", err.message)
            }
          }
        })
        break
      case "toggle-status":
        const newStatus = gym.status === "Active" ? "Inactive" : "Active"
        const statusLoading = toast.loading("Updating Status", `Setting ${gym.name} to ${newStatus}...`)
        try {
          await api.put(`/super-admin/gyms/${gymId}`, { status: newStatus }, { token })
          toast.removeNotification(statusLoading)
          toast.success("Status Updated")
          fetchAll()
        } catch (err: any) {
          toast.removeNotification(statusLoading)
          toast.error("Update Failed", err.message)
        }
        break
    }
  }

  const fetchAll = React.useCallback(async () => {
    const token = localStorage.getItem("token")
    if (!token) return

    // Stats
    setLoading(true)
    try {
      const data = await api.get("/super-admin/stats", { token })
      setStats(data)
    } catch (err) {
      console.error("Stats fetch failed", err)
    } finally {
      setLoading(false)
    }

    // Revenue chart
    try {
      const rev = await api.get("/dashboard/revenue-chart", { token })
      if (Array.isArray(rev)) {
        setRevenueData(rev)
      } else if (rev?.data) {
        setRevenueData(rev.data)
      }
    } catch (err) {
      console.error("Revenue fetch failed", err)
    }

    // Gyms (for the table)
    setGymsLoading(true)
    try {
      const gymData = await api.get("/super-admin/gyms", { token })
      setGyms(Array.isArray(gymData) ? gymData : gymData?.data ?? [])
    } catch (err) {
      console.error("Gyms fetch failed", err)
    } finally {
      setGymsLoading(false)
    }

    setLastRefreshed(new Date())
  }, [])

  React.useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const gymKey = (g: Gym) => g._id ?? g.id ?? g.name

  return (
    <div className="flex flex-col gap-6 pb-8">

      {/* ── Page header ───────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Platform Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Monitor performance and growth across all gym branches.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground hidden sm:block">
            Updated {lastRefreshed.toLocaleTimeString()}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs"
            onClick={fetchAll}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
          <Button size="sm" className="gap-2 text-xs" asChild>
            <Link href="/super-admin/gyms">
              <Building2 className="h-3.5 w-3.5" />
              Manage Gyms
            </Link>
          </Button>
        </div>
      </div>

      {/* ── KPI Cards ────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Active Gyms"
          value={stats?.total_gyms ?? 0}
          icon={Building2}
          trend={stats?.gym_growth ?? undefined}
          trendLabel="vs last month"
          loading={loading}
          colorClass="bg-blue-100 dark:bg-blue-950"
        />
        <StatCard
          title="Platform MRR"
          value={stats?.total_revenue ? formatCurrency(stats.total_revenue) : "—"}
          icon={CreditCard}
          trend={stats?.revenue_growth ?? undefined}
          trendLabel="monthly recurring revenue"
          loading={loading}
          colorClass="bg-emerald-100 dark:bg-emerald-950"
        />
        <StatCard
          title="Active Subscriptions"
          value={stats?.active_subscriptions ?? 0}
          icon={TrendingUp}
          trend={stats?.subs_growth ?? undefined}
          trendLabel="vs last month"
          loading={loading}
          colorClass="bg-purple-100 dark:bg-purple-950"
        />
        <StatCard
          title="Total Members"
          value={stats?.total_members ?? 0}
          icon={Users}
          trend={stats?.member_growth ?? undefined}
          trendLabel="across all branches"
          loading={loading}
          colorClass="bg-orange-100 dark:bg-orange-950"
        />
      </div>

      {/* ── Charts Row ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-widest">Revenue Trend</h2>
            <p className="text-[10px] text-muted-foreground uppercase font-semibold mt-0.5 opacity-70">
              Monthly revenue & subscriptions
            </p>
          </div>
          <div className="h-64">
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gSubs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" fontSize={9} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontWeight="600" />
                  <YAxis fontSize={9} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontWeight="600" tickFormatter={(v) => `${v}`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                  <Tooltip
                    content={({ active, payload, label }) => active && payload?.length ? (
                      <div className="rounded-xl border bg-card p-3 shadow-xl text-xs">
                        <p className="font-bold uppercase tracking-widest text-primary mb-2">{label}</p>
                        {payload.map((e: any, i: number) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: e.color }} />
                            <span className="text-muted-foreground uppercase text-[9px] font-semibold">{e.name}:</span>
                            <span className="font-bold">{formatCurrency(e.value)}</span>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  />
                  <Area type="monotone" dataKey="total" name="Revenue" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#gTotal)" />
                  <Area type="monotone" dataKey="subscriptions" name="Subscriptions" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#gSubs)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <Activity className="h-8 w-8 opacity-30" />
                <p className="text-sm font-medium">No revenue data available yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Gyms Summary Panel */}
        <div className="rounded-2xl border bg-card p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest">Gym Status</h2>
              <p className="text-[10px] text-muted-foreground uppercase font-semibold mt-0.5 opacity-70">
                All registered branches
              </p>
            </div>
            <Button variant="ghost" size="sm" className="text-xs gap-1" asChild>
              <Link href="/super-admin/gyms">
                View all <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          </div>

          <div className="flex flex-col gap-2 flex-1 overflow-y-auto max-h-56">
            {gymsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
              ))
            ) : gyms.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 gap-2 text-muted-foreground py-8">
                <Globe className="h-8 w-8 opacity-30" />
                <p className="text-xs font-medium">No gyms registered yet</p>
              </div>
            ) : (
              gyms.slice(0, 8).map((gym) => (
                <div
                  key={String(gymKey(gym))}
                  className="flex items-center gap-3 rounded-xl bg-muted/40 px-3 py-2.5 hover:bg-muted/70 transition-colors"
                >
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                      {gym.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{gym.name}</p>
                    {gym.address && (
                      <p className="text-[10px] text-muted-foreground truncate">{gym.address}</p>
                    )}
                  </div>
                  <GymStatusIcon status={gym.status} />
                </div>
              ))
            )}
          </div>

          {/* Summary counts */}
          {!gymsLoading && gyms.length > 0 && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t">
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/50 p-2 text-center">
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {gyms.filter(g => !g.status || g.status.toLowerCase() === "active").length}
                </p>
                <p className="text-[9px] font-bold uppercase text-emerald-600/70 dark:text-emerald-400/70">Active</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-2 text-center">
                <p className="text-lg font-bold">{gyms.length}</p>
                <p className="text-[9px] font-bold uppercase text-muted-foreground">Total</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Gyms Table ───────────────────────────── */}
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest">Gym Tenants</h2>
            <p className="text-[10px] text-muted-foreground uppercase font-semibold mt-0.5 opacity-70">
              All registered gym branches on the platform
            </p>
          </div>
          <Button variant="outline" size="sm" className="text-xs gap-1" asChild>
            <Link href="/super-admin/gyms">
              Manage <ExternalLink className="h-3 w-3" />
            </Link>
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 text-muted-foreground border-b">
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Gym Name</th>
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest hidden sm:table-cell">Contact</th>
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest hidden md:table-cell">Tenant ID</th>
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest hidden lg:table-cell">Joined</th>
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {gymsLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-5 py-3">
                        <div className="h-4 animate-pulse rounded bg-muted" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : gyms.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Building2 className="h-8 w-8 opacity-30" />
                      <p className="text-sm font-medium">No gyms registered yet.</p>
                      <Button size="sm" asChild className="mt-2">
                        <Link href="/super-admin/gyms">Add First Gym</Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                gyms.map((gym) => (
                  <tr key={String(gymKey(gym))} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                            {gym.name?.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm leading-tight">{gym.name}</p>
                          {gym.address && (
                            <p className="text-[10px] text-muted-foreground">{gym.address}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <div className="text-xs">
                        {gym.email && <p>{gym.email}</p>}
                        {gym.phone && <p className="text-muted-foreground">{gym.phone}</p>}
                        {!gym.email && !gym.phone && <span className="text-muted-foreground">—</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono opacity-60">
                        {(gym._id ?? String(gym.id ?? ""))?.substring(0, 10) || "—"}
                      </code>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <span className="text-xs text-muted-foreground">
                        {gym.created_at ? formatDate(gym.created_at) : "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <GymStatusBadge status={gym.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <ActionMenu 
                        items={[
                          { id: "map", label: "Map Subscriptions", icon: Link01Icon },
                          { 
                            id: "toggle-status", 
                            label: gym.status === "Active" ? "Mark Inactive" : "Mark Active", 
                            icon: gym.status === "Active" ? ViewOffIcon : CheckmarkCircle01Icon 
                          },
                          { id: "delete", label: "Delete Gym", icon: Delete01Icon, variant: "destructive" },
                        ]} 
                        onAction={(id) => handleAction(String(gym._id || gym.id), id)} 
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {gyms.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t bg-muted/20 text-xs text-muted-foreground">
            <span>Showing {gyms.length} of {gyms.length} branches</span>
            <Button variant="ghost" size="sm" className="text-xs" asChild>
              <Link href="/super-admin/gyms">View all gyms →</Link>
            </Button>
          </div>
        )}
      </div>

      <ConfirmModal
        open={confirmConfig.open}
        onOpenChange={(open) => setConfirmConfig(prev => ({ ...prev, open }))}
        title={confirmConfig.title}
        description={confirmConfig.description}
        onConfirm={confirmConfig.onConfirm}
        variant={confirmConfig.variant}
        confirmText={confirmConfig.variant === "destructive" ? "Delete Branch" : "Confirm"}
      />
    </div>
  )
}

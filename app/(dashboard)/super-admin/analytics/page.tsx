"use client"

import * as React from "react"
import {
  TrendingUp, TrendingDown, Users, CreditCard,
  Building2, Activity, ArrowUpRight, ArrowDownRight, RefreshCw
} from "lucide-react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend
} from "recharts"

import { api } from "@/lib/api-client"
import { formatCurrency, cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// ─── Types ──────────────────────────────────────────────────────────────────

interface Stats {
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

interface RevenuePoint {
  name: string
  total: number
  subscriptions: number
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function KpiCard({
  title,
  value,
  icon: Icon,
  trend,
  sub,
  loading,
  iconBg,
}: {
  title: string
  value: string | number
  icon: React.ElementType
  trend?: number | null
  sub?: string
  loading?: boolean
  iconBg?: string
}) {
  const pos = (trend ?? 0) >= 0
  return (
    <div className="relative flex flex-col gap-3 rounded-2xl border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 overflow-hidden group">
      <div className="absolute inset-0 bg-primary/3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{title}</p>
        <div className={cn("rounded-xl p-2 transition-all duration-300 group-hover:scale-110", iconBg ?? "bg-primary/10")}>
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <div className="flex items-end justify-between gap-2">
        {loading ? (
          <div className="h-8 w-24 animate-pulse rounded-lg bg-muted" />
        ) : (
          <p className="text-2xl font-bold tracking-tight">{value}</p>
        )}
        {trend != null && !loading && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full",
            pos ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400"
                : "text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400"
          )}>
            {pos ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      {sub && !loading && <p className="text-[10px] text-muted-foreground font-medium">{sub}</p>}
    </div>
  )
}

const CHART_COLORS = ["hsl(var(--primary))", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"]

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [stats, setStats] = React.useState<Stats | null>(null)
  const [revenueData, setRevenueData] = React.useState<RevenuePoint[]>([])
  const [loading, setLoading] = React.useState(true)
  const [lastRefreshed, setLastRefreshed] = React.useState(new Date())

  const fetchAll = React.useCallback(async () => {
    setLoading(true)
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const [s, rev] = await Promise.allSettled([
        api.get("/super-admin/stats", { token }),
        api.get("/dashboard/revenue-chart", { token }),
      ])

      if (s.status === "fulfilled") setStats(s.value)
      if (rev.status === "fulfilled") {
        const raw = rev.value
        setRevenueData(Array.isArray(raw) ? raw : raw?.data ?? [])
      }
    } catch (e) {
      console.error("Analytics fetch failed", e)
    } finally {
      setLoading(false)
      setLastRefreshed(new Date())
    }
  }, [])

  React.useEffect(() => { fetchAll() }, [fetchAll])

  // Derived pie data from stats
  const gymPieData = stats ? [
    { name: "Active", value: stats.active_gyms ?? 0 },
    { name: "Inactive", value: (stats.total_gyms ?? 0) - (stats.active_gyms ?? 0) },
  ] : []

  const hasRevData = revenueData.length > 0

  return (
    <div className="flex flex-col gap-6 pb-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Platform Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Deep dive into platform growth, revenue, and subscription trends.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground hidden sm:block">
            Updated {lastRefreshed.toLocaleTimeString()}
          </span>
          <Button variant="outline" size="sm" className="gap-2 text-xs" onClick={fetchAll}>
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Gyms" value={stats?.total_gyms ?? 0} icon={Building2}
          trend={stats?.gym_growth} sub="registered branches" loading={loading}
          iconBg="bg-blue-100 dark:bg-blue-950" />
        <KpiCard title="Total Revenue" value={stats?.total_revenue ? formatCurrency(stats.total_revenue) : "—"}
          icon={CreditCard} trend={stats?.revenue_growth} sub="all time payments" loading={loading}
          iconBg="bg-emerald-100 dark:bg-emerald-950" />
        <KpiCard title="Subscriptions" value={stats?.active_subscriptions ?? 0} icon={TrendingUp}
          trend={stats?.subs_growth} sub="active plans" loading={loading}
          iconBg="bg-purple-100 dark:bg-purple-950" />
        <KpiCard title="Total Members" value={stats?.total_members ?? 0} icon={Users}
          trend={stats?.member_growth} sub="across all branches" loading={loading}
          iconBg="bg-orange-100 dark:bg-orange-950" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-widest">Revenue Trend</h2>
            <p className="text-[10px] text-muted-foreground uppercase font-semibold mt-0.5 opacity-70">
              Last 6 months — revenue vs subscriptions
            </p>
          </div>
          <div className="h-64">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : hasRevData ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="aTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="aSubs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" fontSize={9} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontWeight="600" />
                  <YAxis fontSize={9} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontWeight="600" />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                  <Tooltip content={({ active, payload, label }) =>
                    active && payload?.length ? (
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
                  <Area type="monotone" dataKey="total" name="Revenue" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#aTotal)" />
                  <Area type="monotone" dataKey="subscriptions" name="Subscriptions" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#aSubs)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <Activity className="h-8 w-8 opacity-30" />
                <p className="text-sm font-medium">No revenue data yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Gym Status Pie */}
        <div className="rounded-2xl border bg-card p-5 shadow-sm flex flex-col">
          <div className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-widest">Gym Status</h2>
            <p className="text-[10px] text-muted-foreground uppercase font-semibold mt-0.5 opacity-70">
              Active vs inactive branches
            </p>
          </div>
          <div className="flex-1 flex items-center justify-center h-52">
            {loading ? (
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            ) : (stats?.total_gyms ?? 0) > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={gymPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                    paddingAngle={4} dataKey="value" stroke="none">
                    {gymPieData.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? "hsl(var(--primary))" : "hsl(var(--muted))"} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => [v, ""]} />
                  <Legend formatter={(v) => <span className="text-[10px] font-bold uppercase tracking-widest">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Building2 className="h-8 w-8 opacity-30" />
                <p className="text-xs font-medium">No gym data</p>
              </div>
            )}
          </div>
          {!loading && stats && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t mt-2">
              <div className="rounded-lg bg-primary/10 p-2 text-center">
                <p className="text-lg font-bold text-primary">{stats.active_gyms ?? 0}</p>
                <p className="text-[9px] font-bold uppercase text-primary/70">Active</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-2 text-center">
                <p className="text-lg font-bold">{(stats.total_gyms ?? 0) - (stats.active_gyms ?? 0)}</p>
                <p className="text-[9px] font-bold uppercase text-muted-foreground">Inactive</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Charts Row 2 — Bar Chart */}
      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-widest">Monthly Subscription Volume</h2>
          <p className="text-[10px] text-muted-foreground uppercase font-semibold mt-0.5 opacity-70">
            New subscriptions per month
          </p>
        </div>
        <div className="h-52">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : hasRevData ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis dataKey="name" fontSize={9} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontWeight="600" />
                <YAxis fontSize={9} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontWeight="600" />
                <Tooltip
                  content={({ active, payload, label }) =>
                    active && payload?.length ? (
                      <div className="rounded-xl border bg-card p-3 shadow-xl text-xs">
                        <p className="font-bold uppercase tracking-widest text-primary mb-1">{label}</p>
                        <p className="font-semibold">{payload[0].value} subscriptions</p>
                      </div>
                    ) : null}
                />
                <Bar dataKey="subscriptions" name="Subscriptions" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <TrendingUp className="h-8 w-8 opacity-30" />
              <p className="text-sm font-medium">No subscription data yet</p>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

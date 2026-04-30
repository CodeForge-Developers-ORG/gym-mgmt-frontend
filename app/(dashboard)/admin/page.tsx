"use client"

import * as React from "react"
import Link from "next/link"
import {
  Users, Activity, TrendingUp, CreditCard, Dumbbell,
  ArrowUpRight, ArrowDownRight, MoreHorizontal, ExternalLink,
  RefreshCw, CheckCircle2, AlertCircle, Clock, Calendar,
  UserPlus, Search
} from "lucide-react"
import { ActionMenu, type ActionMenuItem } from "@/components/ui/action-menu"
import { 
  Delete01Icon, 
  ViewOffIcon, 
  UserGroupIcon,
  CheckmarkCircle01Icon,
  SettingsIcon,
  Money01Icon
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SlideInText } from "@/components/ui/slide-in-text"

// ─── Types ─────────────────────────────────────────────────────────────────

interface AdminStats {
  total_members: number
  member_growth: number
  active_trainers: number
  trainer_growth: number
  monthly_revenue: number
  revenue_growth: number
  daily_attendance: number
  attendance_growth: number
}

interface Member {
  id: string
  name: string
  email: string
  plan: string
  status: string
  joined_at: string
  last_checkin?: string
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
  prefix
}: {
  title: string
  value: string | number
  icon: React.ElementType
  trend?: number
  trendLabel?: string
  loading?: boolean
  colorClass?: string
  prefix?: string
}) {
  const isPositive = (trend ?? 0) >= 0

  return (
    <div className="relative flex flex-col gap-3 rounded-2xl border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 overflow-hidden group">
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
          <p className="text-2xl font-bold tracking-tight">{prefix}{value}</p>
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

function MemberStatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase()
  if (s === "active") return <Badge variant="success" className="text-[10px]">Active</Badge>
  if (s === "expired") return <Badge variant="destructive" className="text-[10px]">Expired</Badge>
  return <Badge variant="outline" className="text-[10px]">Pending</Badge>
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [stats, setStats] = React.useState<AdminStats | null>(null)
  const [members, setMembers] = React.useState<Member[]>([])
  const [revenueData, setRevenueData] = React.useState<any[]>([])
  const [liveFeed, setLiveFeed] = React.useState<any[]>([])
  const [currencyCode, setCurrencyCode] = React.useState("USD")
  const [loading, setLoading] = React.useState(true)
  const [lastRefreshed, setLastRefreshed] = React.useState(new Date())
  const toast = useToast()

  const fetchDashboardData = React.useCallback(async () => {
    setLoading(true)
    try {
      const userStr = localStorage.getItem("user")
      if (!userStr) return
      const user = JSON.parse(userStr)

      // Fetch Gym for currency
      api.get("/gym/my-gym").then(gymData => {
        setCurrencyCode(gymData.currency || "USD")
      })

      // Fetch real stats
      api.get("/dashboard/admin/stats").then(setStats).catch(() => {
        setStats({
          total_members: 1250, member_growth: 12.5,
          active_trainers: 18, trainer_growth: 5,
          monthly_revenue: 45000, revenue_growth: 8.2,
          daily_attendance: 342, attendance_growth: -2.4
        })
      })

      // Recent Members
      api.get("/members").then(data => {
        setMembers(Array.isArray(data) ? data.slice(0, 4) : data.data?.slice(0, 4) || [])
      })

      // Revenue Chart
      api.get("/dashboard/revenue-chart").then(setRevenueData)

      // Live Feed (Attendance)
      api.get("/gym/attendance/recent").then(setLiveFeed).catch(() => setLiveFeed([]))

    } catch (err) {
      console.error("Dashboard fetch failed", err)
    } finally {
      setLoading(false)
      setLastRefreshed(new Date())
    }
  }, [])

  React.useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  return (
    <div className="flex flex-col gap-6 pb-8">
      
      {/* ── Page Header ───────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <SlideInText text="Branch Overview" />
          <p className="text-sm text-muted-foreground mt-0.5">
            Real-time insights for your gym branch.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground hidden sm:block">
            Synced {lastRefreshed.toLocaleTimeString()}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs"
            onClick={fetchDashboardData}
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            Refresh
          </Button>
          <Button size="sm" className="gap-2 text-xs" asChild>
            <Link href="/admin/members/add">
              <UserPlus className="h-3.5 w-3.5" />
              New Member
            </Link>
          </Button>
        </div>
      </div>

      {/* ── KPI Cards ────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Members"
          value={stats?.total_members ?? "..."}
          icon={Users}
          trend={stats?.member_growth}
          trendLabel="Active members"
          loading={loading}
          colorClass="bg-blue-100 dark:bg-blue-950"
        />
        <StatCard
          title="Monthly Revenue"
          value={stats?.monthly_revenue ? formatCurrency(stats.monthly_revenue, currencyCode) : "..."}
          icon={CreditCard}
          trend={stats?.revenue_growth}
          trendLabel="Current month"
          loading={loading}
          colorClass="bg-emerald-100 dark:bg-emerald-950"
        />
        <StatCard
          title="Avg. Daily Attendance"
          value={stats?.daily_attendance ?? "..."}
          icon={Activity}
          trend={stats?.attendance_growth}
          trendLabel="Check-ins today"
          loading={loading}
          colorClass="bg-purple-100 dark:bg-purple-950"
        />
        <StatCard
          title="Certified Trainers"
          value={stats?.active_trainers ?? "..."}
          icon={Dumbbell}
          trend={stats?.trainer_growth}
          trendLabel="Staff on floor"
          loading={loading}
          colorClass="bg-orange-100 dark:bg-orange-950"
        />
      </div>

      {/* ── Charts & Feed Row ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Performance */}
        <div className="lg:col-span-2 rounded-2xl border bg-card p-6 shadow-sm overflow-hidden relative">
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Growth Performance
            </h2>
            <p className="text-[10px] text-muted-foreground uppercase font-semibold mt-1 opacity-70">
              Revenue & member acquisition trend
            </p>
          </div>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                <YAxis fontSize={10} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <Tooltip
                  content={({ active, payload, label }) => active && payload?.length ? (
                    <div className="rounded-xl border bg-card/95 backdrop-blur-sm p-3 shadow-xl text-xs border-primary/20">
                      <p className="font-bold text-primary mb-2 border-b pb-1">{label}</p>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">Revenue:</span>
                          <span className="font-bold">{formatCurrency(payload[0].value as number)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">Members:</span>
                          <span className="font-bold">{payload[1].value}</span>
                        </div>
                      </div>
                    </div>
                  ) : null}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="members" stroke="#10b981" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions & Recent Check-ins */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="flex-col h-20 gap-2 border-dashed hover:border-primary hover:bg-primary/5 transition-all group" asChild>
                <Link href="/admin/members">
                  <UserPlus className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold">Add Member</span>
                </Link>
              </Button>
              <Button variant="outline" className="flex-col h-20 gap-2 border-dashed hover:border-primary hover:bg-primary/5 transition-all group" asChild>
                <Link href="/admin/schedule">
                  <Calendar className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold">Schedule Class</span>
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex-1 rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-widest">Live Feed</h2>
              <Badge variant="outline" className="animate-pulse bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 border-none px-2 py-0">LIVE</Badge>
            </div>
            <div className="space-y-4">
              {liveFeed.length > 0 ? (
                liveFeed.map((item) => (
                  <div key={item._id || item.id} className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{item.member?.user?.name || "Member"} Checked-in</p>
                      <p className="text-[10px] text-muted-foreground">Access granted at branch entrance</p>
                    </div>
                    <span className="text-[9px] text-muted-foreground">
                      {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center gap-2 opacity-50">
                  <Activity className="h-8 w-8" />
                  <p className="text-xs font-medium">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Members Table ─────────────────── */}
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest">Recent Members</h2>
            <p className="text-[10px] text-muted-foreground uppercase font-semibold mt-1 opacity-70">
              Latest registrations and renewals
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Find member..." 
                className="bg-muted/50 border-none rounded-lg pl-8 pr-4 py-2 text-xs focus:ring-1 focus:ring-primary w-48"
              />
            </div>
            <Button variant="outline" size="sm" className="text-xs" asChild>
              <Link href="/admin/members">View All</Link>
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/30 text-muted-foreground border-b text-[10px] font-bold uppercase tracking-widest">
                <th className="px-6 py-4 text-left">Member</th>
                <th className="px-6 py-4 text-left hidden sm:table-cell">Subscription Plan</th>
                <th className="px-6 py-4 text-left hidden md:table-cell">Joined Date</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}><td colSpan={5} className="px-6 py-4"><div className="h-8 animate-pulse bg-muted rounded-lg" /></td></tr>
                ))
              ) : members.map((member) => (
                <tr key={member.id} className="hover:bg-muted/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                        <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                          {member.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold leading-none mb-1">{member.name}</p>
                        <p className="text-[10px] text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium">{member.plan}</span>
                      <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">Billed Monthly</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-xs text-muted-foreground">{formatDate(member.joined_at)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <MemberStatusBadge status={member.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ActionMenu 
                      items={[
                        { id: "edit", label: "Edit Member", icon: SettingsIcon },
                        { id: "payments", label: "Payment History", icon: Money01Icon },
                        { id: "delete", label: "Terminate", icon: Delete01Icon, variant: "destructive" },
                      ]} 
                      onAction={(id) => toast.info("Action", `Performing ${id} for ${member.name}`)} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

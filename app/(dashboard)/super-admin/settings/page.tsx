"use client"

import * as React from "react"
import {
  User, Lock, Camera, Eye, EyeOff, Save, Shield,
  Globe, Plug, Loader2, ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api-client"
import { cn } from "@/lib/utils"
import { useToast } from "@/context/toast-context"

// ─── Constants ───────────────────────────────────────────────────────────────

const CURRENCIES = [
  { value: "INR", label: "INR — Indian Rupee (₹)" },
  { value: "PKR", label: "PKR — Pakistani Rupee (₨)" },
  { value: "USD", label: "USD — US Dollar ($)" },
  { value: "EUR", label: "EUR — Euro (€)" },
  { value: "GBP", label: "GBP — Pound Sterling (£)" },
  { value: "AED", label: "AED — UAE Dirham (د.إ)" },
]

const TIMEZONES = [
  { value: "Asia/Kolkata", label: "IST — India Standard Time (GMT+5:30)" },
  { value: "Asia/Karachi", label: "PKT — Pakistan Time (GMT+5)" },
  { value: "UTC", label: "UTC — Coordinated Universal Time (GMT+0)" },
  { value: "America/New_York", label: "EST — Eastern Time (GMT-5)" },
  { value: "America/Los_Angeles", label: "PST — Pacific Time (GMT-8)" },
  { value: "Europe/London", label: "GMT — Greenwich Mean Time (GMT+0)" },
  { value: "Asia/Dubai", label: "GST — Gulf Standard Time (GMT+4)" },
]

const STORAGE_KEY = "platform_settings"

function loadSettings() {
  if (typeof window === "undefined") return null
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") } catch { return null }
}

// ─── Helper Components ───────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      {children}
    </div>
  )
}

function StyledSelect({ value, onChange, options, id }: {
  value: string; onChange: (v: string) => void
  options: { value: string; label: string }[]; id?: string
}) {
  return (
    <select id={id} value={value} onChange={e => onChange(e.target.value)}
      className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

// ─── Nav Tabs ─────────────────────────────────────────────────────────────────

const TABS = [
  { key: "profile", label: "Profile", icon: User },
  { key: "security", label: "Security", icon: Lock },
  { key: "platform", label: "Platform", icon: Globe },
  { key: "integrations", label: "Integrations", icon: Plug },
] as const

type TabKey = typeof TABS[number]["key"]

// ─── Main ────────────────────────────────────────────────────────────────────

export default function SuperAdminSettingsPage() {
  const [tab, setTab] = React.useState<TabKey>("profile")
  const toast = useToast()

  // ── User ──────────────────────────────────────────────────────────────────
  const [user, setUser] = React.useState<any>(null)
  const [profileName, setProfileName] = React.useState("")
  const [profileEmail, setProfileEmail] = React.useState("")
  const [profileLoading, setProfileLoading] = React.useState(false)

  // ── Avatar ────────────────────────────────────────────────────────────────
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null)
  const [avatarLoading, setAvatarLoading] = React.useState(false)
  const fileRef = React.useRef<HTMLInputElement>(null)

  // ── Password ──────────────────────────────────────────────────────────────
  const [currentPw, setCurrentPw] = React.useState("")
  const [newPw, setNewPw] = React.useState("")
  const [confirmPw, setConfirmPw] = React.useState("")
  const [showCurrent, setShowCurrent] = React.useState(false)
  const [showNew, setShowNew] = React.useState(false)
  const [pwLoading, setPwLoading] = React.useState(false)

  // ── Security ──────────────────────────────────────────────────────────────
  const [require2fa, setRequire2fa] = React.useState(false)
  const [sessionTimeout, setSessionTimeout] = React.useState("60")

  // ── Platform (dynamic, persisted) ─────────────────────────────────────────
  const [platformName, setPlatformName] = React.useState("Staff Khata Gym Management")
  const [supportEmail, setSupportEmail] = React.useState("support@staffkhata.com")
  const [currency, setCurrency] = React.useState("INR")
  const [timezone, setTimezone] = React.useState("Asia/Kolkata")
  const [platformLoading, setPlatformLoading] = React.useState(false)

  // Load on mount — API first, localStorage as fallback
  React.useEffect(() => {
    const raw = localStorage.getItem("user")
    if (raw) {
      const u = JSON.parse(raw)
      setUser(u)
      setProfileName(u.name ?? u.fullName ?? "")
      setProfileEmail(u.email ?? "")
    }

    const token = localStorage.getItem("token")
    api.get("/super-admin/platform-settings", { token: token ?? undefined })
      .then((data: any) => {
        if (data.platform_name) setPlatformName(data.platform_name)
        if (data.support_email) setSupportEmail(data.support_email)
        if (data.currency)      setCurrency(data.currency)
        if (data.timezone)      setTimezone(data.timezone)
        if (data.require_2fa !== undefined) setRequire2fa(data.require_2fa)
        if (data.session_timeout) setSessionTimeout(String(data.session_timeout))
        
        // Also cache locally
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          platformName: data.platform_name,
          supportEmail: data.support_email,
          currency:     data.currency,
          timezone:     data.timezone,
          require2fa:   data.require_2fa,
          sessionTimeout: data.session_timeout,
        }))
      })
      .catch(() => {
        // Fallback: use localStorage if API fails
        const saved = loadSettings()
        if (saved) {
          if (saved.platformName) setPlatformName(saved.platformName)
          if (saved.supportEmail) setSupportEmail(saved.supportEmail)
          if (saved.currency)     setCurrency(saved.currency)
          if (saved.timezone)     setTimezone(saved.timezone)
        }
      })
  }, [])

  const initials = (profileName || "SA").split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)

  // ── Handlers ──────────────────────────────────────────────────────────────

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault()
    setProfileLoading(true)
    const token = localStorage.getItem("token")
    try {
      const res = await api.patch("/auth/profile", { name: profileName, email: profileEmail }, { token: token ?? undefined })
      
      const updatedUser = res.user || { ...user, name: profileName, email: profileEmail }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      window.dispatchEvent(new Event("user-updated"))
      toast.success("Profile Updated", "Your account information has been saved successfully.")
    } catch (err: any) {
      toast.error("Update Failed", err.message ?? "Failed to update profile.")
    } finally {
      setProfileLoading(false)
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    if (newPw !== confirmPw) { toast.error("New passwords do not match."); return }
    if (newPw.length < 8) { toast.error("Password must be at least 8 characters."); return }
    setPwLoading(true)
    const token = localStorage.getItem("token")
    try {
      await api.patch("/auth/change-password", { current_password: currentPw, password: newPw, password_confirmation: confirmPw }, { token: token ?? undefined })
      toast.success("Password changed successfully.")
      setCurrentPw(""); setNewPw(""); setConfirmPw("")
    } catch (err: any) {
      toast.error(err.message ?? "Failed to change password.")
    } finally {
      setPwLoading(false)
    }
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatarPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function handleAvatarUpload() {
    const file = fileRef.current?.files?.[0]
    if (!file) { toast.error("Please select a file first."); return }
    setAvatarLoading(true)
    const token = localStorage.getItem("token")
    try {
      const fd = new FormData(); fd.append("avatar", file)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/avatar`, {
        method: "POST", 
        headers: { Authorization: `Bearer ${token}` }, 
        body: fd,
      })
      
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Upload failed")
      
      // Update local state and localStorage
      const updatedUser = data.user
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      window.dispatchEvent(new Event("user-updated"))
      setAvatarPreview(null) 
      
      toast.success("Photo Updated", "Your profile picture has been changed.")
    } catch (err: any) {
      toast.error("Upload Failed", err.message ?? "Failed to upload image.")
    } finally {
      setAvatarLoading(false)
    }
  }

  function handlePlatformSave(e: React.FormEvent) {
    e.preventDefault()
    setPlatformLoading(true)
    const token = localStorage.getItem("token")
    const payload = {
      platform_name:   platformName,
      support_email:   supportEmail,
      currency,
      timezone,
      require_2fa:     require2fa,
      session_timeout: parseInt(sessionTimeout),
    }
    
    // Using the loadingWithSuccess pattern
    const loadingId = toast.loading("Updating Settings", "Saving your platform configuration to the cloud...")
    
    api.put("/super-admin/platform-settings", payload, { token: token ?? undefined })
      .then(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          platformName, supportEmail, currency, timezone,
        }))
        toast.removeNotification(loadingId)
        toast.success("Settings Saved", "Platform configuration updated successfully.")
      })
      .catch((err: any) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          platformName, supportEmail, currency, timezone,
        }))
        toast.removeNotification(loadingId)
        toast.error("Update Failed", err.message ?? "Saved locally — API unavailable.")
      })
      .finally(() => setPlatformLoading(false))
  }

  const pwStrength = newPw.length === 0 ? 0 : newPw.length < 6 ? 1 : newPw.length < 10 ? 2 : newPw.length < 14 ? 3 : 4

  return (
    <div className="flex flex-col gap-0 pb-8 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account, security, and platform configuration.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── Sidebar Nav ────────────────────────────────────── */}
        <aside className="lg:w-56 shrink-0">
          <nav className="flex lg:flex-col gap-1">
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all w-full text-left",
                  tab === t.key
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}>
                <t.icon className="h-4 w-4 shrink-0" />
                {t.label}
                {tab === t.key && <ChevronRight className="h-3.5 w-3.5 ml-auto" />}
              </button>
            ))}
          </nav>
        </aside>

        {/* ── Content ────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col gap-5 min-w-0">

          {/* PROFILE TAB */}
          {tab === "profile" && <>
            {/* Avatar Card */}
            <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b">
                <p className="text-sm font-bold uppercase tracking-widest">Profile Picture</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 uppercase font-semibold opacity-60">Shown across the platform</p>
              </div>
              <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
                  <Avatar className="h-20 w-20 border-4 border-primary/20 shadow-lg">
                    <AvatarImage src={avatarPreview ?? user?.avatar} />
                    <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="flex flex-col gap-3 flex-1">
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  <div className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => fileRef.current?.click()}>
                    <p className="text-xs font-medium text-muted-foreground">
                      {avatarPreview ? "✓ Image selected — click Upload to save" : "Click to choose a photo"}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">PNG, JPG up to 2MB</p>
                  </div>
                  <Button onClick={handleAvatarUpload} disabled={!avatarPreview || avatarLoading} size="sm" className="self-start gap-2">
                    {avatarLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
                    {avatarLoading ? "Uploading..." : "Upload Photo"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b">
                <p className="text-sm font-bold uppercase tracking-widest">Account Information</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 uppercase font-semibold opacity-60">Update your name and email</p>
              </div>
              <form onSubmit={handleProfileSave} className="p-6 flex flex-col gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Full Name">
                    <Input value={profileName} onChange={e => setProfileName(e.target.value)} placeholder="Your full name" className="h-11" />
                  </Field>
                  <Field label="Email Address">
                    <Input type="email" value={profileEmail} onChange={e => setProfileEmail(e.target.value)} placeholder="you@example.com" className="h-11" />
                  </Field>
                </div>
                <div className="flex justify-end pt-2 border-t">
                  <Button type="submit" disabled={profileLoading} className="gap-2">
                    {profileLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {profileLoading ? "Saving..." : "Save Profile"}
                  </Button>
                </div>
              </form>
            </div>
          </>}

          {/* SECURITY TAB */}
          {tab === "security" && <>
            <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b">
                <p className="text-sm font-bold uppercase tracking-widest">Change Password</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 uppercase font-semibold opacity-60">Use a strong unique password</p>
              </div>
              <form onSubmit={handlePasswordChange} className="p-6 flex flex-col gap-4">
                <Field label="Current Password">
                  <div className="relative">
                    <Input type={showCurrent ? "text" : "password"} value={currentPw} onChange={e => setCurrentPw(e.target.value)}
                      placeholder="Enter current password" className="h-11 pr-10" required />
                    <button type="button" onClick={() => setShowCurrent(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </Field>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="New Password">
                    <div className="relative">
                      <Input type={showNew ? "text" : "password"} value={newPw} onChange={e => setNewPw(e.target.value)}
                        placeholder="Min. 8 characters" className="h-11 pr-10" required />
                      <button type="button" onClick={() => setShowNew(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {newPw.length > 0 && (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex gap-1 flex-1">
                          {[1,2,3,4].map(i => (
                            <div key={i} className={cn("h-1 flex-1 rounded-full transition-colors",
                              pwStrength >= i
                                ? pwStrength <= 1 ? "bg-red-400" : pwStrength === 2 ? "bg-amber-400" : pwStrength === 3 ? "bg-blue-400" : "bg-emerald-400"
                                : "bg-muted"
                            )} />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground">
                          {["", "Weak", "Fair", "Good", "Strong"][pwStrength]}
                        </span>
                      </div>
                    )}
                  </Field>
                  <Field label="Confirm New Password">
                    <Input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                      placeholder="Repeat new password" className={cn("h-11", confirmPw && newPw !== confirmPw && "border-red-400 focus-visible:ring-red-400/30")} required />
                    {confirmPw && newPw !== confirmPw && <p className="text-[10px] text-red-500 font-semibold mt-1">Passwords do not match</p>}
                  </Field>
                </div>
                <div className="flex justify-end pt-2 border-t">
                  <Button type="submit" disabled={pwLoading} className="gap-2">
                    {pwLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                    {pwLoading ? "Changing..." : "Change Password"}
                  </Button>
                </div>
              </form>
            </div>

            <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b">
                <p className="text-sm font-bold uppercase tracking-widest">Security Policies</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 uppercase font-semibold opacity-60">Platform-wide enforcement rules</p>
              </div>
              <div className="p-6 flex flex-col gap-5">
                <div className="flex items-center justify-between gap-4 py-3 border-b">
                  <div>
                    <p className="text-sm font-semibold">Require 2FA for Admins</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Force all branch admins to use Two-Factor Authentication.</p>
                  </div>
                  <Switch checked={require2fa} onCheckedChange={setRequire2fa} />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">Session Timeout</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Auto-logout inactive users after this duration.</p>
                  </div>
                  <StyledSelect value={sessionTimeout} onChange={setSessionTimeout} options={[
                    { value: "30", label: "30 minutes" },
                    { value: "60", label: "1 hour" },
                    { value: "240", label: "4 hours" },
                    { value: "1440", label: "24 hours" },
                  ]} />
                </div>
              </div>
            </div>
          </>}

          {/* PLATFORM TAB */}
          {tab === "platform" && (
            <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b">
                <p className="text-sm font-bold uppercase tracking-widest">Platform Configuration</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 uppercase font-semibold opacity-60">Global SaaS settings — saved to your browser</p>
              </div>
              <form onSubmit={handlePlatformSave} className="p-6 flex flex-col gap-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Platform Name">
                    <Input value={platformName} onChange={e => setPlatformName(e.target.value)} className="h-11" placeholder="Platform name" />
                  </Field>
                  <Field label="Support Email">
                    <Input type="email" value={supportEmail} onChange={e => setSupportEmail(e.target.value)} className="h-11" placeholder="support@example.com" />
                  </Field>
                </div>

                <Field label="Default Currency">
                  <StyledSelect value={currency} onChange={setCurrency} options={CURRENCIES} />
                  <p className="text-[10px] text-muted-foreground mt-1 font-medium">
                    Selected: <strong>{CURRENCIES.find(c => c.value === currency)?.label}</strong>
                  </p>
                </Field>

                <Field label="Timezone">
                  <StyledSelect value={timezone} onChange={setTimezone} options={TIMEZONES} />
                  <p className="text-[10px] text-muted-foreground mt-1 font-medium">
                    Current local time:{" "}
                    <strong>
                      {new Date().toLocaleString("en-IN", { timeZone: timezone, dateStyle: "medium", timeStyle: "short" })}
                    </strong>
                  </p>
                </Field>

                <div className="flex justify-end pt-2 border-t">
                  <Button type="submit" disabled={platformLoading} className="gap-2">
                    {platformLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {platformLoading ? "Saving..." : "Save Configuration"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* INTEGRATIONS TAB */}
          {tab === "integrations" && <>
            <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b">
                <p className="text-sm font-bold uppercase tracking-widest">Payment Gateways</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 uppercase font-semibold opacity-60">Billing integrations for subscriptions</p>
              </div>
              <div className="p-6 flex flex-col gap-3">
                {[
                  { name: "Stripe Connect", desc: "Credit card processing & recurring billing", connected: false },
                  { name: "PayPal Business", desc: "PayPal payments & invoice management", connected: false },
                  { name: "Razorpay", desc: "Indian payment gateway (UPI, cards, netbanking)", connected: false },
                ].map(g => (
                  <div key={g.name} className="flex items-center justify-between rounded-xl border bg-muted/20 p-4 hover:bg-muted/40 transition-colors">
                    <div>
                      <p className="font-semibold text-sm">{g.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{g.desc}</p>
                      <div className="flex items-center gap-1 mt-1.5">
                        {g.connected
                          ? <Badge variant="success" className="text-[9px]">Connected</Badge>
                          : <Badge variant="outline" className="text-[9px] text-muted-foreground">Not connected</Badge>}
                      </div>
                    </div>
                    <Button variant={g.connected ? "outline" : "secondary"} size="sm">{g.connected ? "Configure" : "Connect"}</Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b">
                <p className="text-sm font-bold uppercase tracking-widest">API Keys</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 uppercase font-semibold opacity-60">Third-party integration credentials</p>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <Field label="Production Webhook Secret">
                  <div className="flex gap-2">
                    <Input type="password" defaultValue="whsec_placeholder" readOnly className="h-11 font-mono" />
                    <Button variant="outline" className="shrink-0">Reveal</Button>
                  </div>
                </Field>
                <div className="flex justify-end pt-2 border-t">
                  <Button variant="destructive" size="sm" className="gap-2">
                    <Shield className="h-3.5 w-3.5" /> Regenerate Keys
                  </Button>
                </div>
              </div>
            </div>
          </>}

        </div>
      </div>
    </div>
  )
}

"use client"

import * as React from "react"
import {
  User, Lock, Camera, Save, Shield,
  Globe, Loader2, ChevronRight, Building, Phone, Mail, MapPin, Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { api } from "@/lib/api-client"
import { cn } from "@/lib/utils"
import { useToast } from "@/context/toast-context"
import { SlideInText } from "@/components/ui/slide-in-text"

// ─── Helper Components ───────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      {children}
    </div>
  )
}

// ─── Nav Tabs ─────────────────────────────────────────────────────────────────

const TABS = [
  { key: "profile", label: "My Profile", icon: User },
  { key: "branch", label: "Branch Details", icon: Building },
  { key: "security", label: "Security", icon: Lock },
] as const

type TabKey = typeof TABS[number]["key"]

// ─── Main ────────────────────────────────────────────────────────────────────

export default function AdminSettingsPage() {
  const [tab, setTab] = React.useState<TabKey>("profile")
  const toast = useToast()

  // ── User ──────────────────────────────────────────────────────────────────
  const [user, setUser] = React.useState<any>(null)
  const [profileName, setProfileName] = React.useState("")
  const [profileEmail, setProfileEmail] = React.useState("")
  const [profileLoading, setProfileLoading] = React.useState(false)

  // ── Branch ────────────────────────────────────────────────────────────────
  const [gym, setGym] = React.useState<any>(null)
  const [gymName, setGymName] = React.useState("")
  const [gymEmail, setGymEmail] = React.useState("")
  const [gymPhone, setGymPhone] = React.useState("")
  const [gymAddress, setGymAddress] = React.useState("")
  const [gymCurrency, setGymCurrency] = React.useState("USD")
  const [gymLoading, setGymLoading] = React.useState(false)

  // ── Avatar ────────────────────────────────────────────────────────────────
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null)
  const [avatarLoading, setAvatarLoading] = React.useState(false)
  const fileRef = React.useRef<HTMLInputElement>(null)

  // ── Password ──────────────────────────────────────────────────────────────
  const [currentPw, setCurrentPw] = React.useState("")
  const [newPw, setNewPw] = React.useState("")
  const [confirmPw, setConfirmPw] = React.useState("")
  const [pwLoading, setPwLoading] = React.useState(false)

  // Load on mount
  React.useEffect(() => {
    const raw = localStorage.getItem("user")
    if (raw) {
      const u = JSON.parse(raw)
      setUser(u)
      setProfileName(u.name ?? "")
      setProfileEmail(u.email ?? "")
    }

    // Fetch Gym details
    api.get("/gym/my-gym").then(data => {
      setGym(data)
      setGymName(data.name || "")
      setGymEmail(data.email || "")
      setGymPhone(data.phone || "")
      setGymAddress(data.address || "")
      setGymCurrency(data.currency || "USD")
    }).catch(err => console.error("Failed to fetch gym", err))
  }, [])

  const initials = (profileName || "AD").split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)

  // ── Handlers ──────────────────────────────────────────────────────────────

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault()
    setProfileLoading(true)
    try {
      const res = await api.patch("/auth/profile", { name: profileName, email: profileEmail })
      const updatedUser = res.user || { ...user, name: profileName, email: profileEmail }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      window.dispatchEvent(new Event("user-updated"))
      toast.success("Profile Updated")
    } catch (err: any) {
      toast.error("Update Failed", err.message)
    } finally {
      setProfileLoading(false)
    }
  }

  async function handleBranchSave(e: React.FormEvent) {
    e.preventDefault()
    setGymLoading(true)
    try {
      const res = await api.put("/gym/my-gym", {
        name: gymName,
        email: gymEmail,
        phone: gymPhone,
        address: gymAddress,
        currency: gymCurrency
      })
      setGym(res.gym)
      toast.success("Branch Details Saved")
    } catch (err: any) {
      toast.error("Update Failed", err.message)
    } finally {
      setGymLoading(false)
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    if (newPw !== confirmPw) { toast.error("Passwords do not match"); return }
    setPwLoading(true)
    try {
      await api.patch("/auth/change-password", { 
        current_password: currentPw, 
        password: newPw, 
        password_confirmation: confirmPw 
      })
      toast.success("Password changed")
      setCurrentPw(""); setNewPw(""); setConfirmPw("")
    } catch (err: any) {
      toast.error("Error", err.message)
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
    if (!file) return
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
      if (!response.ok) throw new Error(data.message)
      setUser(data.user)
      localStorage.setItem("user", JSON.stringify(data.user))
      window.dispatchEvent(new Event("user-updated"))
      setAvatarPreview(null)
      toast.success("Photo Updated")
    } catch (err: any) {
      toast.error("Upload Failed", err.message)
    } finally {
      setAvatarLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 pb-10 max-w-5xl">
      <div>
        <SlideInText text="Settings" />
        <p className="text-sm text-muted-foreground mt-0.5">Manage your branch, profile, and security preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-60 shrink-0">
          <nav className="flex lg:flex-col gap-1.5">
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all w-full text-left",
                  tab === t.key
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}>
                <t.icon className="h-4 w-4" />
                {t.label}
                {tab === t.key && <ChevronRight className="h-3.5 w-3.5 ml-auto" />}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 flex flex-col gap-6">
          {tab === "profile" && (
            <>
              <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b bg-muted/20">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">Profile Photo</p>
                </div>
                <div className="p-6 flex flex-col sm:flex-row items-center gap-8">
                  <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
                    <Avatar className="h-24 w-24 border-4 border-background shadow-xl ring-2 ring-primary/20">
                      <AvatarImage src={avatarPreview ?? user?.avatar} />
                      <AvatarFallback className="text-2xl font-bold bg-primary/5 text-primary">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-all backdrop-blur-[2px]">
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    <div className="border-2 border-dashed rounded-2xl p-6 text-center hover:bg-muted/30 transition-all cursor-pointer"
                      onClick={() => fileRef.current?.click()}>
                      <p className="text-sm font-medium">{avatarPreview ? "✓ Ready to upload" : "Click to select a new image"}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Recommended: Square image, max 2MB</p>
                    </div>
                    <Button onClick={handleAvatarUpload} disabled={!avatarPreview || avatarLoading} className="gap-2 w-full sm:w-auto">
                      {avatarLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                      Upload Photo
                    </Button>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b bg-muted/20">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">Personal Info</p>
                </div>
                <form onSubmit={handleProfileSave} className="p-6 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Full Name">
                      <Input value={profileName} onChange={e => setProfileName(e.target.value)} className="h-11 rounded-xl" />
                    </Field>
                    <Field label="Email Address">
                      <Input type="email" value={profileEmail} onChange={e => setProfileEmail(e.target.value)} className="h-11 rounded-xl" />
                    </Field>
                  </div>
                  <div className="flex justify-end pt-4 border-t">
                    <Button type="submit" disabled={profileLoading} className="gap-2">
                      {profileLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Update Profile
                    </Button>
                  </div>
                </form>
              </div>
            </>
          )}

          {tab === "branch" && (
            <div className="rounded-2xl border bg-card shadow-sm overflow-hidden animate-fade-in">
              <div className="px-6 py-4 border-b bg-muted/20">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Branch Configuration</p>
              </div>
              <form onSubmit={handleBranchSave} className="p-6 space-y-6">
                <div className="grid gap-6">
                  <Field label="Gym Branch Name">
                    <Input value={gymName} onChange={e => setGymName(e.target.value)} className="h-11 rounded-xl" />
                  </Field>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Support Phone">
                      <Input value={gymPhone} onChange={e => setGymPhone(e.target.value)} className="h-11 rounded-xl" />
                    </Field>
                    <Field label="Support Email">
                      <Input type="email" value={gymEmail} onChange={e => setGymEmail(e.target.value)} className="h-11 rounded-xl" />
                    </Field>
                  </div>

                  <Field label="Base Currency">
                    <select 
                      value={gymCurrency} 
                      onChange={e => setGymCurrency(e.target.value)}
                      className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="USD">USD ($) - US Dollar</option>
                      <option value="EUR">EUR (€) - Euro</option>
                      <option value="GBP">GBP (£) - British Pound</option>
                      <option value="INR">INR (₹) - Indian Rupee</option>
                      <option value="AED">AED (د.إ) - UAE Dirham</option>
                      <option value="SAR">SAR (﷼) - Saudi Riyal</option>
                      <option value="PKR">PKR (Rs) - Pakistani Rupee</option>
                      <option value="BDT">BDT (৳) - Bangladeshi Taka</option>
                    </select>
                    <p className="text-[10px] text-muted-foreground italic mt-1">* This currency will be used for all membership plans and invoices.</p>
                  </Field>

                  <Field label="Physical Address">
                    <textarea 
                      value={gymAddress} 
                      onChange={e => setGymAddress(e.target.value)}
                      className="flex min-h-[100px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </Field>
                </div>
                <div className="flex justify-end pt-4 border-t">
                  <Button type="submit" disabled={gymLoading} className="gap-2">
                    {gymLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Branch Details
                  </Button>
                </div>
              </form>
            </div>
          )}

          {tab === "security" && (
            <div className="rounded-2xl border bg-card shadow-sm overflow-hidden animate-fade-in">
              <div className="px-6 py-4 border-b bg-muted/20">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Password & Security</p>
              </div>
              <form onSubmit={handlePasswordChange} className="p-6 space-y-6">
                <Field label="Current Password">
                  <Input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} className="h-11 rounded-xl" />
                </Field>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="New Password">
                    <Input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} className="h-11 rounded-xl" />
                  </Field>
                  <Field label="Confirm New Password">
                    <Input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} className="h-11 rounded-xl" />
                  </Field>
                </div>
                <div className="flex justify-end pt-4 border-t">
                  <Button type="submit" disabled={pwLoading} className="gap-2">
                    {pwLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                    Change Password
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

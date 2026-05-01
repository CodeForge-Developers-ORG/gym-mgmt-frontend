"use client"

import * as React from "react"
import { 
  Fingerprint, 
  Plus, 
  Settings, 
  RefreshCw, 
  Trash2, 
  Power, 
  Lock, 
  ShieldCheck, 
  Activity,
  Server,
  DoorOpen,
  RotateCcw
} from "lucide-react"
import { useBranch } from "@/context/branch-context"
import { api } from "@/lib/api-client"
import { useToast } from "@/context/toast-context"
import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { SlideInText } from "@/components/ui/slide-in-text"
import { ActionMenu, type ActionMenuItem } from "@/components/ui/action-menu"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function BiometricSetupPage() {
  const { branches } = useBranch()
  const [devices, setDevices] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const toast = useToast()

  const fetchDevices = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await api.get("/biometrics/devices")
      setDevices(Array.isArray(data) ? data : [])
    } catch (err) {
      toast.error("Error", "Failed to fetch biometric devices")
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  React.useEffect(() => {
    fetchDevices()
  }, [fetchDevices])

  const [isVerifying, setIsVerifying] = React.useState(false)
  const [verifiedSerial, setVerifiedSerial] = React.useState<string | null>(null)
  const [serialInput, setSerialInput] = React.useState("")

  const handleVerifyMachine = async () => {
    if (!serialInput) return toast.error("Required", "Please enter the Serial Number first.")
    
    setIsVerifying(true)
    try {
      // Check SDK for this serial
      const response = await api.get(`/biometrics/devices/check/${serialInput}`)
      if (response.connected) {
        setVerifiedSerial(serialInput)
        toast.success("Machine Found", "Hardware is connected and ready for registration.")
      } else {
        toast.error("Not Connected", "Machine not found on the network. Please check the WSS configuration.")
      }
    } catch (err: any) {
      toast.error("Verification Failed", err.message)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!verifiedSerial) return
    
    setIsSubmitting(true)
    const formData = new FormData(e.target as HTMLFormElement)
    const data = Object.fromEntries(formData)
    
    try {
      await api.post("/biometrics/devices", {
        ...data,
        device_id: verifiedSerial
      })
      toast.success("Success", "Device registered and synced.")
      setDialogOpen(false)
      setVerifiedSerial(null)
      setSerialInput("")
      fetchDevices()
    } catch (err: any) {
      toast.error("Registration Failed", err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCommand = async (deviceId: string, command: string) => {
    const loadingId = toast.loading("Executing", `Sending ${command} command to device...`)
    try {
      await api.post(`/biometrics/devices/${deviceId}/command`, { command })
      toast.success("Success", `Command ${command} executed.`)
    } catch (err: any) {
      toast.error("Command Failed", err.message)
    } finally {
      toast.removeNotification(loadingId)
    }
  }

  const handleDelete = async (deviceId: string) => {
    try {
      await api.delete(`/biometrics/devices/${deviceId}`)
      toast.success("Deleted", "Device removed from system.")
      fetchDevices()
    } catch (err: any) {
      toast.error("Error", err.message)
    }
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <SlideInText 
            text="Biometric Machine Setup" 
            className="text-3xl font-black tracking-tight"
          />
          <p className="text-muted-foreground text-sm mt-1">
            Manage your hardware integration and machine-to-user mapping.
          </p>
          <div className="mt-4 p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-3">
            <Server className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-bold text-primary">Machine Configuration URL</p>
              <p className="text-xs text-muted-foreground mt-1">
                Configure your machine with the following WebSocket URL to establish connection:
              </p>
              <code className="mt-2 block p-2 bg-background rounded-lg border text-primary font-mono text-xs">
                wss://machine.staffkhata.com
              </code>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchDevices} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 font-bold shadow-lg shadow-primary/20">
                <Plus className="h-4 w-4" />
                Register Machine
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Register Machine</DialogTitle>
                <DialogDescription>
                  {verifiedSerial 
                    ? "Connectivity verified. Complete the machine details."
                    : "Enter the serial number to verify connection."}
                </DialogDescription>
              </DialogHeader>

              {!verifiedSerial ? (
                <div className="py-6 space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="serial">Serial Number (Device ID)</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="serial" 
                        placeholder="RSS2025..." 
                        value={serialInput}
                        onChange={(e) => setSerialInput(e.target.value)}
                      />
                      <Button onClick={handleVerifyMachine} disabled={isVerifying} type="button">
                        {isVerifying ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Verify"}
                      </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Ensure the machine is powered on and configured with the WSS URL.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAddDevice}>
                  <div className="py-6 space-y-4">
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-2 mb-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-tight">Verified: {verifiedSerial}</span>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="name">Machine Name</Label>
                      <Input id="name" name="name" placeholder="Front Gate Reader" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="branch_id">Mapped Branch</Label>
                      <select name="branch_id" className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" required>
                        {branches.map(branch => (
                          <option key={branch.id || branch._id} value={branch.id || branch._id}>
                            {branch.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setVerifiedSerial(null)} className="mr-auto text-xs">Change Serial</Button>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Registering..." : "Connect Machine"}
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((device) => (
          <Card key={device.id || device._id} className="overflow-hidden border-2 transition-all hover:border-primary/50 group">
            <CardHeader className="pb-4 border-b bg-muted/10">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Fingerprint className="h-5 w-5" />
                </div>
                <Badge variant={device.live_status?.is_online ? "success" : "destructive"}>
                  {device.live_status?.is_online ? "Online" : "Offline"}
                </Badge>
              </div>
              <CardTitle className="mt-4 text-xl">{device.name}</CardTitle>
              <CardDescription className="font-mono text-[10px] uppercase tracking-widest">
                ID: {device.device_id}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Branch</p>
                  <p className="text-sm font-medium">{branches.find(b => (b.id || b._id) === device.branch_id)?.name || "Unknown"}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Users</p>
                  <p className="text-sm font-medium">{device.live_status?.user_count || 0}</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] text-muted-foreground uppercase font-bold border-b pb-1">Hardware Controls</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="justify-start gap-2 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200"
                    onClick={() => handleCommand(device.id || device._id, 'unlock')}
                  >
                    <DoorOpen className="h-3.5 w-3.5" />
                    Open Gate
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="justify-start gap-2 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                    onClick={() => handleCommand(device.id || device._id, 'lockdown')}
                  >
                    <Lock className="h-3.5 w-3.5" />
                    Lockdown
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="justify-start gap-2"
                    onClick={() => handleCommand(device.id || device._id, 'reboot')}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Restart
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="justify-start gap-2"
                    onClick={() => handleDelete(device.id || device._id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {devices.length === 0 && !isLoading && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl bg-muted/5 group hover:bg-muted/10 transition-colors">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Fingerprint className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold">No Machines Linked</h3>
            <p className="text-muted-foreground text-sm max-w-xs text-center mt-2">
              Connect your first StaffKhata biometric machine to start automating access control.
            </p>
            <Button variant="outline" className="mt-6" onClick={() => setDialogOpen(true)}>
              Register Now
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

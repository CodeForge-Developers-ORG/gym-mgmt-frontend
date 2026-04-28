import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Authentication | Staff Khata Gym Management",
  description: "Login to your account",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen w-full flex bg-muted/20">
      {/* Left side - Dynamic branding based on theme */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-12 xl:px-24 bg-gradient-card border-r relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 pattern-dots" />
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-2 mb-12">
            <div className="bg-primary p-2 rounded-xl text-primary-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>
            </div>
            <div className="font-bold text-2xl tracking-tight">
              Fit<span className="text-primary">Pulse</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight mb-6">
            The premium platform for modern fitness businesses.
          </h1>
          <p className="text-lg text-muted-foreground mb-12">
            Manage your members, staff, schedules, and payments all in one place with our comprehensive SaaS solution.
          </p>

          <div className="flex gap-4">
            <div className="rounded-2xl bg-card p-4 border shadow-sm glass flex-1">
              <div className="text-2xl font-bold text-primary mb-1">4.9/5</div>
              <div className="text-sm font-medium">Average Rating</div>
            </div>
            <div className="rounded-2xl bg-card p-4 border shadow-sm glass flex-1">
              <div className="text-2xl font-bold text-primary mb-1">5k+</div>
              <div className="text-sm font-medium">Gyms Trust Us</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 xl:px-24">
        {children}
      </div>
    </div>
  )
}

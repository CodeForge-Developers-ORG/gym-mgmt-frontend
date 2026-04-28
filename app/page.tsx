import Link from "next/link"
import { ArrowRight, CheckCircle2, Dumbbell, BarChart3, Users, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-6 lg:px-8 h-20 flex items-center justify-between border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl tracking-tight">Staff Khata<span className="text-primary font-medium text-sm block">Gym Management</span></span>
        </div>
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
          <Link href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Testimonials</Link>
          <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="hidden sm:inline-flex">Log in</Button>
          </Link>
          <Link href="/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 pattern-dots" />
          
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 blur-[100px] rounded-full" />
          <div className="absolute top-1/2 -left-24 w-72 h-72 bg-info/20 blur-[100px] rounded-full" />
          
          <div className="container px-4 md:px-6 mx-auto relative z-10 text-center">
            <Badge className="mb-6 mx-auto bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
              Introducing Staff Khata 2.0
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 max-w-4xl mx-auto leading-tight">
              The operating system for <span className="text-transparent bg-clip-text gradient-primary">modern gyms</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Manage memberships, automate billing, schedule classes, and empower your trainers all from one beautiful, centralized platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base shadow-xl shadow-primary/25">
                  Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base glass">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Everything you need to scale</h2>
              <p className="text-muted-foreground">Built for super admins, managers, trainers, and customers.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Users,
                  title: "Member Management",
                  desc: "Track attendance, progress, and membership status effortlessly."
                },
                {
                  icon: Calendar,
                  title: "Smart Scheduling",
                  desc: "Drag and drop calendar for classes, PT sessions, and facilities."
                },
                {
                  icon: BarChart3,
                  title: "Financial Analytics",
                  desc: "Real-time insights into MRR, churn rate, and total revenue."
                }
              ].map((feature, i) => (
                <div key={i} className="bg-card p-6 rounded-2xl border shadow-sm group hover:shadow-md transition-all">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 gradient-primary opacity-10" />
          <div className="container px-4 md:px-6 mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to transform your gym?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of fitness businesses that trust Staff Khata to run their operations.
            </p>
            <Link href="/register">
              <Button size="lg" className="h-14 px-8 text-lg shadow-xl">
                Get Started Today
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t bg-card text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Staff Khata Gym Management. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${className}`}>
      {children}
    </span>
  )
}

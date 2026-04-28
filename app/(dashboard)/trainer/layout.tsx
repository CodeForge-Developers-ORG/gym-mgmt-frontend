import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { trainerNav } from "@/components/layout/sidebar"

export default function TrainerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardLayout navItems={trainerNav} roleName="Trainer">
      {children}
    </DashboardLayout>
  )
}

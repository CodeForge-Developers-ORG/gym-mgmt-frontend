import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { customerNav } from "@/components/layout/sidebar"

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardLayout navItems={customerNav} roleName="Customer">
      {children}
    </DashboardLayout>
  )
}

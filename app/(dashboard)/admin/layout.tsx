import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { adminNav } from "@/components/layout/sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardLayout navItems={adminNav} roleName="Administrator">
      {children}
    </DashboardLayout>
  )
}

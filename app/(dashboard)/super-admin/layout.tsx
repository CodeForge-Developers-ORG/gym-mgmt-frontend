import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { superAdminNav } from "@/components/layout/sidebar"

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardLayout navItems={superAdminNav} roleName="Super Admin">
      {children}
    </DashboardLayout>
  )
}

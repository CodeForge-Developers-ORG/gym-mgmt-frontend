import { LoginForm } from "@/components/login-form"

export default function SuperAdminLoginPage() {
  return (
    <div className="flex w-full items-center justify-center animate-fade-in">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm isSuperAdmin />
      </div>
    </div>
  )
}

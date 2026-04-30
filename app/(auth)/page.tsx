import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="flex w-full items-center justify-center animate-fade-in">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  )
}

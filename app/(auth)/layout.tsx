import { Metadata } from "next"
import Image from "next/image"

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
    <div className="min-h-screen w-full relative flex items-center justify-center bg-white p-4 md:p-10">
      <div className="w-full max-w-5xl relative z-10">
        {children}
      </div>
    </div>
  )
}

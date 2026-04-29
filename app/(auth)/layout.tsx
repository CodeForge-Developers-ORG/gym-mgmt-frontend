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
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/gym_background.jpg"
          alt="Gym Background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="w-full max-w-[620px] px-6 py-12 relative z-10">
        {children}
      </div>
    </div>
  )
}

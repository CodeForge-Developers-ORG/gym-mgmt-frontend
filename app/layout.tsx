import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/context/toast-context";
import { BranchProvider } from "@/context/branch-context";
import { cn } from "@/lib/utils";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Staff Khata Gym Management",
  description: "A SaaS Gym Management System for Super Admins, Admins, Trainers, and Customers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(jetbrainsMono.variable)}>
      <body suppressHydrationWarning className={`antialiased min-h-screen bg-background text-foreground flex flex-col ${jetbrainsMono.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          suppressHydrationWarning
        >
          <BranchProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </BranchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

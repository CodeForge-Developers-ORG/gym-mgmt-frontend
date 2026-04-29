"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"

function formatSegment(segment: string): string {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  // Build breadcrumb items from URL segments
  const crumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/")
    const label = formatSegment(segment)
    const isLast = index === segments.length - 1

    return { href, label, isLast }
  })

  if (crumbs.length <= 1) return null

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
        {/* Home icon for the role root */}
        <li>
          <Link
            href={crumbs[0]?.href || "/"}
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {crumbs.map((crumb) => (
          <React.Fragment key={crumb.href}>
            <li aria-hidden="true">
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
            </li>
            <li>
              {crumb.isLast ? (
                <span className="font-medium text-foreground">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="hover:text-foreground transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  )
}

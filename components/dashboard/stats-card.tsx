import * as React from "react"
import { ArrowDown, ArrowUp } from "lucide-react"

import { cn } from "@/lib/utils"
import { Widget, WidgetContent, WidgetHeader, WidgetTitle } from "@/components/ui/widget"

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: number;
  description?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function StatsCard({ title, value, icon: Icon, trend, description, className, style }: StatsCardProps) {
  return (
    <Widget 
      className={cn("overflow-hidden group animate-depth-in", className)} 
      style={style}
      design="mumbai"
    >
      <WidgetHeader className="flex flex-row items-center justify-between pb-1">
        <WidgetTitle className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">
          {title}
        </WidgetTitle>
        <div className="rounded-xl bg-primary/10 p-1.5 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 shadow-sm">
          <Icon className="h-3 w-3" />
        </div>
      </WidgetHeader>
      <WidgetContent className="flex-col items-start justify-end pb-1.5">
        <div className="text-xl font-bold tracking-tight">{value}</div>
        {(trend !== undefined || description) && (
          <div className="mt-0.5 flex items-center text-[9px]">
            {trend !== undefined && (
              <span
                className={cn(
                  "flex items-center font-semibold mr-1.5 px-1 py-0 rounded-full",
                  trend > 0 ? "text-success" : trend < 0 ? "text-destructive" : "text-muted-foreground"
                )}
              >
                {trend > 0 ? "+" : trend < 0 ? "-" : ""}{Math.abs(trend)}%
              </span>
            )}
            <span className="text-muted-foreground font-semibold uppercase tracking-tight truncate opacity-70">{description}</span>
          </div>
        )}
      </WidgetContent>
      {/* Decorative gradient background pulse */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none animate-pulse-soft" />
    </Widget>
  )
}

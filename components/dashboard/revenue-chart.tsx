"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Widget, WidgetContent, WidgetHeader, WidgetTitle } from "@/components/ui/widget"
import { formatCurrency } from "@/lib/utils"

interface RevenueChartProps {
  data: { name: string; total: number; subscriptions: number }[];
  title?: string;
  description?: string;
}

export function RevenueChart({ 
  data, 
  title = "Revenue Overview", 
  description = "Monthly revenue breakdown" 
}: RevenueChartProps) {
  return (
    <Widget className="col-span-1 lg:col-span-4 xl:col-span-3 h-full animate-depth-in" size="lg">
      <WidgetHeader className="flex-col items-start gap-1">
        <WidgetTitle className="text-lg font-bold uppercase tracking-tight">{title}</WidgetTitle>
        <span className="text-[10px] font-semibold text-muted-foreground uppercase opacity-60 tracking-wider">{description}</span>
      </WidgetHeader>
      <WidgetContent className="pt-6">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--info))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--info))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={9} 
                fontWeight="semibold"
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={9}
                fontWeight="semibold"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-xl border bg-card p-3 shadow-xl glass animate-scale-in">
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-primary">{label}</p>
                        {payload.map((entry: any, index) => (
                          <div key={index} className="flex items-center gap-3 text-xs">
                            <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-muted-foreground font-semibold uppercase text-[9px]">{entry.name}:</span>
                            <span className="font-bold">{formatCurrency(entry.value)}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="total"
                name="Total"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorTotal)"
                animationDuration={1500}
              />
              <Area
                type="monotone"
                dataKey="subscriptions"
                name="Subs"
                stroke="hsl(var(--info))"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorSubs)"
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </WidgetContent>
    </Widget>
  )
}

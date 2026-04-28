import * as React from "react"

import { Widget, WidgetContent, WidgetHeader, WidgetTitle } from "@/components/ui/widget"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials, getRelativeTime } from "@/lib/utils"

interface ActivityItem {
  id: string;
  user: string;
  avatar: string;
  action: string;
  target: string;
  time: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  title?: string;
  description?: string;
}

export function ActivityFeed({ 
  activities, 
  title = "Recent Activity", 
  description = "Latest actions across your platform" 
}: ActivityFeedProps) {
  return (
    <Widget className="col-span-1 lg:col-span-3 xl:col-span-2 animate-depth-in" size="lg" style={{ animationDelay: '200ms' }}>
      <WidgetHeader className="flex-col items-start gap-1">
        <WidgetTitle className="text-lg font-bold uppercase tracking-tight">{title}</WidgetTitle>
        <span className="text-[10px] font-semibold text-muted-foreground uppercase opacity-60 tracking-wider">{description}</span>
      </WidgetHeader>
      <WidgetContent className="pt-6 block">
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 group">
              <Avatar className="h-9 w-9 mt-0.5 border-2 border-transparent group-hover:border-primary/50 transition-all duration-300">
                <AvatarImage src={activity.avatar} alt={activity.user} />
                <AvatarFallback>{getInitials(activity.user)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-semibold leading-none tracking-tight">
                  {activity.user}{" "}
                  <span className="text-muted-foreground font-medium">
                    {activity.action}
                  </span>{" "}
                  <span className="text-primary font-bold uppercase text-[9px] tracking-widest">{activity.target}</span>
                </p>
                <p className="text-[9px] font-semibold text-muted-foreground/50 uppercase">
                  {getRelativeTime(activity.time)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </WidgetContent>
    </Widget>
  )
}

"use client"

import * as React from "react"
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import { api } from "@/lib/api-client"
import { Card } from "@/components/ui/card"

import { FitnessScoreWidget, CalendarWidget, AnalogClockWidget, ClassDistributionWidget } from "@/components/wigggle/gym-widgets"
import { SlideInText } from "@/components/ui/slide-in-text"

const localizer = momentLocalizer(moment)

export default function SchedulePage() {
  const [events, setEvents] = React.useState<any[]>([])
  const [stats, setStats] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [classData, statsData] = await Promise.all([
          api.get("/classes"),
          api.get("/dashboard/admin/stats")
        ])
        
        const calendarEvents = classData.map((cls: any) => ({
          id: cls.id,
          title: `${cls.name} (${cls.trainer?.user?.name || 'TBA'})`,
          start: new Date(cls.start_time),
          end: new Date(cls.end_time),
          resource: cls,
        }))
        
        setEvents(calendarEvents)
        setStats(statsData)
      } catch (err) {
        console.error("Failed to fetch schedule data", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SlideInText text="Branch Schedule" />
          <p className="text-muted-foreground">Complete calendar view of all classes and events.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-6 perspective-distant">
        <AnalogClockWidget />
        <CalendarWidget />
        <ClassDistributionWidget />
        <FitnessScoreWidget data={{ revenue: stats?.monthly_revenue, members: stats?.total_members }} />
      </div>
      
      <Card className="flex-1 p-4 bg-background">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          className="rounded-lg"
          views={['month', 'week', 'day']}
          defaultView="week"
        />
      </Card>
    </div>
  )
}

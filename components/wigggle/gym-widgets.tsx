"use client"

import * as React from "react";
import Image from "next/image";
import { 
  Widget, 
  WidgetContent, 
  WidgetFooter, 
  WidgetHeader, 
  WidgetTitle 
} from "@/components/ui/widget";
import { Badge } from "@/components/ui/badge";

export function FitnessScoreWidget() {
  return (
    <Widget design="mumbai" className="animate-depth-in">
      <WidgetHeader>
        <WidgetTitle className="text-muted-foreground flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest">
          <div className="bg-success size-1.5 rounded-full animate-pulse" />
          Live Pulse
        </WidgetTitle>
      </WidgetHeader>
      <WidgetContent className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex flex-col items-center gap-0.5">
          <div className="relative w-8 h-8">
            <Image
              src="/vector_icons/health/3d Health(8).png"
              alt="Burn"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-lg font-bold">420</span>
          <span className="text-[8px] uppercase text-muted-foreground font-semibold">Kcal</span>
        </div>
        
        <div className="h-6 w-[1px] bg-border" />
        
        <div className="flex flex-col items-center gap-0.5">
          <div className="relative w-8 h-8">
            <Image
              src="/vector_icons/health/3d Health(28).png"
              alt="Steps"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-lg font-bold">8.4k</span>
          <span className="text-[8px] uppercase text-muted-foreground font-semibold">Steps</span>
        </div>
      </WidgetContent>
      <WidgetFooter className="justify-center border-t pt-1.5 mt-1.5">
        <span className="text-[9px] font-semibold text-primary uppercase tracking-tighter">Goal: 85% Achieved</span>
      </WidgetFooter>
    </Widget>
  );
}

export function TrainerTaskWidget() {
  const [tasks, setTasks] = React.useState([
    { id: 1, title: "Client Assessment", done: true },
    { id: 2, title: "Meal Plan Review", done: false },
    { id: 3, title: "Equipment Check", done: false },
  ]);

  const toggle = (id: number) => {
    setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <Widget size="md" design="mumbai" className="animate-depth-in" style={{ animationDelay: '0.2s' }}>
      <WidgetHeader>
        <WidgetTitle className="text-xs font-bold uppercase tracking-tight">Trainer Tasks</WidgetTitle>
        <Badge variant="outline" className="text-[9px] h-4 px-1">{tasks.filter(t => !t.done).length} Pending</Badge>
      </WidgetHeader>
      <WidgetContent className="justify-start items-start pt-1.5">
        <div className="grid grid-cols-1 gap-1.5 w-full">
          {tasks.map(task => (
            <div 
              key={task.id} 
              onClick={() => toggle(task.id)}
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-primary/5 cursor-pointer transition-colors border border-transparent hover:border-primary/20"
            >
              <div className={`size-3.5 rounded-full border flex items-center justify-center transition-colors ${task.done ? 'bg-primary border-primary' : 'border-muted-foreground/30'}`}>
                {task.done && <div className="size-1 bg-white rounded-full" />}
              </div>
              <span className={`text-xs font-semibold ${task.done ? 'line-through text-muted-foreground' : ''}`}>{task.title}</span>
            </div>
          ))}
        </div>
      </WidgetContent>
    </Widget>
  );
}

export function CalendarWidget() {
  const [date] = React.useState(new Date());
  const year = date.getFullYear();
  const month = date.getMonth();

  const calendarDays = React.useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return [
      ...Array(firstDay).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
  }, [year, month]);

  const monthName = new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);
  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <Widget className="gap-1 animate-depth-in" design="mumbai" style={{ animationDelay: '0.3s' }}>
      <WidgetHeader>
        <WidgetTitle className="text-[9px] font-bold text-primary uppercase tracking-widest">{monthName} {year}</WidgetTitle>
      </WidgetHeader>
      <WidgetContent className="flex-col">
        <div className="grid grid-cols-7 gap-1 w-full text-center">
          {weekdays.map((d, i) => (
            <div key={i} className="text-[7px] font-bold text-muted-foreground/50">{d}</div>
          ))}
          {calendarDays.map((day, i) => (
            <div key={i} className={`text-[8px] flex items-center justify-center size-3.5 rounded-full ${day && day === new Date().getDate() && month === new Date().getMonth() ? 'bg-primary text-white font-bold' : 'text-muted-foreground/80 font-medium'}`}>
              {day}
            </div>
          ))}
        </div>
      </WidgetContent>
    </Widget>
  );
}

export function AnalogClockWidget() {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hoursDegrees = ((time.getHours() % 12 + time.getMinutes() / 60) / 12) * 360;
  const minutesDegrees = ((time.getMinutes() + time.getSeconds() / 60) / 60) * 360;
  const secondsDegrees = (time.getSeconds() / 60) * 360;

  return (
    <Widget className="animate-depth-in flex items-center justify-center" design="mumbai" style={{ animationDelay: '0.4s' }}>
      <WidgetContent className="relative flex items-center justify-center">
        <div className="relative size-28 rounded-full border border-primary/10 flex items-center justify-center">
          {[...Array(12)].map((_, i) => {
            const angle = ((i + 1) / 12) * 360;
            const radians = (angle * Math.PI) / 180;
            const x = Math.sin(radians) * 44;
            const y = -Math.cos(radians) * 44;
            return (
              <div key={i} className="absolute text-[7px] font-bold text-muted-foreground/30" style={{ transform: `translate(${x}px, ${y}px)` }}>
                {i + 1}
              </div>
            );
          })}
          <div className="absolute size-1.5 bg-primary rounded-full z-20 shadow-sm" />
          <div className="absolute h-6 w-0.5 bg-foreground rounded-full origin-bottom" style={{ transform: `translateX(-50%) translateY(-100%) rotate(${hoursDegrees}deg)` }} />
          <div className="absolute h-10 w-0.5 bg-muted-foreground/60 rounded-full origin-bottom" style={{ transform: `translateX(-50%) translateY(-100%) rotate(${minutesDegrees}deg)` }} />
          <div className="absolute h-12 w-[1px] bg-primary rounded-full origin-bottom" style={{ transform: `translateX(-50%) translateY(-100%) rotate(${secondsDegrees}deg)` }} />
        </div>
      </WidgetContent>
    </Widget>
  );
}

export function RevenueGrowthWidget() {
  return (
    <Widget design="mumbai" className="animate-depth-in" style={{ animationDelay: '0.5s' }}>
      <WidgetHeader>
        <WidgetTitle className="flex w-full items-center justify-between">
          <span className="text-xl font-bold tracking-tight">$42.8k</span>
          <div className="size-5 bg-success/20 text-success rounded-full flex items-center justify-center">
             <div className="border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[5px] border-b-success" />
          </div>
        </WidgetTitle>
      </WidgetHeader>
      <WidgetContent className="justify-between items-end pb-1">
        <span className="text-success font-bold text-[10px]">+$2.4k</span>
        <span className="text-success font-bold text-[10px]">+12.5%</span>
      </WidgetContent>
      <WidgetFooter className="flex-col items-start border-t pt-1.5 mt-1.5">
        <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/60">Monthly Revenue</span>
        <span className="text-[7px] text-muted-foreground/40 font-medium tracking-tight">Staff Khata Branch #1</span>
      </WidgetFooter>
    </Widget>
  );
}

export function ClassDistributionWidget() {
  const data = [
    { name: "Strength", value: 45, color: "bg-orange-500" },
    { name: "Yoga", value: 25, color: "bg-amber-400" },
    { name: "Cardio", value: 20, color: "bg-orange-300" },
    { name: "Zumba", value: 10, color: "bg-orange-200" },
  ];

  return (
    <Widget size="md" design="mumbai" className="animate-depth-in" style={{ animationDelay: '0.6s' }}>
      <WidgetHeader>
        <WidgetTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Class Distribution</WidgetTitle>
      </WidgetHeader>
      <WidgetContent className="flex-col gap-3 pt-1">
        <div className="flex h-2.5 w-full rounded-full overflow-hidden">
          {data.map((item, i) => (
            <div 
              key={i} 
              style={{ width: `${item.value}%` }} 
              className={`${item.color} h-full transition-all hover:opacity-80 cursor-help`}
              title={`${item.name}: ${item.value}%`}
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 w-full">
          {data.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`size-1.5 rounded-full ${item.color}`} />
              <span className="text-[9px] font-semibold text-muted-foreground uppercase">{item.name}</span>
              <span className="text-[9px] font-bold ml-auto">{item.value}%</span>
            </div>
          ))}
        </div>
      </WidgetContent>
    </Widget>
  );
}

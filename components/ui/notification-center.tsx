"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertCircle, AlertTriangle, CheckCircle, ChevronDown, Info, X } from "lucide-react";
import { useCallback, useState } from "react";

type NotificationType = "success" | "error" | "warning" | "info";

type NotificationConfig = {
  title: string;
  message: string;
  description: string;
  action: { label: string; onClick: () => void };
  icon: React.ElementType;
  toneClassName: string;
};

type ActiveNotification = { id: string; type: NotificationType };

const NOTIFICATION_CONFIGS: Record<NotificationType, NotificationConfig> = {
  success: {
    title: "Success",
    message: "Operation completed successfully",
    description: "Your changes have been saved to the database. All updates are now live.",
    action: { label: "View Details", onClick: () => {} },
    icon: CheckCircle,
    toneClassName: "text-green-500",
  },
  error: {
    title: "Error Occurred",
    message: "Something went wrong",
    description: "Failed to process your request. Please try again or contact support if the issue persists.",
    action: { label: "Retry", onClick: () => {} },
    icon: AlertCircle,
    toneClassName: "text-red-500",
  },
  warning: {
    title: "Warning",
    message: "Please review this action",
    description: "This action may have unintended consequences. Review the details before proceeding.",
    action: { label: "Learn More", onClick: () => {} },
    icon: AlertTriangle,
    toneClassName: "text-yellow-500",
  },
  info: {
    title: "Information",
    message: "New feature available",
    description: "Check out our new notification system with expandable details.",
    action: { label: "Explore", onClick: () => {} },
    icon: Info,
    toneClassName: "text-blue-500",
  },
};

// Notification bar shown at top of screen
function NotificationBar({
  config,
  type,
  notificationId,
  onDismiss,
  prefersReducedMotion,
}: {
  config: NotificationConfig;
  type: NotificationType;
  notificationId: string;
  onDismiss: () => void;
  prefersReducedMotion: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { action, description, icon: Icon, message, title, toneClassName } = config;

  return (
    <motion.div
      role="listitem"
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: "easeOut" }}
    >
      <Card className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background/90 p-4 backdrop-blur shadow-lg">
        <div aria-hidden="true" className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted/80", toneClassName)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-foreground/80">{message}</p>
            </div>
            <motion.button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
              whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background/40 text-foreground/60 transition-colors hover:text-foreground"
            >
              <motion.span animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: prefersReducedMotion ? 0 : 0.2 }} className="flex">
                <ChevronDown className="h-4 w-4" />
              </motion.span>
            </motion.button>
          </div>
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div key="details" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: "easeOut" }} className="overflow-hidden">
                <div className="mt-2 space-y-3 border-t border-border/40 pt-3 text-sm text-foreground/70">
                  <p>{description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={action.onClick} className="rounded-full text-xs">{action.label}</Button>
                    <Button type="button" size="sm" variant="ghost" className="rounded-full text-xs" onClick={onDismiss}>Dismiss</Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <motion.button
          type="button"
          onClick={onDismiss}
          whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
          whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
          className="rounded-full p-1 text-foreground/60 transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </motion.button>
      </Card>
    </motion.div>
  );
}

// Hook to use the notification system
export function useNotifications() {
  const [notifications, setNotifications] = useState<ActiveNotification[]>([]);

  const addNotification = useCallback((type: NotificationType, duration = 8000) => {
    const id = Math.random().toString(36).slice(2, 9);
    setNotifications((prev) => [...prev, { id, type }]);
    if (duration > 0) {
      window.setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, duration);
    }
    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return { notifications, addNotification, removeNotification };
}

// Provider component that renders the notification overlay
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { notifications, addNotification, removeNotification } = useNotifications();
  const prefersReducedMotion = useReducedMotion() ?? false;

  return (
    <>
      <div aria-live="polite" role="status" className="pointer-events-none fixed left-0 right-0 top-0 z-[100] p-4 sm:p-6">
        <div className="pointer-events-auto mx-auto flex max-w-md flex-col gap-3">
          <AnimatePresence initial={false}>
            {notifications.map((notification) => (
              <NotificationBar
                key={notification.id}
                config={NOTIFICATION_CONFIGS[notification.type]}
                type={notification.type}
                notificationId={notification.id}
                onDismiss={() => removeNotification(notification.id)}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
      {children}
    </>
  );
}

// Demo component showing notification triggers
export default function NotificationCenter() {
  const { notifications, addNotification, removeNotification } = useNotifications();
  const prefersReducedMotion = useReducedMotion() ?? false;

  const BUTTON_CONFIGS: Array<{ type: NotificationType; label: string }> = [
    { type: "success", label: "Success" },
    { type: "error", label: "Error" },
    { type: "warning", label: "Warning" },
    { type: "info", label: "Info" },
  ];

  return (
    <div className="relative">
      <div aria-live="polite" role="status" className="pointer-events-none fixed left-0 right-0 top-0 z-50 p-4 sm:p-6">
        <div className="pointer-events-auto mx-auto flex max-w-md flex-col gap-3">
          <AnimatePresence initial={false}>
            {notifications.map((notification) => (
              <NotificationBar
                key={notification.id}
                config={NOTIFICATION_CONFIGS[notification.type]}
                type={notification.type}
                notificationId={notification.id}
                onDismiss={() => removeNotification(notification.id)}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {BUTTON_CONFIGS.map(({ type, label }) => {
          const Icon = NOTIFICATION_CONFIGS[type].icon;
          const toneClass = NOTIFICATION_CONFIGS[type].toneClassName;
          return (
            <motion.button
              key={type}
              type="button"
              onClick={() => addNotification(type)}
              whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
              whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
              className="flex flex-col items-center gap-2 rounded-2xl border border-border/50 bg-card p-4 text-center transition-all hover:border-primary/30 hover:bg-primary/5"
            >
              <div className={cn("flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-muted/60", toneClass)}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold text-foreground">{label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

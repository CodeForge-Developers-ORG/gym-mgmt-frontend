'use client';

import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import Notification, { NotificationPosition, NotificationType } from '@/components/ui/toast';
import { AnimatePresence } from 'framer-motion';

interface NotificationItem {
  id: number;
  type: NotificationType;
  title: string;
  message?: string;
  showIcon?: boolean;
  duration?: number;
}

interface ToastContextType {
  addNotification: (type: NotificationType, title: string, message?: string, showIcon?: boolean, duration?: number) => void;
  addLoadingWithSuccess: (loadingTitle: string, loadingMessage: string, successTitle: string, successMessage: string, loadingDuration?: number) => void;
  success: (title: string, message?: string, duration?: number) => void;
  error: (title: string, message?: string, duration?: number) => void;
  info: (title: string, message?: string, duration?: number) => void;
  warning: (title: string, message?: string, duration?: number) => void;
  loading: (title: string, message?: string) => number;
  removeNotification: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [position, setPosition] = useState<NotificationPosition>('bottom-right');
  const nextIdRef = useRef(1);

  const addNotification = (type: NotificationType, title: string, message?: string, showIcon: boolean = true, duration?: number) => {
    const id = nextIdRef.current++;
    const newNotification: NotificationItem = {
      id,
      type,
      title,
      message,
      showIcon,
      duration,
    };
    setNotifications((prev) => [...prev, newNotification]);
    return id;
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const addLoadingWithSuccess = (
    loadingTitle: string,
    loadingMessage: string,
    successTitle: string,
    successMessage: string,
    loadingDuration: number = 2000
  ) => {
    const loadingId = addNotification('loading', loadingTitle, loadingMessage, true);

    setTimeout(() => {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === loadingId
            ? {
                ...n,
                type: 'success',
                title: successTitle,
                message: successMessage,
                duration: 4000,
              }
            : n
        )
      );
    }, loadingDuration);
  };

  const success = (title: string, message?: string, duration: number = 4000) => 
    addNotification('success', title, message, true, duration);
  
  const error = (title: string, message?: string, duration: number = 5000) => 
    addNotification('error', title, message, true, duration);
  
  const info = (title: string, message?: string, duration: number = 4000) => 
    addNotification('info', title, message, true, duration);
  
  const warning = (title: string, message?: string, duration: number = 5000) => 
    addNotification('warning', title, message, true, duration);
  
  const loading = (title: string, message?: string) => 
    addNotification('loading', title, message, true);

  const getPositionClasses = (pos: NotificationPosition) => {
    switch (pos) {
      case 'top-left': return 'top-4 left-4';
      case 'top-right': return 'top-4 right-4';
      case 'bottom-left': return 'bottom-4 left-4';
      case 'bottom-right': return 'bottom-4 right-4';
      case 'top-center': return 'top-4 left-1/2 -translate-x-1/2';
      case 'bottom-center': return 'bottom-4 left-1/2 -translate-x-1/2';
      default: return 'bottom-4 right-4';
    }
  };

  return (
    <ToastContext.Provider value={{ 
      addNotification, 
      addLoadingWithSuccess, 
      success, 
      error, 
      info, 
      warning, 
      loading,
      removeNotification 
    }}>
      {children}
      <div className={`fixed p-4 space-y-2 w-full max-w-sm z-[9999] ${getPositionClasses(position)}`}>
        <AnimatePresence>
          {notifications.map((notification) => (
            <Notification
              key={notification.id}
              type={notification.type}
              title={notification.title}
              message={notification.message}
              showIcon={notification.showIcon}
              duration={notification.duration}
              onClose={() => removeNotification(notification.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

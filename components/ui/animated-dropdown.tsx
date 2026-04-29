"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import useMeasure from "react-use-measure";
import {
  UserIcon,
  Settings01Icon,
  HelpCircleIcon,
  LogoutIcon,
  MoreHorizontalCircle01Icon,
  Notification01Icon,
} from "@hugeicons/core-free-icons";

export interface AnimatedMenuItem {
  id: string;
  label: string;
  icon: any;
  onClick?: () => void;
  isDivider?: boolean;
  isDanger?: boolean;
}

const DEFAULT_ITEMS: AnimatedMenuItem[] = [
  { id: "profile", label: "Profile", icon: UserIcon },
  { id: "notifications", label: "Notifications", icon: Notification01Icon },
  { id: "divider1", label: "", icon: null, isDivider: true },
  { id: "settings", label: "Settings", icon: Settings01Icon },
  { id: "help", label: "Get Help", icon: HelpCircleIcon },
  { id: "divider2", label: "", icon: null, isDivider: true },
  { id: "logout", label: "Logout", icon: LogoutIcon, isDanger: true },
];

const easeOutQuint: [number, number, number, number] = [0.23, 1, 0.32, 1];

interface AnimatedDropdownProps {
  items?: AnimatedMenuItem[];
  triggerClassName?: string;
}

export default function AnimatedDropdown({ items = DEFAULT_ITEMS, triggerClassName }: AnimatedDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(items[0]?.id ?? "");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [contentRef, contentBounds] = useMeasure();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const openHeight = Math.max(40, Math.ceil(contentBounds.height));

  return (
    <div ref={containerRef} className="relative h-10 w-10">
      <motion.div
        layout
        initial={false}
        animate={{
          width: isOpen ? 220 : 40,
          height: isOpen ? openHeight : 40,
          borderRadius: isOpen ? 14 : 12,
        }}
        transition={{ type: "spring", damping: 34, stiffness: 380, mass: 0.8 }}
        className="absolute top-0 right-0 bg-popover border border-border shadow-lg overflow-hidden cursor-pointer origin-top-right"
        onClick={() => !isOpen && setIsOpen(true)}
      >
        {/* Trigger icon */}
        <motion.div
          initial={false}
          animate={{ opacity: isOpen ? 0 : 1, scale: isOpen ? 0.8 : 1 }}
          transition={{ duration: 0.15 }}
          className="absolute inset-0 flex items-center justify-center"
          style={{ pointerEvents: isOpen ? "none" : "auto", willChange: "transform" }}
        >
          <HugeiconsIcon icon={MoreHorizontalCircle01Icon} className={`w-6 h-6 text-muted-foreground ${triggerClassName}`} />
        </motion.div>

        {/* Menu content */}
        <div ref={contentRef}>
          <motion.div
            layout
            initial={false}
            animate={{ opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.2, delay: isOpen ? 0.08 : 0 }}
            className="p-2"
            style={{ pointerEvents: isOpen ? "auto" : "none", willChange: "transform" }}
          >
            <ul className="flex flex-col gap-0.5 m-0 p-0 list-none">
              {items.map((item, index) => {
                if (item.isDivider) {
                  return (
                    <motion.hr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isOpen ? 1 : 0 }}
                      transition={{ delay: isOpen ? 0.12 + index * 0.015 : 0 }}
                      className="border-border my-1"
                    />
                  );
                }

                const isActive = activeItem === item.id;
                const isLogout = item.isDanger;
                const showIndicator = hoveredItem ? hoveredItem === item.id : isActive;

                return (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : 8 }}
                    transition={{ delay: isOpen ? 0.06 + index * 0.02 : 0, duration: 0.15, ease: easeOutQuint }}
                    onClick={() => {
                      setActiveItem(item.id);
                      item.onClick?.();
                      if (item.isDanger) setIsOpen(false);
                    }}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`relative flex items-center gap-3 rounded-lg text-sm cursor-pointer pl-3 py-2 ${
                      isLogout && showIndicator ? "text-red-600" : isActive ? "text-foreground" : isLogout ? "text-muted-foreground hover:text-red-600" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {showIndicator && (
                      <motion.div layoutId="activeIndicator" className={`absolute inset-0 rounded-lg ${isLogout ? "bg-red-50 dark:bg-red-950/30" : "bg-muted"}`} transition={{ type: "spring", damping: 30, stiffness: 520, mass: 0.8 }} />
                    )}
                    {showIndicator && (
                      <motion.div layoutId="leftBar" className={`absolute left-0 top-0 bottom-0 my-auto w-[3px] h-5 rounded-full ${isLogout ? "bg-red-500" : "bg-foreground"}`} transition={{ type: "spring", damping: 30, stiffness: 520, mass: 0.8 }} />
                    )}
                    <HugeiconsIcon icon={item.icon} className="w-[18px] h-[18px] relative z-10" />
                    <span className="font-medium relative z-10">{item.label}</span>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

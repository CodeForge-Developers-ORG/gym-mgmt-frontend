"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import {
  MoreHorizontalCircle01Icon,
} from "@hugeicons/core-free-icons";

export interface ActionMenuItem {
  id: string;
  label: string;
  icon: any;
  variant?: "default" | "destructive";
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  onAction: (id: string) => void;
}

const easeOutQuint: [number, number, number, number] = [0.23, 1, 0.32, 1];

export function ActionMenu({ items, onAction }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="relative h-9 w-9">
      <DropdownMenuPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuPrimitive.Trigger asChild>
          <motion.div
            layout
            className="flex items-center justify-center h-9 w-9 rounded-xl bg-popover border border-border shadow-sm cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <HugeiconsIcon
              icon={MoreHorizontalCircle01Icon}
              className="w-5 h-5 text-muted-foreground"
            />
          </motion.div>
        </DropdownMenuPrimitive.Trigger>

        <DropdownMenuPrimitive.Portal>
          <DropdownMenuPrimitive.Content
            sideOffset={8}
            align="end"
            className="z-[100] min-w-[200px]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
              className="bg-popover border border-border shadow-2xl rounded-2xl overflow-hidden backdrop-blur-md p-1.5"
            >
              <ul className="flex flex-col gap-1 m-0 p-0 list-none">
                {items.map((item, index) => {
                  const isDestructive = item.variant === "destructive";
                  const isHovered = hoveredItem === item.id;

                  return (
                    <DropdownMenuPrimitive.Item
                      key={item.id}
                      onSelect={() => onAction(item.id)}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className="outline-none"
                    >
                      <motion.li
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.05 + index * 0.03,
                          duration: 0.2,
                          ease: easeOutQuint,
                        }}
                        className={`relative flex items-center gap-3 rounded-xl text-xs cursor-pointer transition-all duration-200 ease-out pl-3 py-2.5 ${
                          isDestructive
                            ? "text-red-500 hover:text-red-600"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {/* Hover indicator */}
                        {isHovered && (
                          <motion.div
                            layoutId="hoverIndicator"
                            className={`absolute inset-0 rounded-xl ${
                              isDestructive ? "bg-red-500/10" : "bg-muted"
                            }`}
                            transition={{
                              type: "spring",
                              damping: 30,
                              stiffness: 520,
                              mass: 0.8,
                            }}
                          />
                        )}
                        
                        {/* Left bar indicator */}
                        {isHovered && (
                          <motion.div
                            layoutId="leftBar"
                            className={`absolute left-0 top-0 bottom-0 my-auto w-[3px] h-5 rounded-full ${
                              isDestructive ? "bg-red-500" : "bg-primary"
                            }`}
                            transition={{
                              type: "spring",
                              damping: 30,
                              stiffness: 520,
                              mass: 0.8,
                            }}
                          />
                        )}

                        <HugeiconsIcon
                          icon={item.icon}
                          className="w-4 h-4 relative z-10"
                        />
                        <span className="font-bold relative z-10">
                          {item.label}
                        </span>
                      </motion.li>
                    </DropdownMenuPrimitive.Item>
                  );
                })}
              </ul>
            </motion.div>
          </DropdownMenuPrimitive.Content>
        </DropdownMenuPrimitive.Portal>
      </DropdownMenuPrimitive.Root>
    </div>
  );
}

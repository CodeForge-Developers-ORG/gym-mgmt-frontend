"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search01Icon,
  FavouriteIcon,
  Fire02Icon,
  MultiplicationSignIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const TABS = [
  {
    id: "popular",
    label: "Popular",
    icon: Fire02Icon,
    color: "text-red-500",
    fill: "fill-red-500",
    bg: "bg-red-50 dark:bg-red-950/30",
  },
  {
    id: "favorites",
    label: "Favorites",
    icon: FavouriteIcon,
    color: "text-foreground",
    fill: "fill-foreground",
    bg: "bg-muted",
  },
] as const;

interface DiscoverButtonProps {
  onSearch?: (query: string) => void;
  onTabChange?: (tab: "popular" | "favorites") => void;
}

export default function DiscoverButton({ onSearch, onTabChange }: DiscoverButtonProps) {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["id"]>(TABS[0].id);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const handleTabChange = (id: (typeof TABS)[number]["id"]) => {
    setActiveTab(id);
    onTabChange?.(id);
  };

  return (
    <div className="flex items-center gap-3 p-2 h-full">
      {/* Search Button / Input */}
      <motion.div
        layout
        transition={{ type: "spring", damping: 20, stiffness: 230, mass: 1.2 }}
        onClick={() => !isSearchExpanded && setIsSearchExpanded(true)}
        className={`flex items-center bg-card rounded-[3rem] shadow-lg cursor-pointer h-[48px] overflow-hidden relative px-[1.125rem] border border-border/50 ${
          isSearchExpanded ? "flex-1" : ""
        }`}
      >
        <div className="shrink-0">
          <HugeiconsIcon icon={Search01Icon} className="w-5 h-5 text-muted-foreground" />
        </div>

        <motion.div
          initial={false}
          animate={{
            width: isSearchExpanded ? "auto" : "0px",
            opacity: isSearchExpanded ? 1 : 0,
            filter: isSearchExpanded ? "blur(0px)" : "blur(4px)",
            marginLeft: isSearchExpanded ? "12px" : "0px",
          }}
          transition={{ type: "spring", damping: 20, stiffness: 230, mass: 1.2 }}
          className="overflow-hidden -mb-0.5 flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => onSearch?.(e.target.value)}
            className="border-0 outline-none bg-transparent text-sm focus-visible:ring-0 focus-visible:ring-offset-0 w-full text-foreground placeholder:text-muted-foreground"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      </motion.div>

      {/* Tab Container / Close Button */}
      <motion.div
        layout
        transition={{ type: "spring", damping: 20, stiffness: 230, mass: 1.2 }}
        className="flex items-center bg-card rounded-[3rem] shadow-lg h-[48px] overflow-hidden relative border border-border/50"
      >
        <motion.div
          initial={false}
          animate={{ width: isSearchExpanded ? "48px" : "auto" }}
          transition={{ type: "spring", damping: 20, stiffness: 230, mass: 1.2 }}
          className="overflow-hidden relative h-full flex items-center"
        >
          {/* Tabs Group */}
          <motion.div
            initial={false}
            animate={{
              opacity: isSearchExpanded ? 0 : 1,
              filter: isSearchExpanded ? "blur(4px)" : "blur(0px)",
            }}
            transition={{ duration: 0.2 }}
            className="flex items-center whitespace-nowrap"
          >
            <div className="flex items-center gap-1 px-[6px]">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-[3rem] transition-colors relative text-sm ${
                    activeTab === tab.id ? tab.color : "text-muted-foreground"
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.span
                      layoutId="bubble"
                      className={`absolute inset-0 z-0 ${tab.bg}`}
                      style={{ borderRadius: 9999 }}
                      transition={{ type: "spring", bounce: 0.19, duration: 0.4 }}
                    />
                  )}
                  <HugeiconsIcon
                    icon={tab.icon}
                    className={`w-4 h-4 relative z-10 ${activeTab === tab.id ? tab.fill : ""}`}
                  />
                  <span className="font-semibold font-mono uppercase relative z-10 text-xs">
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Close Button */}
          <motion.div
            initial={false}
            animate={{
              opacity: isSearchExpanded ? 1 : 0,
              filter: isSearchExpanded ? "blur(0px)" : "blur(4px)",
            }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
            style={{ pointerEvents: isSearchExpanded ? "auto" : "none" }}
          >
            <button
              onClick={() => setIsSearchExpanded(false)}
              className="shrink-0 cursor-pointer"
            >
              <HugeiconsIcon icon={MultiplicationSignIcon} className="w-5 h-5 text-muted-foreground" />
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

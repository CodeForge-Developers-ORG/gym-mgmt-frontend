"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ProfileIcon,
  Search01Icon,
  Cancel01Icon,
  Add01Icon,
  Briefcase01Icon,
  PaintBoardIcon,
  Database01Icon,
  QuillWrite01Icon,
} from "@hugeicons/core-free-icons";

export interface StackedMember {
  id: string;
  name: string;
  status: string;
  online: boolean;
  role: string;
  roleType: "pm" | "designer" | "data" | "creator";
  avatar?: string;
  initials?: string;
}

const sweepSpring = { type: "spring" as const, stiffness: 400, damping: 35, mass: 0.5 };

const ROLE_STYLES = {
  pm: { bg: "bg-[#FFFCEB]", text: "text-[#856404]", border: "border-[#FFEBA5]", icon: Briefcase01Icon },
  designer: { bg: "bg-[#F0F7FF]", text: "text-[#004085]", border: "border-[#B8DAFF]", icon: PaintBoardIcon },
  data: { bg: "bg-[#F3FAF4]", text: "text-[#155724]", border: "border-[#C3E6CB]", icon: Database01Icon },
  creator: { bg: "bg-[#FCF5FF]", text: "text-[#522785]", border: "border-[#E8D1FF]", icon: QuillWrite01Icon },
};

function RoleBadge({ type, label }: { type: StackedMember["roleType"]; label: string }) {
  const style = ROLE_STYLES[type];
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${style.bg} ${style.text} ${style.border} shrink-0`}>
      <HugeiconsIcon icon={style.icon} size={12} strokeWidth={1.8} />
      <span className="text-xs font-medium tracking-tight uppercase whitespace-nowrap truncate max-w-[80px]">{label}</span>
    </div>
  );
}

function MemberItem({ member }: { member: StackedMember }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, x: 10, y: 15, rotate: 1 }, visible: { opacity: 1, x: 0, y: 0, rotate: 0 } }}
      transition={sweepSpring}
      style={{ originX: 1, originY: 1 }}
      className="flex items-center group py-3.5 first:pt-0 border-b border-border/40 last:border-0"
    >
      <div className="relative mr-4 shrink-0">
        {member.avatar ? (
          <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full ring-2 ring-background shadow-sm" />
        ) : (
          <div className="w-10 h-10 rounded-full ring-2 ring-background shadow-sm bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
            {member.initials ?? member.name.slice(0, 2).toUpperCase()}
          </div>
        )}
        {member.online && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-background rounded-full flex items-center justify-center shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-foreground tracking-tight leading-none mb-1 truncate">{member.name}</h3>
        <div className="flex items-center gap-1.5">
          {member.online && <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />}
          <p className={`text-xs font-medium leading-none ${member.online ? "text-green-600" : "text-muted-foreground"}`}>{member.status}</p>
        </div>
      </div>
      <div className="shrink-0">
        <RoleBadge type={member.roleType} label={member.role} />
      </div>
    </motion.div>
  );
}

interface StackedListProps {
  title?: string;
  subtitle?: string;
  activeMembers: StackedMember[];
  allMembers: StackedMember[];
  onAddMember?: () => void;
}

export default function StackedList({ title = "Active Members", subtitle, activeMembers, allMembers, onAddMember }: StackedListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = useMemo(
    () => allMembers.filter((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.role.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery, allMembers]
  );

  return (
    <div className="relative w-full bg-background rounded-[32px] border border-border flex flex-col overflow-hidden shadow-sm">
      <div className="flex flex-col h-full bg-background">
        <div className="p-6 pb-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground tracking-tight flex items-center gap-2">
              {title}
              <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground font-normal">{activeMembers.length}</span>
            </h2>
            {onAddMember && (
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-border/50" onClick={onAddMember}>
                <HugeiconsIcon icon={Add01Icon} size={16} strokeWidth={2.5} />
              </Button>
            )}
          </div>
          <div className="relative">
            <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 z-10" size={14} />
            <input
              placeholder="Search teammates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full pl-9 pr-4 bg-muted/40 border-none rounded-2xl text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-border"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-20">
          <motion.div initial={false} animate="visible" variants={{ visible: { transition: { staggerChildren: 0.04 } } }} className="space-y-0">
            {activeMembers.map((member) => (
              <MemberItem key={`active-${member.id}`} member={member} />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Expandable directory panel */}
      <motion.div
        layout
        initial={false}
        animate={{
          height: isExpanded ? "calc(100% - 16px)" : "60px",
          width: isExpanded ? "calc(100% - 16px)" : "calc(100% - 32px)",
          bottom: isExpanded ? "8px" : "16px",
          left: isExpanded ? "8px" : "16px",
          borderRadius: isExpanded ? "28px" : "20px",
        }}
        transition={{ type: "spring", stiffness: 240, damping: 30, mass: 0.8 }}
        className="absolute z-50 overflow-hidden border border-border flex flex-col bg-card"
        style={{ cursor: isExpanded ? "default" : "pointer" }}
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        <div className={`flex items-center justify-between px-3 h-[60px] shrink-0 transition-colors ${isExpanded ? "border-b border-border/40" : "hover:bg-muted/20"}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground/80 shadow-sm">
              <HugeiconsIcon icon={ProfileIcon} size={18} strokeWidth={2} />
            </div>
            <motion.div layout="position">
              <h4 className="text-sm font-medium text-foreground tracking-tight leading-none">Member Directory</h4>
              <p className="text-xs leading-none text-muted-foreground mt-1">{allMembers.length} Members Total</p>
            </motion.div>
          </div>
          <div className="flex items-center gap-3">
            {!isExpanded && (
              <div className="flex -space-x-2.5">
                {allMembers.slice(0, 3).map((m) => (
                  <div key={m.id} className="w-8 h-8 rounded-full ring-1 ring-background bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold shadow-sm">
                    {m.initials ?? m.name.slice(0, 2).toUpperCase()}
                  </div>
                ))}
                {allMembers.length > 3 && (
                  <div className="w-8 h-8 rounded-full ring-1 ring-background bg-muted flex items-center justify-center shadow-sm">
                    <span className="text-xs font-medium text-muted-foreground">+{allMembers.length - 3}</span>
                  </div>
                )}
              </div>
            )}
            {isExpanded && (
              <button
                className="h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground transition-all flex items-center justify-center bg-muted/60 active:scale-90"
                onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
              >
                <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          <AnimatePresence>
            {isExpanded && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="px-4 py-3">
                <div className="relative">
                  <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 z-10" size={14} />
                  <input
                    placeholder="Search members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 w-full bg-muted/30 border-none rounded-xl text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:ring-1 focus:ring-border pl-9"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex-1 overflow-y-auto px-4 py-2">
            <motion.div
              initial="hidden"
              animate={isExpanded ? "visible" : "hidden"}
              variants={{ visible: { transition: { staggerChildren: 0.03, delayChildren: 0.1 } }, hidden: { transition: { staggerChildren: 0.02, staggerDirection: -1 } } }}
              className="space-y-0"
            >
              {filteredMembers.map((member) => (
                <MemberItem key={`list-${member.id}`} member={member} />
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

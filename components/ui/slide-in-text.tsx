'use client';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const SlideInText = ({ text = "", className }: { text?: string; className?: string }) => {
  return (
    <h2 className={cn("text-2xl md:text-3xl font-bold tracking-tight", className)}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: i * 0.03, ease: "easeOut" }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </h2>
  );
};

import * as React from "react";
import { motion } from "framer-motion";

// Usage: <Progress value={60} max={100} className="my-4" />

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // from 0 to 100
  max?: number;  // default 100
  colorClass?: string; // override progress bar color
  height?: string; // e.g., "h-3"
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value,
      max = 100,
      colorClass = "bg-gradient-to-r from-purple-500 via-yellow-400 to-orange-400",
      className,
      height = "h-3",
      ...props
    },
    ref
  ) => {
    // Clamp value
    const percent = Math.max(0, Math.min(100, (value / max) * 100));

    function cn(...classes: (string | undefined | false | null)[]): string {
      return classes.filter(Boolean).join(" ");
    }

    return (
      <div
        ref={ref}
        className={cn("w-full bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-inner", height, className)}
        {...props}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5, type: "spring" }}
          className={cn(
            "h-full rounded-2xl transition-all duration-300",
            colorClass
          )}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";

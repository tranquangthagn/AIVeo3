import * as React from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface NumberTickerProps {
  value: number;
  decimals?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

export function NumberTicker({
  value,
  decimals = 0,
  className,
  prefix = "",
  suffix = "",
  duration = 1.2,
}: NumberTickerProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 28, stiffness: 90, duration });

  React.useEffect(() => {
    if (inView) motionValue.set(value);
  }, [motionValue, inView, value]);

  React.useEffect(() => {
    return spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent =
          prefix +
          Intl.NumberFormat("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          }).format(Number(latest.toFixed(decimals))) +
          suffix;
      }
    });
  }, [spring, decimals, prefix, suffix]);

  return (
    <motion.span ref={ref} className={cn("inline-block tabular-nums", className)}>
      {prefix}0{suffix}
    </motion.span>
  );
}

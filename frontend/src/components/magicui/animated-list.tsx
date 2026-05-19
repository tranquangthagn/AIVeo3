import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedListItemProps {
  children: React.ReactNode;
}

export function AnimatedListItem({ children }: AnimatedListItemProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: -16 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 40, mass: 1 }}
      className="mx-auto w-full"
    >
      {children}
    </motion.div>
  );
}

interface AnimatedListProps {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}

export function AnimatedList({ className, children, delay = 1500 }: AnimatedListProps) {
  const [index, setIndex] = React.useState(0);
  const childrenArray = React.Children.toArray(children);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % (childrenArray.length + 1));
    }, delay);
    return () => clearInterval(timer);
  }, [childrenArray.length, delay]);

  const visible = childrenArray.slice(0, Math.min(index, childrenArray.length));

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <AnimatePresence>
        {visible.map((item, i) => (
          <AnimatedListItem key={(item as React.ReactElement).key ?? i}>{item}</AnimatedListItem>
        ))}
      </AnimatePresence>
    </div>
  );
}

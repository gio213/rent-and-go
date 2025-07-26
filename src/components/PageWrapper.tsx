"use client";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import clsx from "clsx";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageWrapper({ children, className }: PageWrapperProps) {
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  // Prevent flash by waiting for component to be ready
  useEffect(() => {
    setIsReady(false);
    const timer = setTimeout(() => setIsReady(true), 50);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isReady) {
    return (
      <div className={clsx("min-h-screen opacity-0", className)}>
        {children}
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{
          opacity: 0,
          y: 20,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          y: -20,
          scale: 0.95,
        }}
        transition={{
          duration: 0.4,
          ease: [0.25, 0.1, 0.25, 1],
          type: "tween",
        }}
        className={clsx("min-h-screen", className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

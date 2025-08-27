"use client";
import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";

interface SmoothScrollProps {
  disabled?: boolean;
}

export default function SmoothScroll({ disabled = false }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (disabled) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [disabled]);

  // Method to disable/enable from outside
  useEffect(() => {
    if (lenisRef.current) {
      if (disabled) {
        lenisRef.current.stop();
      } else {
        lenisRef.current.start();
      }
    }
  }, [disabled]);

  return null;
}

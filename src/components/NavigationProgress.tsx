"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

export default function NavigationProgress() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const prevPath = useRef(pathname);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const start = useCallback(() => {
    setLoading(true);
    setProgress(15);
    clearInterval(intervalRef.current);
    let p = 15;
    intervalRef.current = setInterval(() => {
      // Slow down as it approaches 90%
      const step = p < 50 ? Math.random() * 12 + 3 : Math.random() * 5 + 1;
      p = Math.min(p + step, 92);
      setProgress(p);
    }, 400);

    // Safety: auto-complete after 15s so it never gets stuck
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      complete();
    }, 15000);
  }, []);

  const complete = useCallback(() => {
    clearInterval(intervalRef.current);
    clearTimeout(timeoutRef.current);
    setProgress(100);
    setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 350);
  }, []);

  // Listen for link clicks to start loading
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const a = (e.target as HTMLElement).closest("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        a.getAttribute("target") === "_blank"
      )
        return;
      start();
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [start]);

  // Complete when pathname changes
  useEffect(() => {
    if (pathname !== prevPath.current) {
      prevPath.current = pathname;
      complete();
    }
  }, [pathname, complete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className="h-[2px] w-full bg-rose-100 overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-rose-400 to-rose-600 transition-[width] duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

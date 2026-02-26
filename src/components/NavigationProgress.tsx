"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

export default function NavigationProgress() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const prevPath = useRef(pathname);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRequests = useRef(0);

  const start = useCallback(() => {
    setLoading(true);
    setProgress(15);
    if (intervalRef.current) clearInterval(intervalRef.current);
    let p = 15;
    intervalRef.current = setInterval(() => {
      const step = p < 50 ? Math.random() * 12 + 3 : Math.random() * 5 + 1;
      p = Math.min(p + step, 92);
      setProgress(p);
    }, 400);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      finish();
    }, 15000);
  }, []);

  const finish = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setProgress(100);
    setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 350);
  }, []);

  // Listen for link clicks → start on navigation
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

  // Intercept fetch → start/finish on API calls
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const url = typeof args[0] === "string" ? args[0] : (args[0] as Request).url;
      // Only track same-origin API & page requests, skip external
      const isInternal = url.startsWith("/") || url.startsWith(window.location.origin);
      if (isInternal) {
        activeRequests.current++;
        if (activeRequests.current === 1) start();
      }
      try {
        return await originalFetch(...args);
      } finally {
        if (isInternal) {
          activeRequests.current = Math.max(0, activeRequests.current - 1);
          if (activeRequests.current === 0) finish();
        }
      }
    };
    return () => {
      window.fetch = originalFetch;
    };
  }, [start, finish]);

  // Complete when pathname changes (navigation done)
  useEffect(() => {
    if (pathname !== prevPath.current) {
      prevPath.current = pathname;
      activeRequests.current = 0;
      finish();
    }
  }, [pathname, finish]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
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

"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    plausible?: (eventName: string, opts?: { props?: Record<string, any> }) => void;
  }
}

function closestWithDataset(el: HTMLElement | null): HTMLElement | null {
  let cur: HTMLElement | null = el;
  while (cur) {
    if (cur.dataset && cur.dataset.track) return cur;
    cur = cur.parentElement;
  }
  return null;
}

export default function ClickTracker() {
  useEffect(() => {
    function onClick(ev: MouseEvent) {
      const t = ev.target as HTMLElement | null;
      const el = closestWithDataset(t);
      if (!el) return;

      const eventName = el.dataset.track;
      if (!eventName) return;

      const props: Record<string, any> = {};
      Object.entries(el.dataset).forEach(([k, v]) => {
        if (!v) return;
        if (k === "track") return;
        props[k] = v;
      });

      // GA4
      if (typeof window.gtag === "function") {
        window.gtag("event", eventName, props);
      }

      // Plausible
      if (typeof window.plausible === "function") {
        window.plausible(eventName, { props });
      }
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}

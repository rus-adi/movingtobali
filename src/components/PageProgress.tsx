"use client";

import { useEffect, useState } from "react";

export default function PageProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function update() {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop || 0;
      const scrollHeight = doc.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) {
        setProgress(0);
        return;
      }
      const next = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
      setProgress(next);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-0.5" aria-hidden="true">
      <div
        className="h-full origin-left bg-gradient-to-r from-amber-400 via-emerald-600 to-emerald-700 shadow-[0_0_12px_rgba(47,107,79,0.35)] transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress / 100})` }}
      />
    </div>
  );
}

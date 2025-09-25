"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export const RouteProgress = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const timerRef = useRef<number | null>(null);

  const clear = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    // Trigger on any route/search change
    setVisible(true);
    setWidth(10);

    clear();

    // Simulate progressive loading for perceived performance
    timerRef.current = window.setTimeout(() => setWidth(35), 80);
    timerRef.current = window.setTimeout(() => setWidth(65), 220);
    timerRef.current = window.setTimeout(() => setWidth(85), 420);

    // Finish shortly after paint
    timerRef.current = window.setTimeout(() => {
      setWidth(100);
      // Hide after brief delay
      timerRef.current = window.setTimeout(() => {
        setVisible(false);
        setWidth(0);
      }, 180);
    }, 650);

    return () => clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams?.toString()]);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[100] h-0.5 bg-transparent">
      <div
        className="h-full bg-slate-900 transition-[width] duration-200 ease-out shadow-[0_0_12px_1px_rgba(15,23,42,0.25)]"
        style={{ width: `${width}%` }}
      />
    </div>
  );
};

export default RouteProgress;
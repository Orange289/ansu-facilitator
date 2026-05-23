"use client";

import {useEffect, useState} from "react";

export function CustomCursor() {
  const [position, setPosition] = useState({x: -100, y: -100});
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      setPosition({x: event.clientX, y: event.clientY});
      const target = event.target as HTMLElement | null;
      setIsPointer(Boolean(target?.closest("a, button, input, textarea, select")));
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed left-0 top-0 z-[100] hidden rounded-full border border-line/70 bg-line/20 mix-blend-multiply transition-[width,height,background-color,border-color] duration-300 ease-out md:block ${
        isPointer ? "h-12 w-12 bg-line/28" : "h-7 w-7"
      }`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`
      }}
    />
  );
}

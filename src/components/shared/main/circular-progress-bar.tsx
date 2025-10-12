"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export default function CircularProgressBar({
  persentage,
  strokeColor,
  strokeWidth,
  radius,
  className,
}: {
  persentage: number;
  strokeColor: string;
  strokeWidth: number;
  radius: number;
  className?: string;
}) {
  const dashArray = 2 * Math.PI * radius;
  const size = (strokeWidth + radius) * 2;
  const [dashOffset, setDashOffset] = useState(dashArray);

  useEffect(() => {
    const progressOffset = dashArray - (dashArray * persentage) / 100;
    setDashOffset(progressOffset);
  }, [dashArray, persentage]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cn("-rotate-90 rounded-full", className)}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        strokeWidth={strokeWidth}
        r={radius}
        className={cn("fill-transparent opacity-10 ", strokeColor)}
      />

      <circle
        cx={size / 2}
        cy={size / 2}
        strokeWidth={strokeWidth}
        r={radius}
        className={cn("fill-transparent", strokeColor)}
        style={{
          strokeDasharray: dashArray,
          strokeDashoffset: dashOffset,
          transition: "stroke-dashoffset 3s ease-in",
        }}
      />
    </svg>
  );
}

"use client";

import { useGesture } from "@use-gesture/react";
import { animate, motion, useMotionValue } from "framer-motion";
import { ReactNode, useRef } from "react";

interface SwipeableItemProps {
  children: ReactNode;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
}

export const SwipeableItem = ({
  children,
  leftContent,
  rightContent,
}: SwipeableItemProps) => {
  const x = useMotionValue(0);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  const SNAP_THRESHOLD = 0.4;

  const bind = useGesture(
    {
      onDrag: ({ movement: [mx], memo = x.get(), first }) => {
        const maxLeft = leftRef.current?.offsetWidth ?? 0;
        const maxRight = rightRef.current?.offsetWidth ?? 0;
        const origin = first ? x.get() : memo;
        const target = origin + mx;
        const clamped = Math.max(-maxRight, Math.min(maxLeft, target));
        x.set(clamped);
        return origin;
      },
      onDragEnd: () => {
        const maxLeft = leftRef.current?.offsetWidth ?? 0;
        const maxRight = rightRef.current?.offsetWidth ?? 0;
        const current = x.get();

        if (current > 0) {
          const snapOpen = current >= maxLeft * SNAP_THRESHOLD;
          animate(x, snapOpen ? maxLeft : 0, {
            type: "spring",
            stiffness: 400,
            damping: 40,
          });
        } else if (current < 0) {
          const snapOpen = Math.abs(current) >= maxRight * SNAP_THRESHOLD;
          animate(x, snapOpen ? -maxRight : 0, {
            type: "spring",
            stiffness: 400,
            damping: 40,
          });
        }
      },
    },
    {
      drag: {
        axis: "x",
        filterTaps: true,
        pointer: { touch: true },
      },
    },
  );

  return (
    <div className="relative overflow-hidden">
      {/* Left action panel (revealed on swipe-right) */}
      {leftContent && (
        <div
          ref={leftRef}
          className="absolute inset-y-0 left-0 flex items-center justify-center"
        >
          {leftContent}
        </div>
      )}

      {/* Right action panel (revealed on swipe-left) */}
      {rightContent && (
        <div
          ref={rightRef}
          className="absolute inset-y-0 right-0 flex items-center justify-center"
        >
          {rightContent}
        </div>
      )}

      {/* Main content — slides over the action panels */}
      <div {...bind()} style={{ touchAction: "pan-y" }}>
        <motion.div style={{ x }} className="relative bg-background">
          {children}
        </motion.div>
      </div>
    </div>
  );
};

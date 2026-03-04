"use client";

import { useGesture } from "@use-gesture/react";
import { animate, motion, useMotionValue } from "framer-motion";
import { ReactNode, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";

interface SwipeButton {
  icon: ReactNode;
  onClick: () => void;
}

interface SwipeableItemProps {
  children: ReactNode;
  leftButtons?: SwipeButton[];
  rightButtons?: SwipeButton[];
}

export const SwipeableItem = ({
  children,
  leftButtons,
  rightButtons,
}: SwipeableItemProps) => {
  const x = useMotionValue(0);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const SNAP_THRESHOLD = 0.4;

  const resetPosition = () => {
    animate(x, 0, {
      type: "spring",
      stiffness: 400,
      damping: 40,
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target =
        event instanceof MouseEvent ? event.target : event.touches[0]?.target;

      if (
        containerRef.current &&
        target &&
        !containerRef.current.contains(target as Node) &&
        x.get() !== 0
      ) {
        resetPosition();
      }
    };

    document.addEventListener("mousedown", handleClickOutside as EventListener);
    document.addEventListener(
      "touchstart",
      handleClickOutside as EventListener,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside as EventListener,
      );
      document.removeEventListener(
        "touchstart",
        handleClickOutside as EventListener,
      );
    };
  }, [x]);

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
    <div ref={containerRef} className="relative overflow-hidden">
      {/* Left action panel (revealed on swipe-right) */}
      {leftButtons && leftButtons.length > 0 && (
        <div
          ref={leftRef}
          className="absolute inset-y-0 left-0 flex items-center gap-2 px-2"
        >
          {leftButtons.map((button, index) => (
            <Button
              key={index}
              onClick={button.onClick}
              variant="destructive"
              className="rounded-full size-8"
            >
              {button.icon}
            </Button>
          ))}
        </div>
      )}

      {/* Right action panel (revealed on swipe-left) */}
      {rightButtons && rightButtons.length > 0 && (
        <div
          ref={rightRef}
          className="absolute inset-y-0 right-0 flex items-center gap-2 px-2"
        >
          {rightButtons.map((button, index) => (
            <Button
              key={index}
              onClick={button.onClick}
              variant="destructive"
              className="rounded-full size-8"
            >
              {button.icon}
            </Button>
          ))}
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

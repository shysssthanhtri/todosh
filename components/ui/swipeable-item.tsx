"use client";

import { useGesture } from "@use-gesture/react";
import { animate, motion, useMotionValue } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";

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
  const leftButtonWidth = useMotionValue(32);
  const rightButtonWidth = useMotionValue(32);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLeftExpanding, setIsLeftExpanding] = useState(false);
  const [isRightExpanding, setIsRightExpanding] = useState(false);
  const originalLeftWidth = useRef<number>(0);
  const originalRightWidth = useRef<number>(0);

  const SNAP_THRESHOLD = 0.4;
  const TRIGGER_THRESHOLD = 1.5;
  const BASE_BUTTON_SIZE = 32;

  const resetPosition = () => {
    animate(x, 0, {
      type: "spring",
      stiffness: 400,
      damping: 40,
    });
    animate(leftButtonWidth, BASE_BUTTON_SIZE, {
      type: "spring",
      stiffness: 400,
      damping: 40,
    });
    animate(rightButtonWidth, BASE_BUTTON_SIZE, {
      type: "spring",
      stiffness: 400,
      damping: 40,
    });
    setIsOpen(false);
    setIsLeftExpanding(false);
    setIsRightExpanding(false);
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
        if (first) {
          if (!originalLeftWidth.current && leftRef.current) {
            originalLeftWidth.current = leftRef.current.offsetWidth;
          }
          if (!originalRightWidth.current && rightRef.current) {
            originalRightWidth.current = rightRef.current.offsetWidth;
          }
        }

        const maxLeft =
          originalLeftWidth.current || (leftRef.current?.offsetWidth ?? 0);
        const maxRight =
          originalRightWidth.current || (rightRef.current?.offsetWidth ?? 0);
        const origin = first ? x.get() : memo;
        const target = origin + mx;

        let clampedMax = maxLeft;
        let clampedMin = -maxRight;

        if (isOpen && leftButtons?.length === 1 && target > maxLeft) {
          clampedMax = maxLeft * TRIGGER_THRESHOLD;
          const progress = Math.min(
            (target - maxLeft) / (maxLeft * (TRIGGER_THRESHOLD - 1)),
            1,
          );
          const expandedWidth =
            BASE_BUTTON_SIZE + progress * (maxLeft - BASE_BUTTON_SIZE);
          leftButtonWidth.set(expandedWidth);
          setIsLeftExpanding(true);
        } else {
          leftButtonWidth.set(BASE_BUTTON_SIZE);
          setIsLeftExpanding(false);
        }

        if (isOpen && rightButtons?.length === 1 && target < -maxRight) {
          clampedMin = -maxRight * TRIGGER_THRESHOLD;
          const progress = Math.min(
            (Math.abs(target) - maxRight) /
              (maxRight * (TRIGGER_THRESHOLD - 1)),
            1,
          );
          const expandedWidth =
            BASE_BUTTON_SIZE + progress * (maxRight - BASE_BUTTON_SIZE);
          rightButtonWidth.set(expandedWidth);
          setIsRightExpanding(true);
        } else {
          rightButtonWidth.set(BASE_BUTTON_SIZE);
          setIsRightExpanding(false);
        }

        const clamped = Math.max(clampedMin, Math.min(clampedMax, target));
        x.set(clamped);
        return origin;
      },
      onDragEnd: () => {
        const maxLeft =
          originalLeftWidth.current || (leftRef.current?.offsetWidth ?? 0);
        const maxRight =
          originalRightWidth.current || (rightRef.current?.offsetWidth ?? 0);
        const current = x.get();

        if (current > 0) {
          const snapOpen = current >= maxLeft * SNAP_THRESHOLD;

          if (
            isOpen &&
            leftButtons?.length === 1 &&
            current >= maxLeft * TRIGGER_THRESHOLD
          ) {
            leftButtons[0].onClick();
            resetPosition();
            return;
          }

          animate(x, snapOpen ? maxLeft : 0, {
            type: "spring",
            stiffness: 400,
            damping: 40,
          });
          setIsOpen(snapOpen);
          setIsLeftExpanding(false);
        } else if (current < 0) {
          const snapOpen = Math.abs(current) >= maxRight * SNAP_THRESHOLD;

          if (
            isOpen &&
            rightButtons?.length === 1 &&
            Math.abs(current) >= maxRight * TRIGGER_THRESHOLD
          ) {
            rightButtons[0].onClick();
            resetPosition();
            return;
          }

          animate(x, snapOpen ? -maxRight : 0, {
            type: "spring",
            stiffness: 400,
            damping: 40,
          });
          setIsOpen(snapOpen);
          setIsRightExpanding(false);
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
            <motion.div
              key={index}
              style={
                leftButtons.length === 1
                  ? { width: leftButtonWidth }
                  : undefined
              }
              className="flex items-center justify-center"
              animate={
                leftButtons.length === 1 && isLeftExpanding
                  ? { opacity: 0.7 }
                  : { opacity: 1 }
              }
              transition={{
                opacity: {
                  duration: 0.2,
                  ease: "easeOut",
                },
              }}
            >
              <Button
                onClick={button.onClick}
                variant="destructive"
                className="rounded-full size-8 w-full"
              >
                {button.icon}
              </Button>
            </motion.div>
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
            <motion.div
              key={index}
              style={
                rightButtons.length === 1
                  ? { width: rightButtonWidth }
                  : undefined
              }
              className="flex items-center justify-center"
              animate={
                rightButtons.length === 1 && isRightExpanding
                  ? { opacity: 0.7 }
                  : { opacity: 1 }
              }
              transition={{
                opacity: {
                  duration: 0.2,
                  ease: "easeOut",
                },
              }}
            >
              <Button
                onClick={button.onClick}
                variant="destructive"
                className="rounded-full size-8 w-full"
              >
                {button.icon}
              </Button>
            </motion.div>
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

"use client";

import { useGesture } from "@use-gesture/react";
import { animate, motion, useMotionValue } from "framer-motion";
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Button } from "@/components/ui/button";

interface SwipeButton {
  icon: ReactNode;
  onClick: () => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  className?: string;
  ariaLabel?: string;
}

interface SwipeableItemProps {
  children: ReactNode;
  leftButtons?: SwipeButton[];
  rightButtons?: SwipeButton[];
  snapThreshold?: number;
  triggerThreshold?: number;
  baseButtonSize?: number;
  disabled?: boolean;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
  springConfig?: {
    stiffness?: number;
    damping?: number;
  };
}

const DEFAULT_SPRING_CONFIG = {
  type: "spring" as const,
  stiffness: 400,
  damping: 40,
};

const OPACITY_TRANSITION = {
  opacity: {
    duration: 0.2,
    ease: "easeOut" as const,
  },
};

export const SwipeableItem = ({
  children,
  leftButtons,
  rightButtons,
  snapThreshold = 0.4,
  triggerThreshold = 1.5,
  baseButtonSize = 32,
  disabled = false,
  onSwipeStart,
  onSwipeEnd,
  springConfig,
}: SwipeableItemProps) => {
  const x = useMotionValue(0);
  const leftButtonWidth = useMotionValue(baseButtonSize);
  const rightButtonWidth = useMotionValue(baseButtonSize);

  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const widthCache = useRef({ left: 0, right: 0 });

  const [isOpen, setIsOpen] = useState(false);
  const [expandState, setExpandState] = useState<{
    left: boolean;
    right: boolean;
  }>({ left: false, right: false });

  const animationConfig = useMemo(
    () => ({
      ...DEFAULT_SPRING_CONFIG,
      ...springConfig,
    }),
    [springConfig],
  );

  const triggerHapticFeedback = useCallback(() => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(10);
    }
  }, []);

  const resetPosition = useCallback(() => {
    animate(x, 0, animationConfig);
    animate(leftButtonWidth, baseButtonSize, animationConfig);
    animate(rightButtonWidth, baseButtonSize, animationConfig);
    setIsOpen(false);
    setExpandState({ left: false, right: false });
  }, [x, leftButtonWidth, rightButtonWidth, baseButtonSize, animationConfig]);

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
  }, [x, resetPosition]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && x.get() !== 0) {
        resetPosition();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [x, resetPosition]);

  const bind = useGesture(
    {
      onDrag: ({ movement: [mx], memo = x.get(), first }) => {
        if (disabled) return memo;

        if (first) {
          widthCache.current = {
            left: leftRef.current?.offsetWidth ?? 0,
            right: rightRef.current?.offsetWidth ?? 0,
          };
          onSwipeStart?.();
        }

        const { left: maxLeft, right: maxRight } = widthCache.current;
        const origin = first ? x.get() : memo;
        const target = origin + mx;

        let clampedMax = maxLeft;
        let clampedMin = -maxRight;

        if (isOpen && leftButtons?.length === 1 && target > maxLeft) {
          clampedMax = maxLeft * triggerThreshold;
          const progress = Math.min(
            (target - maxLeft) / (maxLeft * (triggerThreshold - 1)),
            1,
          );
          const expandedWidth =
            baseButtonSize + progress * (maxLeft - baseButtonSize);
          leftButtonWidth.set(expandedWidth);

          if (!expandState.left && progress > 0.9) {
            triggerHapticFeedback();
          }
          setExpandState((prev) => ({ ...prev, left: true }));
        } else {
          leftButtonWidth.set(baseButtonSize);
          setExpandState((prev) => ({ ...prev, left: false }));
        }

        if (isOpen && rightButtons?.length === 1 && target < -maxRight) {
          clampedMin = -maxRight * triggerThreshold;
          const progress = Math.min(
            (Math.abs(target) - maxRight) / (maxRight * (triggerThreshold - 1)),
            1,
          );
          const expandedWidth =
            baseButtonSize + progress * (maxRight - baseButtonSize);
          rightButtonWidth.set(expandedWidth);

          if (!expandState.right && progress > 0.9) {
            triggerHapticFeedback();
          }
          setExpandState((prev) => ({ ...prev, right: true }));
        } else {
          rightButtonWidth.set(baseButtonSize);
          setExpandState((prev) => ({ ...prev, right: false }));
        }

        const clamped = Math.max(clampedMin, Math.min(clampedMax, target));
        x.set(clamped);
        return origin;
      },
      onDragEnd: () => {
        if (disabled) return;

        const { left: maxLeft, right: maxRight } = widthCache.current;
        const current = x.get();

        if (current > 0) {
          const snapOpen = current >= maxLeft * snapThreshold;

          if (
            isOpen &&
            leftButtons?.length === 1 &&
            current >= maxLeft * triggerThreshold
          ) {
            triggerHapticFeedback();
            leftButtons[0].onClick();
            resetPosition();
            onSwipeEnd?.();
            return;
          }

          animate(x, snapOpen ? maxLeft : 0, animationConfig);
          setIsOpen(snapOpen);
          setExpandState((prev) => ({ ...prev, left: false }));
          onSwipeEnd?.();
        } else if (current < 0) {
          const snapOpen = Math.abs(current) >= maxRight * snapThreshold;

          if (
            isOpen &&
            rightButtons?.length === 1 &&
            Math.abs(current) >= maxRight * triggerThreshold
          ) {
            triggerHapticFeedback();
            rightButtons[0].onClick();
            resetPosition();
            onSwipeEnd?.();
            return;
          }

          animate(x, snapOpen ? -maxRight : 0, animationConfig);
          setIsOpen(snapOpen);
          setExpandState((prev) => ({ ...prev, right: false }));
          onSwipeEnd?.();
        } else {
          onSwipeEnd?.();
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

  const renderButtons = (
    buttons: SwipeButton[],
    side: "left" | "right",
    ref: React.RefObject<HTMLDivElement | null>,
    buttonWidth: typeof leftButtonWidth,
    isExpanding: boolean,
  ) => (
    <div
      ref={ref}
      className={`absolute inset-y-0 ${side === "left" ? "left-0" : "right-0"} flex items-center gap-2 px-2`}
      role="group"
      aria-label={`${side} swipe actions`}
    >
      {buttons.map((button, index) => (
        <motion.div
          key={index}
          style={buttons.length === 1 ? { width: buttonWidth } : undefined}
          className="flex items-center justify-center"
          animate={
            buttons.length === 1 && isExpanding
              ? { opacity: 0.7 }
              : { opacity: 1 }
          }
          transition={OPACITY_TRANSITION}
        >
          <Button
            onClick={button.onClick}
            variant={button.variant ?? "destructive"}
            className={button.className ?? "rounded-full size-8 w-full"}
            aria-label={button.ariaLabel}
          >
            {button.icon}
          </Button>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      role="region"
      aria-label="Swipeable item"
    >
      {leftButtons &&
        leftButtons.length > 0 &&
        renderButtons(
          leftButtons,
          "left",
          leftRef,
          leftButtonWidth,
          expandState.left,
        )}

      {rightButtons &&
        rightButtons.length > 0 &&
        renderButtons(
          rightButtons,
          "right",
          rightRef,
          rightButtonWidth,
          expandState.right,
        )}

      <div {...bind()} style={{ touchAction: disabled ? "auto" : "pan-y" }}>
        <motion.div style={{ x }} className="relative bg-background">
          {children}
        </motion.div>
      </div>
    </div>
  );
};

"use client";

import { type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

import { Button, buttonVariants } from "./button";

const SWIPE_THRESHOLD = 20;
const BUTTON_WIDTH = 32;
const VELOCITY_THRESHOLD = 0.3;
const DRAG_THRESHOLD = 12;
const DEFAULT_FULL_SWIPE_THRESHOLD = 0.5;
const FULL_SWIPE_ANIMATION_DURATION = 300;
const DEFAULT_ACTION_DELAY = 300;

interface SwipeButton {
  icon: React.ReactNode;
  onClick: () => void;
  ariaLabel?: string;
  className?: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
}

interface SwipeableItemProps extends React.ComponentProps<"div"> {
  leftButtons?: SwipeButton[];
  rightButtons?: SwipeButton[];
  /** When true, swiping past the threshold triggers the first action automatically */
  fullSwipe?: boolean;
  /** 0-1 fraction of item width required to trigger fullSwipe (default 0.5) */
  fullSwipeThreshold?: number;
  /** Delay in ms after the slide-out animation before calling the full-swipe action (default 300) */
  actionDelay?: number;
  /** Called when the item is removed after a destructive full-swipe */
  onFullSwipeLeft?: () => void;
  /** Called when the item is removed after a full-swipe to the right */
  onFullSwipeRight?: () => void;
}

function SwipeableItem({
  leftButtons = [],
  rightButtons = [],
  fullSwipe = false,
  fullSwipeThreshold = DEFAULT_FULL_SWIPE_THRESHOLD,
  actionDelay = DEFAULT_ACTION_DELAY,
  onFullSwipeLeft,
  onFullSwipeRight,
  children,
  className,
  ...props
}: SwipeableItemProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const leftActionsRef = React.useRef<HTMLDivElement>(null);
  const rightActionsRef = React.useRef<HTMLDivElement>(null);
  const startXRef = React.useRef(0);
  const startYRef = React.useRef(0);
  const currentXRef = React.useRef(0);
  const currentOffsetRef = React.useRef(0);
  const startTimeRef = React.useRef(0);
  const isSwipingRef = React.useRef(false);
  const pointerIdRef = React.useRef<number | null>(null);
  const pointerTargetRef = React.useRef<HTMLElement | null>(null);
  const directionLockedRef = React.useRef<"horizontal" | "vertical" | null>(
    null,
  );
  const [isOpen, setIsOpen] = React.useState<"left" | "right" | null>(null);
  const isOpenRef = React.useRef<"left" | "right" | null>(null);
  const fullSwipeActiveRef = React.useRef<"left" | "right" | null>(null);

  const leftMaxOffset =
    leftButtons.length * BUTTON_WIDTH + leftButtons.length * 8;
  const rightMaxOffset =
    rightButtons.length * BUTTON_WIDTH + leftButtons.length * 8;

  // Direct DOM update — no React re-render during drag
  const setTransform = React.useCallback(
    (x: number, animate: boolean, duration?: number) => {
      const el = contentRef.current;
      if (!el) return;
      const ms = duration ?? 300;
      el.style.transition = animate
        ? `transform ${ms}ms cubic-bezier(0.25, 1, 0.5, 1)`
        : "none";
      el.style.transform = `translateX(${x}px)`;
      currentOffsetRef.current = x;
    },
    [],
  );

  const animateTo = React.useCallback(
    (target: number) => {
      setTransform(target, true);
      if (target === 0) {
        isOpenRef.current = null;
        setIsOpen(null);
      } else if (target > 0) {
        isOpenRef.current = "left";
        setIsOpen("left");
      } else {
        isOpenRef.current = "right";
        setIsOpen("right");
      }
    },
    [setTransform],
  );

  /** Update the opacity of the first button based on swipe progress */
  const updateButtonOpacity = React.useCallback(
    (side: "left" | "right" | null, progress: number) => {
      // Reset previous side if switching
      if (fullSwipeActiveRef.current && fullSwipeActiveRef.current !== side) {
        const prevContainer =
          fullSwipeActiveRef.current === "left"
            ? leftActionsRef.current
            : rightActionsRef.current;
        const prevBtn = prevContainer?.querySelector("button");
        if (prevBtn) {
          (prevBtn as HTMLElement).style.transform = "";
        }
      }

      fullSwipeActiveRef.current = side;
      if (!side) return;

      const actionsContainer =
        side === "left" ? leftActionsRef.current : rightActionsRef.current;
      const firstButtonEl = actionsContainer?.querySelector(
        "button",
      ) as HTMLElement | null;
      if (!firstButtonEl) return;

      const t = Math.min(progress / fullSwipeThreshold, 1);
      const scale = 1 + t * 0.2;
      firstButtonEl.style.transform = `scale(${scale})`;
    },
    [fullSwipeThreshold],
  );

  /** Reset button opacity back to default */
  const resetButtonOpacity = React.useCallback(() => {
    if (!fullSwipeActiveRef.current) return;
    const container =
      fullSwipeActiveRef.current === "left"
        ? leftActionsRef.current
        : rightActionsRef.current;
    const btn = container?.querySelector("button") as HTMLElement | null;
    if (btn) {
      btn.style.transform = "";
    }
    fullSwipeActiveRef.current = null;
  }, []);

  /** Slide content fully off-screen then trigger the action */
  const triggerFullSwipe = React.useCallback(
    (direction: "left" | "right") => {
      const containerWidth =
        containerRef.current?.offsetWidth ?? window.innerWidth;
      const target = direction === "right" ? containerWidth : -containerWidth;

      setTransform(target, true, FULL_SWIPE_ANIMATION_DURATION);

      // Stop the opacity effect — action is now confirmed
      resetButtonOpacity();

      const buttons = direction === "right" ? leftButtons : rightButtons;
      const firstAction = buttons[0]?.onClick;
      const callback =
        direction === "left" ? onFullSwipeLeft : onFullSwipeRight;

      // Fire the first button action (or the dedicated callback) after animation
      setTimeout(() => {
        if (callback) {
          callback();
        } else if (firstAction) {
          firstAction();
        }
      }, actionDelay);
    },
    [
      setTransform,
      resetButtonOpacity,
      leftButtons,
      rightButtons,
      onFullSwipeLeft,
      onFullSwipeRight,
      actionDelay,
    ],
  );

  // Close on outside click
  React.useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: PointerEvent) {
      if (
        contentRef.current &&
        !contentRef.current.parentElement?.contains(e.target as Node)
      ) {
        animateTo(0);
      }
    }
    document.addEventListener("pointerdown", handleClick);
    return () => document.removeEventListener("pointerdown", handleClick);
  }, [isOpen, animateTo]);

  const handlePointerDown = React.useCallback((e: React.PointerEvent) => {
    // Only handle primary button / single touch
    if (e.button !== 0) return;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    currentXRef.current = e.clientX;
    startTimeRef.current = Date.now();
    isSwipingRef.current = false;
    directionLockedRef.current = null;
    pointerIdRef.current = e.pointerId;
    pointerTargetRef.current = e.currentTarget as HTMLElement;
    // Don't capture yet — wait until we confirm a horizontal swipe
    // so that clicks on children (checkbox, links) work normally
  }, []);

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent) => {
      if (pointerIdRef.current !== e.pointerId) return;
      if (startXRef.current === 0) return;

      const deltaX = e.clientX - startXRef.current;
      const deltaY = e.clientY - startYRef.current;

      // Lock direction on first significant movement
      if (!directionLockedRef.current) {
        const absDx = Math.abs(deltaX);
        const absDy = Math.abs(deltaY);
        if (absDx < DRAG_THRESHOLD && absDy < DRAG_THRESHOLD) return;
        directionLockedRef.current = absDx > absDy ? "horizontal" : "vertical";
      }

      // If vertical scroll, don't handle — let browser scroll
      if (directionLockedRef.current === "vertical") {
        startXRef.current = 0;
        pointerIdRef.current = null;
        return;
      }

      // First time we confirm horizontal swipe: capture pointer & enter swiping mode
      if (!isSwipingRef.current) {
        if (pointerTargetRef.current && pointerIdRef.current !== null) {
          pointerTargetRef.current.setPointerCapture(pointerIdRef.current);
        }
      }

      currentXRef.current = e.clientX;
      isSwipingRef.current = true;

      const baseOffset =
        isOpenRef.current === "left"
          ? leftMaxOffset
          : isOpenRef.current === "right"
            ? -rightMaxOffset
            : 0;
      let newOffset = baseOffset + deltaX;

      // Clamp: only allow left swipe if rightButtons exist, right swipe if leftButtons exist
      if (leftButtons.length === 0 && newOffset > 0) newOffset = 0;
      if (rightButtons.length === 0 && newOffset < 0) newOffset = 0;

      // Add rubber-band resistance past the max
      if (newOffset > leftMaxOffset) {
        const over = newOffset - leftMaxOffset;
        newOffset = leftMaxOffset + over * 0.3;
      }
      if (newOffset < -rightMaxOffset) {
        const over = -rightMaxOffset - newOffset;
        newOffset = -rightMaxOffset - over * 0.3;
      }

      setTransform(newOffset, false);

      // Full-swipe: smoothly increase button opacity with swipe progress
      if (fullSwipe) {
        const containerWidth =
          containerRef.current?.offsetWidth ?? window.innerWidth;
        const progress = Math.abs(newOffset) / containerWidth;
        if (Math.abs(newOffset) > 0) {
          updateButtonOpacity(newOffset > 0 ? "left" : "right", progress);
        } else {
          resetButtonOpacity();
        }
      }
    },
    [
      leftMaxOffset,
      rightMaxOffset,
      leftButtons.length,
      rightButtons.length,
      setTransform,
      fullSwipe,
      updateButtonOpacity,
      resetButtonOpacity,
    ],
  );

  const handlePointerUp = React.useCallback(
    (e: React.PointerEvent) => {
      if (pointerIdRef.current !== e.pointerId) return;

      if (
        pointerTargetRef.current &&
        pointerTargetRef.current.hasPointerCapture(e.pointerId)
      ) {
        pointerTargetRef.current.releasePointerCapture(e.pointerId);
      }
      pointerIdRef.current = null;
      pointerTargetRef.current = null;

      if (!isSwipingRef.current) {
        // It was a tap, not a swipe — close if open
        if (isOpenRef.current) {
          animateTo(0);
        }
        startXRef.current = 0;
        return;
      }

      const deltaX = currentXRef.current - startXRef.current;
      const elapsed = Date.now() - startTimeRef.current;
      const velocity = Math.abs(deltaX) / elapsed; // px/ms

      const isQuickSwipe = velocity > VELOCITY_THRESHOLD;

      // --- Full-swipe detection ---
      if (fullSwipe) {
        const containerWidth =
          containerRef.current?.offsetWidth ?? window.innerWidth;
        const progress = Math.abs(currentOffsetRef.current) / containerWidth;

        if (
          progress >= fullSwipeThreshold &&
          deltaX > 0 &&
          leftButtons.length > 0
        ) {
          triggerFullSwipe("right");
          isSwipingRef.current = false;
          startXRef.current = 0;
          return;
        }
        if (
          progress >= fullSwipeThreshold &&
          deltaX < 0 &&
          rightButtons.length > 0
        ) {
          triggerFullSwipe("left");
          isSwipingRef.current = false;
          startXRef.current = 0;
          return;
        }
      }

      if (deltaX > 0 && leftButtons.length > 0) {
        // Swiping right → reveal left buttons
        if (
          isOpenRef.current === "left"
            ? deltaX > -SWIPE_THRESHOLD
            : deltaX > SWIPE_THRESHOLD || isQuickSwipe
        ) {
          animateTo(leftMaxOffset);
        } else {
          animateTo(0);
        }
      } else if (deltaX < 0 && rightButtons.length > 0) {
        // Swiping left → reveal right buttons
        if (
          isOpenRef.current === "right"
            ? deltaX < SWIPE_THRESHOLD
            : deltaX < -SWIPE_THRESHOLD || isQuickSwipe
        ) {
          animateTo(-rightMaxOffset);
        } else {
          animateTo(0);
        }
      } else {
        // Closing
        if (isOpenRef.current === "left" && deltaX < -SWIPE_THRESHOLD) {
          animateTo(0);
        } else if (isOpenRef.current === "right" && deltaX > SWIPE_THRESHOLD) {
          animateTo(0);
        } else if (isOpenRef.current) {
          // Snap back open
          animateTo(
            isOpenRef.current === "left" ? leftMaxOffset : -rightMaxOffset,
          );
        } else {
          animateTo(0);
        }
      }

      isSwipingRef.current = false;
      startXRef.current = 0;

      // Clean up button opacity
      resetButtonOpacity();
    },
    [
      leftButtons.length,
      rightButtons.length,
      leftMaxOffset,
      rightMaxOffset,
      animateTo,
      fullSwipe,
      fullSwipeThreshold,
      triggerFullSwipe,
      resetButtonOpacity,
    ],
  );

  const handleButtonClick = React.useCallback(
    (onClick: () => void) => {
      onClick();
      animateTo(0);
    },
    [animateTo],
  );

  return (
    <div
      ref={containerRef}
      data-slot="swipeable-item"
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      {/* Left action buttons (revealed on swipe right) */}
      {leftButtons.length > 0 && (
        <div
          ref={leftActionsRef}
          className="absolute inset-y-0 left-0 flex items-center justify-evenly"
          style={{ width: leftMaxOffset }}
        >
          {leftButtons.map((button, index) => (
            <Button
              key={index}
              type="button"
              variant={button.variant}
              size="icon"
              aria-label={button.ariaLabel}
              onClick={() => handleButtonClick(button.onClick)}
              className={cn("rounded-full", button.className)}
            >
              {button.icon}
            </Button>
          ))}
        </div>
      )}

      {/* Right action buttons (revealed on swipe left) */}
      {rightButtons.length > 0 && (
        <div
          ref={rightActionsRef}
          className="absolute inset-y-0 right-0 flex items-center justify-evenly"
          style={{ width: rightMaxOffset }}
        >
          {rightButtons.map((button, index) => (
            <Button
              key={index}
              type="button"
              variant={button.variant}
              size="icon"
              aria-label={button.ariaLabel}
              onClick={() => handleButtonClick(button.onClick)}
              className={cn("rounded-full", button.className)}
            >
              {button.icon}
            </Button>
          ))}
        </div>
      )}

      {/* Swipeable content */}
      <div
        ref={contentRef}
        className="relative bg-background"
        style={{ touchAction: "pan-y" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {children}
      </div>
    </div>
  );
}

export { SwipeableItem };
export type { SwipeableItemProps, SwipeButton };

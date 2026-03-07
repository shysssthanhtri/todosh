"use client";

import { Calendar, FolderOpen, LayoutList } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useLayoutEffect, useRef, useState } from "react";

import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const navItems = [
  { href: ROUTES.TODAY, label: "Today", icon: Calendar },
  { href: ROUTES.UPCOMING, label: "Upcoming", icon: LayoutList },
  { href: ROUTES.BROWSE, label: "Browse", icon: FolderOpen },
] as const;

export function FooterNav() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const activeIndex = navItems.findIndex((item) => pathname === item.href);
  const hasActiveTab = activeIndex >= 0;

  useLayoutEffect(() => {
    const linkEl = hasActiveTab ? linkRefs.current[activeIndex] : null;
    const container = containerRef.current;
    if (linkEl && container) {
      const linkRect = linkEl.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setIndicatorStyle({
        left: linkRect.left - containerRect.left,
        width: linkRect.width,
      });
    } else {
      setIndicatorStyle({ left: 0, width: 0 });
    }
  }, [pathname, hasActiveTab, activeIndex]);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4 pt-2 md:pb-6 md:pt-4"
      aria-label="Main navigation"
    >
      <div
        ref={containerRef}
        className="relative mx-auto flex max-w-2xl items-center justify-center gap-1 rounded-full bg-muted px-2 py-2 shadow-sm"
      >
        {hasActiveTab && (
          <div
            className="absolute top-0 bottom-0 rounded-full ring-2 ring-primary transition-all duration-200 ease-out"
            style={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
            }}
            aria-hidden
          />
        )}
        {navItems.map(({ href, label, icon: Icon }, index) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              ref={(el) => {
                linkRefs.current[index] = el;
              }}
              href={href}
              className={cn(
                "relative z-10 flex flex-1 flex-col items-center gap-0.5 rounded-full px-3 py-2 text-xs font-medium transition-colors duration-200",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="size-5 shrink-0" aria-hidden />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

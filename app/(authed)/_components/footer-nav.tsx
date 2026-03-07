"use client";

import { Calendar, FolderOpen, LayoutList } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const navItems = [
  { href: ROUTES.TODAY, label: "Today", icon: Calendar },
  { href: ROUTES.UPCOMING, label: "Upcoming", icon: LayoutList },
  { href: ROUTES.BROWSE, label: "Browse", icon: FolderOpen },
] as const;

export function FooterNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4 pt-2 md:pb-6 md:pt-4"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-2xl items-center justify-center gap-1 rounded-full bg-muted px-2 py-2 shadow-sm">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 rounded-full px-3 py-2 text-xs font-medium transition-colors",
                isActive
                  ? "ring-2 ring-primary text-primary"
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

"use client";

import { LogOut } from "lucide-react";
import { useTransition } from "react";

import { signOutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { clearLocalData } from "@/lib/local-data";

export function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await clearLocalData();
      await signOutAction();
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
    >
      <LogOut aria-hidden />
      Sign out
    </Button>
  );
}

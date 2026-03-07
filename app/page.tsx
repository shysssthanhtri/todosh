import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export const metadata = {
  title: { absolute: "Todosh" },
  description:
    "Todosh is a simple and fast todo application. Manage your tasks, stay organized, and get things done.",
};

export default function LandingPage() {
  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center px-4 py-12">
      <div className="mx-auto max-w-md space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Todosh</h1>
          <p className="text-lg text-muted-foreground">
            A simple and fast todo application
          </p>
        </div>
        <p className="text-muted-foreground">
          Manage your tasks, stay organized, and get things done. Sign up to
          sync your todos across devices.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href={ROUTES.SIGNUP}>Sign up</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href={ROUTES.LOGIN}>Log in</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

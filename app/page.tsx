import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export const metadata = {
  title: { absolute: "Todosh" },
  description:
    "Todosh is a simple and fast todo application. Manage your tasks, stay organized, and get things done.",
  alternates: { canonical: "/" },
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
        <section className="space-y-3 pt-8 text-left">
          <h2 className="text-lg font-semibold tracking-tight">
            Simple task management
          </h2>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li>Add and complete tasks from any device.</li>
            <li>Sync your todo list so it’s always up to date.</li>
            <li>Free to use—no account required to try it out.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

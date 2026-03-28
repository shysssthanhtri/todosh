import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

import { SignOutButton } from "../_components/sign-out-button";

export const metadata = {
  title: "Browse",
  description: "Browse and organize your todos.",
};

export default async function BrowsePage({
  params,
  searchParams,
}: {
  params?: Promise<Record<string, string | string[]>>;
  searchParams?: Promise<Record<string, string | string[]>>;
}) {
  await params;
  await searchParams;
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">Browse</h1>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Manage how you organize your todos.
          </p>
          <Button asChild size="sm" variant="outline">
            <Link href={ROUTES.SETTINGS_LABELS}>Labels</Link>
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Signout.</p>
          <Button asChild size="sm" variant="outline">
            <SignOutButton />
          </Button>
        </div>
      </div>
    </>
  );
}

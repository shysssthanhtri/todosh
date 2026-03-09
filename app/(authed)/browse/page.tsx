import Link from "next/link";

import { SignOutButton } from "@/app/(authed)/_components/sign-out-button";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export const metadata = {
  title: "Browse",
  description: "Browse and organize your todos.",
};

const BrowsePage = () => {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Browse</h1>
        <SignOutButton />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Manage how you organize your todos.
        </p>
        <Button asChild size="sm" variant="outline">
          <Link href={ROUTES.SETTINGS_LABELS}>Labels</Link>
        </Button>
      </div>
    </div>
  );
};

export default BrowsePage;

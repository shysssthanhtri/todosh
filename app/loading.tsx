import { Loader2Icon } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background">
      <Loader2Icon className="size-8 animate-spin text-primary" />
    </div>
  );
}

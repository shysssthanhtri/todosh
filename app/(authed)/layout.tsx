import { ModeToggle } from "@/components/mode-toggle";

import { AutoSyncProvider } from "./_components/auto-sync-provider";
import { FooterNav } from "./_components/footer-nav";
import { SyncButton } from "./_components/sync-button";

export const metadata = {
  robots: { index: false, follow: false },
};

export default function AuthedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AutoSyncProvider>
        <div className="container mx-auto max-w-2xl px-4 py-6">
          <div className="flex justify-end gap-2 fixed top-5 right-5">
            <SyncButton />
            <ModeToggle />
          </div>

          <main className="container mx-auto pb-24">{children}</main>
        </div>
      </AutoSyncProvider>
      <FooterNav />
    </>
  );
}

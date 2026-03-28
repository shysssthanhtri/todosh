import { ModeToggle } from "@/components/mode-toggle";

import { FooterNav } from "./_components/footer-nav";

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
      <div className="container mx-auto max-w-2xl px-4 py-6">
        <div className="flex justify-end gap-2 fixed top-5 right-5">
          <ModeToggle />
        </div>

        <main className="container mx-auto pb-24">{children}</main>
      </div>
      <FooterNav />
    </>
  );
}

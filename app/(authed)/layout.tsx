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
      <main className="container mx-auto pb-24">{children}</main>
      <FooterNav />
    </>
  );
}

export default function AuthedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="container mx-auto">{children}</main>;
}

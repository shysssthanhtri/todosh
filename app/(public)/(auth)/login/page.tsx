import { LoginCard } from "./_components/login-card";

export const metadata = {
  title: "Log in",
  description:
    "Log in to Todosh to access your todo list and sync across devices.",
  alternates: { canonical: "/login" },
};

export default async function LoginPage({
  params,
  searchParams,
}: {
  params?: Promise<Record<string, string | string[]>>;
  searchParams?: Promise<Record<string, string | string[]>>;
}) {
  await params;
  await searchParams;
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginCard />
      </div>
    </div>
  );
}

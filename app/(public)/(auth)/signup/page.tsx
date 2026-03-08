import { SignupCard } from "./_components/signup-card";

export const metadata = {
  title: "Sign up",
  description:
    "Create a Todosh account to start managing your tasks and syncing across devices.",
  alternates: { canonical: "/signup" },
};

export default function SignupPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupCard />
      </div>
    </div>
  );
}

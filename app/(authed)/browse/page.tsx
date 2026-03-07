import { SignOutButton } from "@/app/(authed)/_components/sign-out-button";

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
    </div>
  );
};

export default BrowsePage;

export const metadata = {
  title: "Upcoming",
  description: "View your upcoming tasks and plan ahead.",
};

export default async function UpcomingPage({
  params,
  searchParams,
}: {
  params?: Promise<Record<string, string | string[]>>;
  searchParams?: Promise<Record<string, string | string[]>>;
}) {
  await params;
  await searchParams;
  return (
    <div className="container mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">Upcoming</h1>
    </div>
  );
}

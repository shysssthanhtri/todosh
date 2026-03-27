import { TodayTodoList } from "./_components/today-todo-list";

export const metadata = {
  title: "My Todos",
  description: "View and manage your todo list. Add, complete, and sync tasks.",
};

export default async function TodayPage({
  params,
  searchParams,
}: {
  params?: Promise<Record<string, string | string[]>>;
  searchParams?: Promise<Record<string, string | string[]>>;
}) {
  await params;
  await searchParams;
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">Today</h1>
      <TodayTodoList />
    </>
  );
}

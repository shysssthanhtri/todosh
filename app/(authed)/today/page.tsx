import { ModeToggle } from "@/components/mode-toggle";

import { AddTodoButton } from "./_components/add-todo-button";
import { SyncButton } from "./_components/sync-button";
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
    <div className="container mx-auto max-w-2xl px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="mb-6 text-2xl font-bold">Today</h1>
        <div className="flex items-center gap-2">
          <SyncButton />
          <ModeToggle />
        </div>
      </div>
      <TodayTodoList />
      <AddTodoButton />
    </div>
  );
}

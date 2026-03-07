import { ModeToggle } from "@/components/mode-toggle";

import { AddTodoButton } from "../(home)/_components/add-todo-button";
import { SyncButton } from "../(home)/_components/sync-button";
import { TodoList } from "../(home)/_components/todo-list";

export const metadata = {
  title: "My Todos",
  description: "View and manage your todo list. Add, complete, and sync tasks.",
};

const TodayPage = () => {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="mb-6 text-2xl font-bold">My Todos</h1>
        <div className="flex items-center gap-2">
          <SyncButton />
          <ModeToggle />
        </div>
      </div>
      <TodoList />
      <AddTodoButton />
    </div>
  );
};

export default TodayPage;

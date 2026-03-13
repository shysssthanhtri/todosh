import { endOfDay, startOfDay } from "date-fns";

import { ModeToggle } from "@/components/mode-toggle";

import { TodoListByDateRange } from "../_components/today-list-by-daterange";
import { AddTodoButton } from "./_components/add-todo-button";
import { SyncButton } from "./_components/sync-button";

export const metadata = {
  title: "My Todos",
  description: "View and manage your todo list. Add, complete, and sync tasks.",
};

const TodayPage = () => {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="mb-6 text-2xl font-bold">Today</h1>
        <div className="flex items-center gap-2">
          <SyncButton
            start={startOfDay(new Date())}
            end={endOfDay(new Date())}
          />
          <ModeToggle />
        </div>
      </div>
      <TodoListByDateRange
        start={startOfDay(new Date())}
        end={endOfDay(new Date())}
      />
      <AddTodoButton />
    </div>
  );
};

export default TodayPage;

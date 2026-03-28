import { getTodos } from "../_actions/todos.action";
import { TodayTodoList } from "./_components/today-todo-list";

export const metadata = {
  title: "My Todos",
  description: "View and manage your todo list. Add, complete, and sync tasks.",
};

export default async function TodosPage() {
  const todos = await getTodos();
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">Today</h1>
      <TodayTodoList todos={todos} />
    </>
  );
}

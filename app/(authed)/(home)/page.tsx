import { AddTodoButton } from "./_components/add-todo-button";
import { TodoList } from "./_components/todo-list";

const HomePage = () => {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">My Todos</h1>
      <TodoList />
      <AddTodoButton />
    </div>
  );
};

export default HomePage;

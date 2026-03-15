import { Separator } from "@/components/ui/separator";

import { RichTodoType } from "../types/rich-todo";
import { TodoItem } from "./todo-item";

interface TodoListProps {
  todos: RichTodoType[];
}
export const TodoList = ({ todos }: TodoListProps) => {
  return (
    <div className="flex flex-col">
      {todos.map((todo) => (
        <div key={todo.id}>
          <TodoItem
            todo={todo}
            onToggle={todo.onToggle}
            onDelete={todo.onDelete}
          />
          <Separator />
        </div>
      ))}
    </div>
  );
};

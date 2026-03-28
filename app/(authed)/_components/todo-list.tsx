import { LabelSchemaType } from "@/schemas/label";

import { RichTodoType } from "../_types/rich-todo";
import { InteractiveTodoItem } from "./interactive-todo-item";

interface TodoListProps {
  todos: RichTodoType[];
  labels: LabelSchemaType[];
}
export const TodoList = ({ todos, labels }: TodoListProps) => {
  if (todos.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <span className="text-muted-foreground">No todos yet</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {todos.map((todo) => (
        <div key={todo.id}>
          <InteractiveTodoItem todo={todo} labels={labels} />
        </div>
      ))}
    </div>
  );
};

import React from "react";

import { Card, CardContent } from "@/components/ui/card";

import { TodoForm } from "../_forms/todo-form";

const CreateTodoPage = () => {
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">New todo</h1>
      <Card>
        <CardContent>
          <TodoForm />
        </CardContent>
      </Card>
    </>
  );
};

export default CreateTodoPage;

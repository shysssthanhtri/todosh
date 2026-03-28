import React from "react";

import { Card, CardContent } from "@/components/ui/card";

import { getLabels } from "../../_actions/labels.action";
import { CreateTodoSection } from "./create-todo-section";

const CreateTodoPage = async () => {
  const labels = await getLabels();

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">New todo</h1>
      <Card>
        <CardContent>
          <CreateTodoSection labels={labels} />
        </CardContent>
      </Card>
    </>
  );
};

export default CreateTodoPage;

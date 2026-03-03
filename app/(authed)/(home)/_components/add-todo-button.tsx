import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { TodoForm } from "../_forms/todo-form";

export const AddTodoButton = () => {
  return (
    <Drawer direction="bottom">
      <DrawerTrigger asChild>
        <Button
          size="icon"
          className="fixed right-6 bottom-6 size-12 rounded-full shadow-lg"
        >
          <Plus className="size-6" />
          <span className="sr-only">Add</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-4 pb-4">
        <DrawerTitle className="sr-only">Add Todo</DrawerTitle>
        <div className="flex flex-col gap-3 mt-4">
          <TodoForm />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

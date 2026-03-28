"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { ROUTES } from "@/constants/routes";
import { prisma } from "@/lib/prisma";
import { TodoSchemaType } from "@/schemas/todo";

interface getTodosParams {
  start?: Date;
  end?: Date;
  getAll?: boolean;
}
export async function getTodos(
  params: getTodosParams = {},
): Promise<TodoSchemaType[]> {
  const { start, end, getAll } = params;

  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  const todos = await prisma.todo.findMany({
    where: {
      userId: session.user.id,
      ...(getAll ? undefined : { completed: false }),
      ...(start || end
        ? {
            dueDate: {
              ...(start ? { gte: start } : {}),
              ...(end ? { lte: end } : {}),
            },
          }
        : {}),
    },
    include: { label: true },
    orderBy: { updatedAt: "desc" },
  });

  return todos.map((todo) => ({
    id: todo.id,
    title: todo.title,
    completed: todo.completed,
    completedAt: todo.completedAt,
    dueDate: todo.dueDate,
    labelId: todo.labelId ?? null,
    label: todo.label
      ? { name: todo.label.name, color: todo.label.color }
      : undefined,
    createdAt: todo.createdAt,
    updatedAt: todo.updatedAt,
    userId: todo.userId,
  }));
}

export async function completeTodo(id: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const result = await prisma.todo.updateMany({
    where: { id, userId: session.user.id },
    data: {
      completed: true,
      completedAt: new Date(),
    },
  });

  if (result.count === 0) {
    throw new Error("Todo not found");
  }

  revalidatePath(ROUTES.TODO_LIST);
}

export const createTodo = async (
  newTodo: Pick<TodoSchemaType, "title" | "dueDate" | "labelId">,
) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const todo = await prisma.todo.create({
    data: {
      title: newTodo.title,
      dueDate: newTodo.dueDate,
      labelId: newTodo.labelId ?? undefined,
      userId: session.user.id,
    },
  });

  revalidatePath(ROUTES.TODO_LIST);
  return todo;
};

export async function deleteTodo(id: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await prisma.todo.deleteMany({
    where: { id, userId: session.user.id },
  });

  revalidatePath(ROUTES.TODO_LIST);
}

export const updateTodo = async (
  id: TodoSchemaType["id"],
  payload: Pick<TodoSchemaType, "title" | "dueDate" | "labelId">,
) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const todo = await prisma.todo.update({
    where: { id, userId: session.user.id },
    data: {
      title: payload.title,
      dueDate: payload.dueDate,
      labelId: payload.labelId ?? undefined,
    },
  });

  revalidatePath(ROUTES.TODO_LIST);
  return todo;
};

"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { ROUTES } from "@/constants/routes";
import { prisma } from "@/lib/prisma";
import { TodoType } from "@/models";

export async function getTodos(): Promise<TodoType[]> {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  const todos = await prisma.todo.findMany({
    where: {
      userId: session.user.id,
      completed: false,
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
      : null,
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

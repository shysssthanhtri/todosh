import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  const hasDateRange = !!(start || end);

  console.log({ start: start && new Date(start), end: end && new Date(end) });

  const todos = await prisma.todo.findMany({
    where: {
      userId: session.user.id,
      ...(!hasDateRange ? { completed: false } : {}),
      ...(hasDateRange
        ? {
            createdAt: {
              ...(start ? { gte: new Date(start) } : {}),
              ...(end ? { lte: new Date(end) } : {}),
            },
          }
        : {}),
    },
    include: { label: true },
    orderBy: { updatedAt: "desc" },
  });

  const payload = todos.map((todo) => ({
    id: todo.id,
    title: todo.title,
    completed: todo.completed,
    completedAt: todo.completedAt?.toISOString() ?? null,
    dueDate: todo.dueDate?.toISOString() ?? null,
    labelId: todo.labelId ?? null,
    label: todo.label
      ? { name: todo.label.name, color: todo.label.color }
      : null,
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString(),
  }));

  return NextResponse.json(payload);
}

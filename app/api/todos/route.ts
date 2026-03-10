import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const startParam = searchParams.get("start");
  const endParam = searchParams.get("end");

  let startDate: Date | null = null;
  let endDate: Date | null = null;
  if (startParam) {
    const parsed = new Date(startParam);
    if (Number.isNaN(parsed.getTime())) {
      return NextResponse.json(
        { error: "Invalid start date (use ISO 8601)" },
        { status: 400 },
      );
    }
    startDate = parsed;
  }
  if (endParam) {
    const parsed = new Date(endParam);
    if (Number.isNaN(parsed.getTime())) {
      return NextResponse.json(
        { error: "Invalid end date (use ISO 8601)" },
        { status: 400 },
      );
    }
    endDate = parsed;
  }

  const where: { userId: string; dueDate?: { gte?: Date; lte?: Date } } = {
    userId: session.user.id,
  };
  if (startDate ?? endDate) {
    where.dueDate = {};
    if (startDate) where.dueDate.gte = startDate;
    if (endDate) where.dueDate.lte = endDate;
  }

  const todos = await prisma.todo.findMany({
    where,
    orderBy: { updatedAt: "desc" },
  });
  const userAgent = request.headers.get("user-agent");
  console.log(startDate, endDate, { userAgent });

  const payload = todos.map((todo) => ({
    id: todo.id,
    title: todo.title,
    completed: todo.completed,
    dueDate: todo.dueDate?.toISOString() ?? null,
    labelId: todo.labelId ?? null,
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString(),
  }));

  return NextResponse.json(payload);
}

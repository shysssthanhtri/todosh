import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type SyncTodo = {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  let body: { upserts?: SyncTodo[]; deleteIds?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const upserts = Array.isArray(body.upserts) ? body.upserts : [];
  const deleteIds = Array.isArray(body.deleteIds) ? body.deleteIds : [];

  if (deleteIds.length > 0) {
    await prisma.todo.deleteMany({
      where: {
        id: { in: deleteIds },
        userId,
      },
    });
  }

  for (const item of upserts) {
    const dueDate = item.dueDate ? new Date(item.dueDate) : null;
    const createdAt = new Date(item.createdAt);
    const updatedAt = new Date(item.updatedAt);

    await prisma.todo.upsert({
      where: { id: item.id },
      create: {
        id: item.id,
        title: item.title,
        completed: item.completed,
        dueDate,
        userId,
        createdAt,
        updatedAt,
      },
      update: {
        title: item.title,
        completed: item.completed,
        dueDate,
        updatedAt,
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}

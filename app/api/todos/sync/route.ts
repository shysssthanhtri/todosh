import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { bulkUpsertTodos } from "@/lib/mongo-todo-bulk";
import { prisma } from "@/lib/prisma";

type SyncTodo = {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string | null;
  dueDate?: string | null;
  labelId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function POST(request: Request) {
  let session;
  try {
    session = await auth();
  } catch (err) {
    console.error("[sync] auth error:", err);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 },
    );
  }

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

  const deleteIds = Array.isArray(body.deleteIds) ? body.deleteIds : [];
  const upserts = (Array.isArray(body.upserts) ? body.upserts : []).filter(
    (item) => !deleteIds.includes(item.id),
  );

  try {
    const deletePromise =
      deleteIds.length > 0
        ? prisma.todo.deleteMany({
            where: {
              id: { in: deleteIds },
              userId,
            },
          })
        : Promise.resolve();

    const upsertPromise = bulkUpsertTodos(userId, upserts);

    await Promise.all([deletePromise, upsertPromise]);
  } catch (err) {
    console.error("[sync] database error:", err);
    return NextResponse.json(
      { error: "Sync failed. Please try again." },
      { status: 500 },
    );
  }

  return new NextResponse(null, { status: 200 });
}

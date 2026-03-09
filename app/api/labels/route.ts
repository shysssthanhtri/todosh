import { NextResponse } from "next/server";
import z from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const CreateLabelSchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string().max(32).nullish(),
});

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const labels = await prisma.label.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  const payload = labels.map((label) => ({
    id: label.id,
    name: label.name,
    color: label.color,
    createdAt: label.createdAt.toISOString(),
    updatedAt: label.updatedAt.toISOString(),
  }));

  return NextResponse.json(payload);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parseResult = CreateLabelSchema.safeParse(json);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Invalid body", details: parseResult.error.flatten() },
      { status: 400 },
    );
  }

  const { name, color } = parseResult.data;

  const created = await prisma.label.create({
    data: {
      name,
      color: color ?? null,
      userId: session.user.id,
    },
  });

  const payload = {
    id: created.id,
    name: created.name,
    color: created.color,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  };

  return NextResponse.json(payload, { status: 201 });
}

import { NextResponse } from "next/server";
import z from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const UpdateLabelSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  color: z.string().max(32).nullish().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parseResult = UpdateLabelSchema.safeParse(json);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Invalid body", details: parseResult.error.flatten() },
      { status: 400 },
    );
  }

  const data = parseResult.data;
  if (Object.keys(data).length === 0) {
    return NextResponse.json(
      { error: "At least one of name or color is required" },
      { status: 400 },
    );
  }

  const updated = await prisma.label.updateMany({
    where: { id, userId: session.user.id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.color !== undefined && { color: data.color ?? null }),
    },
  });

  if (updated.count === 0) {
    return NextResponse.json({ error: "Label not found" }, { status: 404 });
  }

  const label = await prisma.label.findUniqueOrThrow({
    where: { id },
  });

  const payload = {
    id: label.id,
    name: label.name,
    color: label.color,
    createdAt: label.createdAt.toISOString(),
    updatedAt: label.updatedAt.toISOString(),
  };

  return NextResponse.json(payload);
}

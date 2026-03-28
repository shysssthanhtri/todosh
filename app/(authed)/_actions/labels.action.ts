"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { ROUTES } from "@/constants/routes";
import { prisma } from "@/lib/prisma";
import { LabelSchemaType } from "@/schemas/label";

export const getLabels = async (): Promise<LabelSchemaType[]> => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const labels = await prisma.label.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return labels as LabelSchemaType[];
};

export const createLabel = async (
  label: Pick<LabelSchemaType, "name" | "color">,
): Promise<LabelSchemaType> => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const newLabel = await prisma.label.create({
    data: {
      name: label.name,
      color: label.color,
      userId: session.user.id,
    },
  });

  revalidatePath(ROUTES.SETTINGS_LABELS);

  return newLabel as LabelSchemaType;
};

export const deleteLabel = async (id: string): Promise<void> => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await prisma.label.delete({
    where: { id, userId: session.user.id },
  });

  revalidatePath(ROUTES.SETTINGS_LABELS);
};

export const updateLabel = async (
  label: Pick<LabelSchemaType, "id" | "name" | "color">,
): Promise<LabelSchemaType> => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const updatedLabel = await prisma.label.update({
    where: { id: label.id, userId: session.user.id },
    data: {
      name: label.name,
      color: label.color,
    },
  });

  revalidatePath(ROUTES.SETTINGS_LABELS);

  return updatedLabel as LabelSchemaType;
};

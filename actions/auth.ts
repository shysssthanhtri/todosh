"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import { ROUTES } from "@/constants/routes";
import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types/actions";

export async function login(
  email: string,
  password: string,
): Promise<ActionResult> {
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: ROUTES.TODAY,
    });

    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { success: false, error: "Invalid email or password." };
      }
      return {
        success: false,
        error: "Something went wrong. Please try again.",
      };
    }
    // Next.js redirects throw an error, so we need to re-throw it
    throw error;
  }
}

export async function signup(
  email: string,
  password: string,
): Promise<ActionResult> {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        error: "An account with this email already exists.",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        email,
        hashedPassword: hashedPassword,
      },
    });

    // Auto sign-in after signup
    await signIn("credentials", {
      email,
      password,
      redirectTo: ROUTES.TODAY,
    });

    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        error: "Something went wrong. Please try again.",
      };
    }
    // Next.js redirects throw an error, so we need to re-throw it
    throw error;
  }
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useTransition } from "react";

import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription } from "@/components/ui/field";
import { ROUTES } from "@/constants/routes";

import { LoginForm, LoginFormRef } from "../_forms/login-form";

export const LoginCard = () => {
  const ref = useRef<LoginFormRef>(null);
  const router = useRouter();
  const [isPending, start] = useTransition();

  const onSubmit = (value: LoginForm.FormValue) => {
    start(async () => {
      const result = await signIn("credentials", {
        ...value,
        redirect: false,
      });

      console.log({ result });
      router.push(ROUTES.HOME);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm ref={ref} isPending={isPending} onSubmit={onSubmit} />
      </CardContent>
      <CardFooter>
        <Field>
          <Button className="w-full">Login</Button>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <Link href={ROUTES.SIGNUP} className="underline underline-offset-4">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </CardFooter>
    </Card>
  );
};

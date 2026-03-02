"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRef, useTransition } from "react";
import { toast } from "sonner";

import { login } from "@/actions/auth";
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

import {
  CredentialsForm,
  CredentialsFormRef,
} from "../../_forms/credentials-form";

export const LoginCard = () => {
  const ref = useRef<CredentialsFormRef>(null);
  const [isPending, start] = useTransition();

  const onSubmit = (value: CredentialsForm.FormValue) => {
    start(async () => {
      const result = await login(value.email, value.password);
      if (!result.success) {
        toast.error(result.error);
      }
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
        <CredentialsForm ref={ref} isPending={isPending} onSubmit={onSubmit} />
      </CardContent>
      <CardFooter>
        <Field>
          <Button
            className="w-full"
            onClick={() => ref.current?.submit?.()}
            disabled={isPending}
          >
            {isPending && <Loader2 className="animate-spin" />}
            Login
          </Button>
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

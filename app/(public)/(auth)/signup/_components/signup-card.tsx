"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRef, useTransition } from "react";
import { toast } from "sonner";

import { signup } from "@/actions/auth";
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

export const SignupCard = () => {
  const ref = useRef<CredentialsFormRef>(null);
  const [isPending, start] = useTransition();

  const onSubmit = (value: CredentialsForm.FormValue) => {
    start(async () => {
      const result = await signup(value.email, value.password);
      if (!result.success) {
        toast.error(result.error);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CredentialsForm
          ref={ref}
          isPending={isPending}
          onSubmit={onSubmit}
          isSignup
        />
      </CardContent>
      <CardFooter>
        <Field>
          <Button
            className="w-full"
            onClick={() => ref.current?.submit?.()}
            disabled={isPending}
          >
            {isPending && <Loader2 className="animate-spin" />}
            Create Account
          </Button>
          <FieldDescription className="text-center">
            Already have an account?{" "}
            <Link href={ROUTES.LOGIN} className="underline underline-offset-4">
              Login
            </Link>
          </FieldDescription>
        </Field>
      </CardFooter>
    </Card>
  );
};

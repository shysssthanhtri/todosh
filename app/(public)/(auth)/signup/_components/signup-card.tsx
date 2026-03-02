"use client";

import { Loader2 } from "lucide-react";
import { useRef, useTransition } from "react";

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
import { Field } from "@/components/ui/field";

import {
  CredentialsForm,
  CredentialsFormRef,
} from "../../_forms/credentials-form";

export const SignupCard = () => {
  const ref = useRef<CredentialsFormRef>(null);
  const [isPending, start] = useTransition();

  const onSubmit = (value: CredentialsForm.FormValue) => {
    start(async () => {
      await signup(value.email, value.password);
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
        </Field>
      </CardFooter>
    </Card>
  );
};

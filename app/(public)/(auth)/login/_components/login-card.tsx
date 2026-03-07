"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRef, useTransition } from "react";
import { toast } from "sonner";

import { login, loginWithGoogle } from "@/actions/auth";
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
import { GoogleIcon } from "@/icons/google";

import {
  CredentialsForm,
  CredentialsFormRef,
} from "../../_forms/credentials-form";

export const LoginCard = () => {
  const ref = useRef<CredentialsFormRef>(null);
  const [isPending, start] = useTransition();
  const [isGooglePending, startGoogle] = useTransition();

  const onSubmit = (value: CredentialsForm.FormValue) => {
    start(async () => {
      const result = await login(value.email, value.password);
      if (!result.success) {
        toast.error(result.error);
      }
    });
  };

  const onGoogleLogin = () => {
    startGoogle(async () => {
      const result = await loginWithGoogle();
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
      <CardContent className="space-y-4">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onGoogleLogin}
          disabled={isGooglePending || isPending}
        >
          {isGooglePending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              <GoogleIcon />
              Continue with Google
            </>
          )}
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              or continue with email
            </span>
          </div>
        </div>
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

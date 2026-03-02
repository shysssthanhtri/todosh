import Link from "next/link";
import React from "react";

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

import { LoginForm } from "../_forms/login-form";

export const LoginCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
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

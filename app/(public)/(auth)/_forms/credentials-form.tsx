"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { forwardRef, useCallback, useImperativeHandle } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { credentialSchema } from "@/schemas/auth";

const FormSchema = credentialSchema;
type FormType = z.infer<typeof FormSchema>;

interface Props {
  onSubmit?: (value: FormType) => void;
  isPending?: boolean;
  isSignup?: boolean;
}
interface Ref {
  submit?: () => void;
  reset?: (value?: Partial<FormType>) => void;
}
export type CredentialsFormRef = Ref;

export const CredentialsForm = forwardRef<Ref, Props>((props, ref) => {
  const { onSubmit, isPending, isSignup } = props;

  const form = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = useCallback(
    (value: FormType) => {
      onSubmit?.(value);
    },
    [onSubmit],
  );

  useImperativeHandle(
    ref,
    () => ({
      submit: () => {
        void form.handleSubmit(handleSubmit)();
      },
      reset: (value) => {
        form.reset(value);
      },
    }),
    [form, handleSubmit],
  );

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                type="email"
                required
                disabled={isPending}
                placeholder="m@example.com"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                {!isSignup && (
                  <Link
                    href={ROUTES.FORGET_PASSWORD}
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                )}
              </div>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                type="password"
                required
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <button type="submit" hidden />
    </form>
  );
});

CredentialsForm.displayName = "CredentialsForm";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CredentialsForm {
  export type FormValue = FormType;
}

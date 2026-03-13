"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LabelSchema } from "@/schemas/label";

const FormSchema = LabelSchema.pick({ name: true });
type FormType = z.infer<typeof FormSchema>;

interface Props {
  onSubmit?: (value: FormType) => void;
  isPending?: boolean;
}

interface Ref {
  submit?: () => void;
  reset?: (value?: Partial<FormType>) => void;
  focus?: () => void;
  blur?: () => void;
}
export type LabelFormRef = Ref;

export const LabelForm = forwardRef<Ref, Props>((props, ref) => {
  const { onSubmit, isPending } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
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
      reset: () => {
        form.reset();
      },
      focus: () => {
        inputRef.current?.focus();
      },
      blur: () => {
        inputRef.current?.blur();
      },
    }),
    [form, handleSubmit],
  );

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="mt-4 flex flex-col gap-3"
    >
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="label-name">Name</FieldLabel>
              <Input
                {...field}
                ref={(el) => {
                  field.ref(el);
                  inputRef.current = el;
                }}
                id="label-name"
                aria-invalid={fieldState.invalid}
                autoFocus
                placeholder="e.g. Work"
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

LabelForm.displayName = "LabelForm";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace LabelForm {
  export type FormValue = FormType;
}

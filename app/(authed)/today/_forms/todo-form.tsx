"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUp } from "lucide-react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toDueDateUTC } from "@/lib/date-utils";
import { TodoSchema } from "@/schemas/todo";

import { DueDatePicker } from "./due-date-picker";

const FormSchema = TodoSchema.pick({
  title: true,
  dueDate: true,
});
type FormType = z.infer<typeof FormSchema>;

const defaultDueDate = () => toDueDateUTC(new Date());

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
export type TodoFormRef = Ref;

export const TodoForm = forwardRef<Ref, Props>((props, ref) => {
  const { onSubmit, isPending } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      dueDate: defaultDueDate(),
    },
  });

  const title = useWatch({ control: form.control, name: "title" });

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
        const currentDueDate = form.getValues("dueDate") ?? defaultDueDate();
        form.reset({
          title: "",
          dueDate: currentDueDate,
          ...value,
        });
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
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="title" className="sr-only">
                Title
              </FieldLabel>
              <Input
                {...field}
                ref={(el) => {
                  field.ref(el);
                  inputRef.current = el;
                }}
                id={field.name}
                aria-invalid={fieldState.invalid}
                required
                readOnly={isPending}
                placeholder="What needs to be done?"
                className="border-0 p-0 pl-3 text-base shadow-none focus-visible:ring-0"
                autoFocus
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <div className="flex flex-wrap items-center gap-2">
            <Controller
              name="dueDate"
              control={form.control}
              render={({ field }) => (
                <DueDatePicker value={field.value} onChange={field.onChange} />
              )}
            />
          </div>
        </Field>
        <Field>
          <div className="flex items-center justify-end">
            <Button
              size="icon"
              className="size-10 rounded-full"
              disabled={!title.trim() || isPending}
              onPointerDown={(e) => e.preventDefault()}
            >
              <ArrowUp className="size-5" />
              <span className="sr-only">Submit</span>
            </Button>
          </div>
        </Field>
      </FieldGroup>
      <button type="submit" hidden />
    </form>
  );
});

TodoForm.displayName = "TodoForm";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TodoForm {
  export type FormValue = FormType;
}

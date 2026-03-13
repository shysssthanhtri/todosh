/* eslint-disable @typescript-eslint/no-namespace */
"use client";

import {
  FormEvent,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FormValue {
  name: string;
}

interface Props {
  onSubmit?: (value: FormValue) => void;
  isPending?: boolean;
}

interface Ref {
  submit?: () => void;
  reset?: (value?: Partial<FormValue>) => void;
  focus?: () => void;
  blur?: () => void;
}

export type LabelFormRef = Ref;

export const LabelForm = forwardRef<Ref, Props>((props, ref) => {
  const { onSubmit, isPending } = props;
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit?.({ name });
  };

  useImperativeHandle(
    ref,
    () => ({
      submit: () => {
        inputRef.current?.form?.requestSubmit();
      },
      reset: (value) => {
        setName(value?.name ?? "");
      },
      focus: () => {
        inputRef.current?.focus();
      },
      blur: () => {
        inputRef.current?.blur();
      },
    }),
    [],
  );

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label
          htmlFor="label-name"
          className="text-sm font-medium text-foreground"
        >
          Name
        </label>
        <Input
          id="label-name"
          autoFocus
          ref={inputRef}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Work"
          disabled={isPending}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Adding…" : "Add"}
        </Button>
      </div>
    </form>
  );
});

LabelForm.displayName = "LabelForm";

export namespace LabelForm {
  export type FormValue = FormValue;
}

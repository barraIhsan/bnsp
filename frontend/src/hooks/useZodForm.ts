import { useState } from "react";
import type z from "zod";

export function useZodForm<T extends Record<string, unknown>>(
  schema: z.ZodSchema<T>,
  initial: T,
) {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const setValue = (field: keyof T, value: unknown) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): T | null => {
    const result = schema.safeParse(values);
    if (result.success) {
      setErrors({});
      return result.data;
    }
    const fieldErrors: Partial<Record<keyof T, string>> = {};
    result.error.issues.forEach((e) => {
      const key = e.path[0] as keyof T;
      if (!fieldErrors[key]) fieldErrors[key] = e.message;
    });
    setErrors(fieldErrors);
    return null;
  };

  const reset = (next?: Partial<T>) => {
    setValues(next ? { ...initial, ...next } : initial);
    setErrors({});
  };

  return { values, errors, setValue, validate, reset, setValues };
}

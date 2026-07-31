import { z } from "zod";
import type { Attendance } from "@/types/invitation";

/** The shape the form holds and the API accepts. */
export const messageSchema = z.object({
  name: z.string().trim().min(1),
  email: z.email(),
  attending: z.enum(["accept", "decline"]),
  message: z.string().trim().max(2000).optional().default(""),
});

export type MessagePayload = z.infer<typeof messageSchema>;

/** Form state — `attending` starts empty, which the schema rejects. */
export interface FormValues {
  name: string;
  email: string;
  attending: "" | Attendance;
  message: string;
}

export const EMPTY_VALUES: FormValues = {
  name: "",
  email: "",
  attending: "",
  message: "",
};

export type FormErrors = Partial<Record<keyof FormValues, string>>;

export const ATTENDANCE_LABEL: Record<Attendance, string> = {
  accept: "Joyfully accept",
  decline: "Regretfully decline",
};

export const CONFIRMATION: Record<Attendance, string> = {
  accept: "We are so glad you will be joining us.",
  decline: "You will be missed, and you are in our thoughts.",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Plainly worded, field-level messages. */
export function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Tell us your name so we know who wrote in";
  }
  if (!EMAIL.test(values.email.trim())) {
    errors.email = "Enter an email address so we can reply";
  }
  if (!values.attending) {
    errors.attending = "Let us know whether you can join us";
  }

  return errors;
}

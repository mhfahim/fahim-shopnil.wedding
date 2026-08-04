"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useState } from "react";
import type { Attendance } from "@/types/invitation";
import { EASE, childReveal } from "@/lib/motion";
import {
  ATTENDANCE_LABEL,
  EMPTY_VALUES,
  type FormErrors,
  type FormValues,
  validate,
} from "@/lib/rsvp";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { MessageSent } from "@/components/MessageSent";
import { FormField } from "@/components/FormField";

type Status = "idle" | "sending" | "failed" | "sent";

export function MessageForm() {
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [sentAs, setSentAs] = useState<Attendance>("accept");

  const set = (key: keyof FormValues) => (value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("sending");
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      setSentAs(values.attending as Attendance);
      setStatus("sent");
    } catch {
      // Values stay put, so a retry costs the guest nothing.
      setStatus("failed");
    }
  }

  return (
    <Section id="message" labelledBy="message-heading" band="cream-100">
      <SectionHeading id="message-heading" icon={Mail}>
        Send a Message
      </SectionHeading>

      <AnimatePresence mode="wait">
        {status === "sent" ? (
          <MessageSent key="thanks" attending={sentAs} />
        ) : (
          <motion.form
            key="form"
            variants={childReveal}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            onSubmit={onSubmit}
            noValidate
            className="mt-10 flex w-full flex-col gap-6"
          >
            {/* Ids are namespaced: the section itself owns id="message". */}
            <FormField id="rsvp-name" label="Your Name" error={errors.name}>
              {(props) => (
                <input
                  {...props}
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={values.name}
                  onChange={(e) => set("name")(e.target.value)}
                />
              )}
            </FormField>

            <FormField id="rsvp-email" label="Email" error={errors.email}>
              {(props) => (
                <input
                  {...props}
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={values.email}
                  onChange={(e) => set("email")(e.target.value)}
                />
              )}
            </FormField>

            <FormField
              id="rsvp-attending"
              label="Will you be attending?"
              error={errors.attending}
            >
              {(props) => (
                <select
                  {...props}
                  name="attending"
                  value={values.attending}
                  onChange={(e) => set("attending")(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="accept">{ATTENDANCE_LABEL.accept}</option>
                  <option value="decline">{ATTENDANCE_LABEL.decline}</option>
                </select>
              )}
            </FormField>

            <FormField id="rsvp-message" label="Your Message">
              {(props) => (
                <textarea
                  {...props}
                  name="message"
                  rows={4}
                  placeholder="Write your wishes..."
                  value={values.message}
                  onChange={(e) => set("message")(e.target.value)}
                />
              )}
            </FormField>

            {status === "failed" ? (
              <p role="alert" className="font-serif text-meta text-accent-red">
                That did not go through. Your message is still here &mdash; try
                sending it again.
              </p>
            ) : null}

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-2 w-full rounded-button bg-gold-gradient px-9 py-[0.9rem] font-utility text-label-caps tracking-button text-night-900/90 uppercase transition-[filter] duration-300 hover:brightness-108 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "sending" ? "Sending" : "Send Message"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </Section>
  );
}

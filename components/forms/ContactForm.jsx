"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { submitContactRequest } from "@/lib/contact";
import { cn } from "@/lib/utils";

const INITIAL_VALUES = { name: "", email: "", phone: "", subject: "", message: "" };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values) {
  const errors = {};

  if (!values.name.trim()) errors.name = "Please enter your name.";

  if (!values.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!values.subject.trim()) errors.subject = "Please enter a subject.";

  if (!values.message.trim()) {
    errors.message = "Please enter a message.";
  } else if (values.message.trim().length < 10) {
    errors.message = "Please provide a bit more detail (at least 10 characters).";
  }

  return errors;
}

const FIELD_CLASSES =
  "w-full rounded-md border bg-white px-3.5 py-2.5 text-sm text-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-600";

function Field({ label, name, type = "text", value, onChange, error, required, optional, autoComplete }) {
  const id = `contact-${name}`;
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-navy-900">
        {label} {optional && <span className="font-normal text-muted-400">(optional)</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(FIELD_CLASSES, error ? "border-red-400" : "border-navy-900/15 focus:border-navy-900/40")}
      />
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function TextAreaField({ label, name, value, onChange, error, required }) {
  const id = `contact-${name}`;
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-navy-900">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        rows={5}
        value={value}
        onChange={onChange}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          FIELD_CLASSES,
          "resize-y",
          error ? "border-red-400" : "border-navy-900/15 focus:border-navy-900/40"
        )}
      />
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContactForm() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [errorDetail, setErrorDetail] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setStatus("submitting");
    setErrorDetail("");

    try {
      await submitContactRequest(values);
      setStatus("success");
      setValues(INITIAL_VALUES);
    } catch (error) {
      console.error("Contact form submission failed:", error);
      // EmailJS rejects with { status, text }; our own guard clause throws a
      // plain Error with .message. Fall back to stringifying anything else.
      const detail = error?.text || error?.message || String(error);
      setErrorDetail(detail);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-lg border border-cream-200 bg-white p-8 text-center">
        <h3 className="font-heading text-xl font-semibold text-navy-900">Message Received</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-600">
          Thank you for reaching out. Our team will get back to you shortly.
        </p>
        <Button type="button" variant="secondary" className="mt-6" onClick={() => setStatus("idle")}>
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Name"
          name="name"
          value={values.name}
          onChange={handleChange}
          error={errors.name}
          autoComplete="name"
          required
        />
        <Field
          label="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
          required
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Phone"
          name="phone"
          type="tel"
          value={values.phone}
          onChange={handleChange}
          error={errors.phone}
          autoComplete="tel"
          optional
        />
        <Field
          label="Subject"
          name="subject"
          value={values.subject}
          onChange={handleChange}
          error={errors.subject}
          required
        />
      </div>

      <TextAreaField
        label="Message"
        name="message"
        value={values.message}
        onChange={handleChange}
        error={errors.message}
        required
      />

      {status === "error" && (
        <p role="alert" className="text-sm text-red-600">
          Something went wrong sending your message. Please try again, or reach out to us directly.
          {errorDetail && (
            <span className="mt-1 block text-xs text-red-400">Details: {errorDetail}</span>
          )}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={status === "submitting"}
        className="self-start"
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
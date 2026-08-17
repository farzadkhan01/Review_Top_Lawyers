/** @format */

import { cn } from "@/lib/utils";

const FIELD_CLASSES =
  "w-full rounded-md border bg-white px-3.5 py-2.5 text-sm text-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-600";

export default function FormField({
  label,
  name,
  type = "text",
  as = "input",
  value,
  onChange,
  error,
  required = false,
  optional = false,
  hint,
  rows = 4,
  options,
  className,
  ...props
}) {
  const id = `field-${name}`;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error && errorId, hint && hintId].filter(Boolean).join(" ") || undefined;

  const sharedProps = {
    id,
    name,
    value,
    onChange,
    required,
    "aria-invalid": Boolean(error),
    "aria-describedby": describedBy,
    className: cn(FIELD_CLASSES, error ? "border-red-400" : "border-navy-900/15 focus:border-navy-900/40"),
    ...props,
  };

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-navy-900">
        {label} {required && <span className="text-red-600">*</span>}
        {optional && <span className="font-normal text-muted-400"> (optional)</span>}
      </label>

      {as === "textarea" && <textarea rows={rows} {...sharedProps} />}
      {as === "select" && (
        <select {...sharedProps}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
      {as === "input" && <input type={type} {...sharedProps} />}

      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-muted-400">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

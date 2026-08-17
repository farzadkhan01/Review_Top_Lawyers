/** @format */

"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import FormField from "@/components/admin/FormField";
import FormActions from "@/components/admin/FormActions";
import { CloseIcon } from "@/components/ui/icons";

const TRANSITION_MS = 200;

const EMPTY_AREA = { name: "", slug: "", description: "", status: "active" };

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Name is required.";
  if (!values.description.trim()) errors.description = "Description is required.";
  return errors;
}

export default function PracticeAreaDialog({ open, initialValues, onSubmit, onClose }) {
  const [values, setValues] = useState({ ...EMPTY_AREA, ...initialValues });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isRendered, setIsRendered] = useState(open);
  const closeTimeoutRef = useRef(null);

  useEffect(() => {
    if (open) {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValues({ ...EMPTY_AREA, ...initialValues });
      setErrors({});
      setSubmitError("");
      setIsRendered(true);
      return undefined;
    }
    closeTimeoutRef.current = setTimeout(() => setIsRendered(false), TRANSITION_MS);
    return () => clearTimeout(closeTimeoutRef.current);
  }, [open, initialValues]);

  useEffect(() => {
    if (!open) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

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

    setSaving(true);
    setSubmitError("");

    try {
      await onSubmit(values);
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  if (!isRendered) return null;

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[60] bg-navy-950/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: TRANSITION_MS / 1000 }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="practice-area-dialog-title"
          className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl sm:p-8"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0.96 }}
          transition={{ duration: TRANSITION_MS / 1000 }}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 id="practice-area-dialog-title" className="font-heading text-lg font-semibold text-navy-900">
              {initialValues ? "Edit Practice Area" : "Add Practice Area"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="rounded-md p-1.5 text-muted-400 hover:bg-navy-900/5 hover:text-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <FormField label="Name" name="name" value={values.name} onChange={handleChange} error={errors.name} required />
            <FormField
              label="Slug"
              name="slug"
              value={values.slug}
              onChange={handleChange}
              optional
              hint="Leave blank to generate automatically from the name."
            />
            <FormField
              as="textarea"
              rows={3}
              label="Description"
              name="description"
              value={values.description}
              onChange={handleChange}
              error={errors.description}
              required
            />
            <FormField
              as="select"
              label="Status"
              name="status"
              value={values.status}
              onChange={handleChange}
              options={STATUS_OPTIONS}
              className="sm:max-w-xs"
            />
            <FormActions
              onCancel={onClose}
              submitLabel={initialValues ? "Save Changes" : "Create Practice Area"}
              saving={saving}
              error={submitError}
            />
          </form>
        </motion.div>
      </div>
    </>
  );
}

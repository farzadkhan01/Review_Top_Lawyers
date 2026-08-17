/** @format */

"use client";

import { useMemo, useState } from "react";
import FormField from "@/components/admin/FormField";
import FormActions from "@/components/admin/FormActions";
import ImageUploader from "@/components/admin/ImageUploader";
import { TrashIcon, PlusIcon } from "@/components/ui/icons";
import { getPracticeAreaOptions } from "@/lib/admin/lawyers";
import { useUnsavedChangesWarning } from "@/lib/admin/useUnsavedChanges";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const EMPTY_LAWYER = {
  name: "",
  title: "",
  slug: "",
  image: "",
  shortBio: "",
  fullBio: "",
  practiceAreas: [],
  location: "",
  firm: "",
  yearsOfExperience: "",
  education: [""],
  languages: [""],
  barAdmissions: "",
  email: "",
  phone: "",
  website: "",
  featured: false,
  status: "active",
  isPublic: true,
  seoTitle: "",
  seoDescription: "",
};

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Full name is required.";
  if (!values.title.trim()) errors.title = "Professional title is required.";
  if (!values.location.trim()) errors.location = "Location is required.";
  if (values.practiceAreas.length === 0) {
    errors.practiceAreas = "Select at least one practice area.";
  }
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  return errors;
}

function ListField({ label, items, onChange, placeholder }) {
  function updateItem(index, value) {
    const next = [...items];
    next[index] = value;
    onChange(next);
  }
  function addItem() {
    onChange([...items, ""]);
  }
  function removeItem(index) {
    onChange(items.length > 1 ? items.filter((_, i) => i !== index) : [""]);
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-navy-900">{label}</span>
      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(event) => updateItem(index, event.target.value)}
              placeholder={placeholder}
              className="w-full rounded-md border border-navy-900/15 bg-white px-3.5 py-2 text-sm text-navy-900 focus:border-navy-900/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-600"
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              aria-label={`Remove ${label.toLowerCase()} entry ${index + 1}`}
              className="shrink-0 rounded-md px-2 text-muted-400 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addItem}
        className="mt-2 inline-flex items-center gap-1.5 rounded text-sm font-medium text-navy-800 hover:text-gold-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
      >
        <PlusIcon className="h-3.5 w-3.5" />
        Add entry
      </button>
    </div>
  );
}

function PracticeAreaCheckboxes({ selected, onChange, options, error }) {
  function toggle(value) {
    onChange(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value]
    );
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-navy-900">
        Practice Areas <span className="text-red-600">*</span>
      </span>
      <div
        className={cn(
          "grid grid-cols-2 gap-2 rounded-md border p-3 sm:grid-cols-3",
          error ? "border-red-400" : "border-navy-900/15"
        )}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-navy-800"
          >
            <input
              type="checkbox"
              checked={selected.includes(option.value)}
              onChange={() => toggle(option.value)}
              className="h-4 w-4 rounded border-navy-900/25 text-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
            />
            {option.label}
          </label>
        ))}
      </div>
      {error && (
        <p role="alert" className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default function LawyerForm({ initialValues, onSubmit, onCancel, submitLabel = "Save Lawyer" }) {
  const [values, setValues] = useState({ ...EMPTY_LAWYER, ...initialValues });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const practiceAreaOptions = getPracticeAreaOptions();
  const baseline = useMemo(() => ({ ...EMPTY_LAWYER, ...initialValues }), [initialValues]);
  const isDirty = JSON.stringify(values) !== JSON.stringify(baseline);
  useUnsavedChangesWarning(isDirty && !saving);

  function setField(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setField(name, type === "checkbox" ? checked : value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSaving(true);
    setSubmitError("");

    try {
      const payload = {
        ...values,
        yearsOfExperience: Number(values.yearsOfExperience) || 0,
        education: values.education.filter((item) => item.trim()),
        languages: values.languages.filter((item) => item.trim()),
      };
      await onSubmit(payload);
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  function handleCancel() {
    if (isDirty && typeof window !== "undefined") {
      const confirmed = window.confirm("Discard unsaved changes to this lawyer?");
      if (!confirmed) return;
    }
    onCancel();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-10">
      <section className="flex flex-col gap-5">
        <h2 className="font-heading text-lg font-semibold text-navy-900">Basic Information</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label="Full Name"
            name="name"
            value={values.name}
            onChange={handleChange}
            error={errors.name}
            required
          />
          <FormField
            label="Professional Title"
            name="title"
            value={values.title}
            onChange={handleChange}
            error={errors.title}
            required
          />
        </div>
        <FormField
          label="Slug"
          name="slug"
          value={values.slug}
          onChange={handleChange}
          optional
          hint="Used in the public profile URL. Leave blank to generate automatically from the name."
        />
        <ImageUploader value={values.image} onChange={(url) => setField("image", url)} />
        <FormField
          as="textarea"
          rows={2}
          label="Short Bio"
          name="shortBio"
          value={values.shortBio}
          onChange={handleChange}
          optional
          hint="Shown on lawyer cards throughout the directory."
        />
        <FormField
          as="textarea"
          rows={6}
          label="Full Biography"
          name="fullBio"
          value={values.fullBio}
          onChange={handleChange}
          optional
        />
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="font-heading text-lg font-semibold text-navy-900">Professional Information</h2>
        <PracticeAreaCheckboxes
          selected={values.practiceAreas}
          onChange={(items) => setField("practiceAreas", items)}
          options={practiceAreaOptions}
          error={errors.practiceAreas}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label="Location"
            name="location"
            value={values.location}
            onChange={handleChange}
            error={errors.location}
            required
            hint="City, State"
          />
          <FormField label="Firm" name="firm" value={values.firm} onChange={handleChange} optional />
        </div>
        <FormField
          label="Years of Experience"
          name="yearsOfExperience"
          type="number"
          min="0"
          value={values.yearsOfExperience}
          onChange={handleChange}
          optional
          className="sm:max-w-xs"
        />
        <ListField
          label="Education"
          items={values.education}
          onChange={(items) => setField("education", items)}
          placeholder="e.g. J.D., University of Texas School of Law"
        />
        <ListField
          label="Languages"
          items={values.languages}
          onChange={(items) => setField("languages", items)}
          placeholder="e.g. English"
        />
        <FormField
          label="Bar / Admission Information"
          name="barAdmissions"
          value={values.barAdmissions}
          onChange={handleChange}
          optional
        />
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="font-heading text-lg font-semibold text-navy-900">Contact</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            optional
          />
          <FormField label="Phone" name="phone" type="tel" value={values.phone} onChange={handleChange} optional />
        </div>
        <FormField label="Website" name="website" type="url" value={values.website} onChange={handleChange} optional />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-lg font-semibold text-navy-900">Profile Settings</h2>
        <label className="flex items-center gap-2 text-sm text-navy-800">
          <input
            type="checkbox"
            name="featured"
            checked={values.featured}
            onChange={handleChange}
            className="h-4 w-4 rounded border-navy-900/25 text-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
          />
          Featured on homepage
        </label>
        <label className="flex items-center gap-2 text-sm text-navy-800">
          <input
            type="checkbox"
            name="isPublic"
            checked={values.isPublic}
            onChange={handleChange}
            className="h-4 w-4 rounded border-navy-900/25 text-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
          />
          Publicly visible on the directory
        </label>
        <FormField
          as="select"
          label="Status"
          name="status"
          value={values.status}
          onChange={handleChange}
          options={STATUS_OPTIONS}
          className="sm:max-w-xs"
        />
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="font-heading text-lg font-semibold text-navy-900">SEO</h2>
        <FormField label="SEO Title" name="seoTitle" value={values.seoTitle} onChange={handleChange} optional />
        <FormField
          as="textarea"
          rows={2}
          label="SEO Description"
          name="seoDescription"
          value={values.seoDescription}
          onChange={handleChange}
          optional
        />
      </section>

      <p className="-mb-4 text-xs text-muted-400" aria-live="polite">
        {isDirty ? "You have unsaved changes." : "No unsaved changes."}
      </p>
      <FormActions onCancel={handleCancel} submitLabel={submitLabel} saving={saving} error={submitError} />
    </form>
  );
}

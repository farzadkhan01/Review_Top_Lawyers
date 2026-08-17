/** @format */

"use client";

import { useMemo, useState } from "react";
import FormField from "@/components/admin/FormField";
import ImageUploader from "@/components/admin/ImageUploader";
import ArticleContentEditor from "@/components/admin/articles/ArticleContentEditor";
import StatusBadge from "@/components/admin/StatusBadge";
import Button from "@/components/ui/Button";
import { getCategoryOptions, slugify } from "@/lib/admin/articles";
import { useUnsavedChangesWarning } from "@/lib/admin/useUnsavedChanges";

const EMPTY_ARTICLE = {
  title: "",
  slug: "",
  category: "",
  author: "",
  excerpt: "",
  image: "",
  content: "",
  status: "draft",
  publishedAt: new Date().toISOString().slice(0, 10),
  seoTitle: "",
  seoDescription: "",
};

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function validate(values) {
  const errors = {};
  if (!values.title.trim()) errors.title = "Title is required.";
  if (values.slug.trim() && !SLUG_PATTERN.test(values.slug.trim())) {
    errors.slug = "Use lowercase letters, numbers, and hyphens only.";
  }
  if (!values.category) errors.category = "Select a category.";
  if (!values.author.trim()) errors.author = "Author is required.";
  if (!values.excerpt.trim()) errors.excerpt = "Excerpt is required.";
  else if (values.excerpt.trim().length > 220) {
    errors.excerpt = "Keep the excerpt under 220 characters.";
  }
  if (!values.image) errors.image = "A featured image is required.";
  if (!values.content.trim()) errors.content = "Article content is required.";
  else if (values.content.trim().length < 40) {
    errors.content = "Add a bit more content before saving (at least 40 characters).";
  }
  return errors;
}

export default function ArticleForm({ initialValues, onSave, onCancel, mode = "create" }) {
  const [values, setValues] = useState({ ...EMPTY_ARTICLE, ...initialValues });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [savingIntent, setSavingIntent] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const categoryOptions = useMemo(
    () => [{ value: "", label: "Select a category" }, ...getCategoryOptions()],
    []
  );

  const baseline = useMemo(() => ({ ...EMPTY_ARTICLE, ...initialValues }), [initialValues]);
  const isDirty = JSON.stringify(values) !== JSON.stringify(baseline);
  useUnsavedChangesWarning(isDirty && !saving);

  function setField(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setField(name, value);
  }

  function handleTitleBlur() {
    if (!values.slug.trim() && values.title.trim()) {
      setField("slug", slugify(values.title));
    }
  }

  async function handleSave(targetStatus) {
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSaving(true);
    setSavingIntent(targetStatus);
    setSubmitError("");
    setField("status", targetStatus);

    try {
      await onSave({ ...values, status: targetStatus });
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
      setSaving(false);
      setSavingIntent(null);
    }
  }

  function handleCancel() {
    if (isDirty && typeof window !== "undefined") {
      const confirmed = window.confirm("Discard unsaved changes to this article?");
      if (!confirmed) return;
    }
    onCancel();
  }

  const isPublished = values.status === "published";
  const primaryLabel = isPublished ? "Save Changes" : "Publish";
  const primaryStatus = "published";
  const secondaryLabel = "Save Draft";

  return (
    <form onSubmit={(event) => event.preventDefault()} noValidate className="flex flex-col gap-10">
      <section className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-lg font-semibold text-navy-900">Basic Information</h2>
          <StatusBadge status={values.status} />
        </div>
        <FormField
          label="Title"
          name="title"
          value={values.title}
          onChange={handleChange}
          onBlur={handleTitleBlur}
          error={errors.title}
          required
        />
        <FormField
          label="Slug"
          name="slug"
          value={values.slug}
          onChange={handleChange}
          error={errors.slug}
          optional
          hint="Used in the public article URL. Leave blank to generate automatically from the title."
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            as="select"
            label="Category"
            name="category"
            value={values.category}
            onChange={handleChange}
            error={errors.category}
            options={categoryOptions}
            required
          />
          <FormField
            label="Author"
            name="author"
            value={values.author}
            onChange={handleChange}
            error={errors.author}
            required
          />
        </div>
        <FormField
          as="textarea"
          rows={3}
          label="Excerpt"
          name="excerpt"
          value={values.excerpt}
          onChange={handleChange}
          error={errors.excerpt}
          required
          hint={`Shown on article cards and in search results. ${values.excerpt.length}/220 characters.`}
        />
        <ImageUploader label="Featured Image" value={values.image} onChange={(url) => setField("image", url)} />
        {errors.image && (
          <p role="alert" className="-mt-3 text-sm text-red-600">
            {errors.image}
          </p>
        )}
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="font-heading text-lg font-semibold text-navy-900">Content</h2>
        <ArticleContentEditor
          value={values.content}
          onChange={(value) => setField("content", value)}
          error={errors.content}
        />
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="font-heading text-lg font-semibold text-navy-900">Publishing</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            as="select"
            label="Status"
            name="status"
            value={values.status}
            onChange={handleChange}
            options={[
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
            ]}
          />
          <FormField
            label="Publish Date"
            name="publishedAt"
            type="date"
            value={values.publishedAt}
            onChange={handleChange}
          />
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="font-heading text-lg font-semibold text-navy-900">SEO</h2>
        <FormField
          label="SEO Title"
          name="seoTitle"
          value={values.seoTitle}
          onChange={handleChange}
          optional
          hint={`Recommended up to 60 characters. ${values.seoTitle.length}/60.`}
        />
        <FormField
          as="textarea"
          rows={2}
          label="SEO Description"
          name="seoDescription"
          value={values.seoDescription}
          onChange={handleChange}
          optional
          hint={`Recommended up to 160 characters. ${values.seoDescription.length}/160.`}
        />
      </section>

      <div className="flex flex-col gap-4 border-t border-cream-200 pt-6">
        {submitError && (
          <p role="alert" className="text-sm text-red-600">
            {submitError}
          </p>
        )}
        <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-400" aria-live="polite">
            {isDirty ? "You have unsaved changes." : "No unsaved changes."}
          </p>
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <Button type="button" variant="secondary" onClick={handleCancel} disabled={saving}>
              Cancel
            </Button>
            <Button type="button" variant="ghost" onClick={() => handleSave("draft")} disabled={saving}>
              {saving && savingIntent === "draft" ? "Saving..." : secondaryLabel}
            </Button>
            <Button type="button" variant="primary" onClick={() => handleSave(primaryStatus)} disabled={saving}>
              {saving && savingIntent === "published" ? "Saving..." : primaryLabel}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

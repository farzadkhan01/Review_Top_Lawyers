/** @format */

import Button from "@/components/ui/Button";

export default function FormActions({
  onCancel,
  cancelLabel = "Cancel",
  submitLabel = "Save",
  saving = false,
  savingLabel = "Saving...",
  error,
}) {
  return (
    <div className="flex flex-col gap-4 border-t border-cream-200 pt-6">
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={saving}>
            {cancelLabel}
          </Button>
        )}
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? savingLabel : submitLabel}
        </Button>
      </div>
    </div>
  );
}

/** @format */

"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangleIcon } from "@/components/ui/icons";
import Button from "@/components/ui/Button";

const TRANSITION_MS = 200;

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
  error,
  variant = "danger",
}) {
  const [isRendered, setIsRendered] = useState(open);
  const closeTimeoutRef = useRef(null);

  useEffect(() => {
    if (open) {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsRendered(true);
      return undefined;
    }
    closeTimeoutRef.current = setTimeout(() => setIsRendered(false), TRANSITION_MS);
    return () => clearTimeout(closeTimeoutRef.current);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") onCancel?.();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onCancel]);

  if (!isRendered) return null;

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[60] bg-navy-950/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: TRANSITION_MS / 1000 }}
        onClick={onCancel}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
          aria-describedby={description ? "confirm-dialog-description" : undefined}
          className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0.96 }}
          transition={{ duration: TRANSITION_MS / 1000 }}
        >
          <div className="flex items-start gap-3">
            {variant === "danger" && (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                <AlertTriangleIcon className="h-5 w-5" />
              </span>
            )}
            <div>
              <h2 id="confirm-dialog-title" className="font-heading text-lg font-semibold text-navy-900">
                {title}
              </h2>
              {description && (
                <p id="confirm-dialog-description" className="mt-1.5 text-sm leading-relaxed text-muted-600">
                  {description}
                </p>
              )}
            </div>
          </div>

          {error && (
            <p role="alert" className="mt-4 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
              {cancelLabel}
            </Button>
            <Button
              type="button"
              variant={variant === "danger" ? "danger" : "primary"}
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? "Please wait..." : confirmLabel}
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  );
}

/** @format */

"use client";

import { useEffect } from "react";

/** Warns before a browser refresh/close while a form has unsaved edits. */
export function useUnsavedChangesWarning(isDirty) {
  useEffect(() => {
    if (!isDirty) return undefined;

    function handleBeforeUnload(event) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);
}

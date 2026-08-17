/** @format */

"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UploadIcon, TrashIcon } from "@/components/ui/icons";
import { uploadImage } from "@/lib/admin/upload";
import { cn } from "@/lib/utils";

export default function ImageUploader({ value, onChange, label = "Profile Image" }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function handleFiles(fileList) {
    const file = fileList?.[0];
    if (!file) return;

    setStatus("uploading");
    setError("");

    try {
      const result = await uploadImage(file);
      onChange(result.url);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err.message || "Upload failed. Please try again.");
    }
  }

  function handleRemove() {
    onChange("");
    setStatus("idle");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-navy-900">{label}</span>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          handleFiles(event.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center gap-3 rounded-lg border-2 border-dashed p-6 text-center transition-colors",
          isDragging ? "border-gold-600 bg-gold-500/5" : "border-navy-900/15 bg-cream-50"
        )}
      >
        {value ? (
          <div className="relative h-24 w-24 overflow-hidden rounded-full bg-cream-100">
            <Image src={value} alt="Uploaded preview" fill sizes="96px" className="object-cover" />
          </div>
        ) : (
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-900/5 text-navy-800">
            <UploadIcon className="h-5 w-5" />
          </span>
        )}

        <div className="text-sm text-muted-600">
          {status === "uploading" ? (
            <span>Uploading...</span>
          ) : (
            <>
              Drag and drop an image, or{" "}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded font-semibold text-navy-900 underline underline-offset-2 hover:text-gold-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
              >
                browse
              </button>
            </>
          )}
        </div>

        <p className="text-xs text-muted-400">PNG, JPG, or WEBP. Up to 5MB.</p>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => handleFiles(event.target.files)}
        />

        {value && status !== "uploading" && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded text-sm font-medium text-navy-800 hover:text-gold-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex items-center gap-1 rounded text-sm font-medium text-red-600 hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
            >
              <TrashIcon className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

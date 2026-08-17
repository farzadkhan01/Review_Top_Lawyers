/** @format */

"use client";

import { useRef, useState } from "react";
import ArticleContentBlocks from "@/components/admin/articles/ArticleContentBlocks";
import { wordCount } from "@/lib/admin/articleContent";
import { cn } from "@/lib/utils";

const TOOLBAR_ACTIONS = [
  { label: "Heading", markup: "## ", block: true },
  { label: "Subheading", markup: "### ", block: true },
  { label: "Bold", before: "**", after: "**" },
  { label: "List Item", markup: "- ", block: true },
  { label: "Link", before: "[", after: "](https://)" },
];

export default function ArticleContentEditor({ value, onChange, error }) {
  const [tab, setTab] = useState("write");
  const textareaRef = useRef(null);

  function applyAction(action) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd } = textarea;
    const selected = value.slice(selectionStart, selectionEnd);

    let nextValue;
    let nextCursor;

    if (action.block) {
      const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
      nextValue = value.slice(0, lineStart) + action.markup + value.slice(lineStart);
      nextCursor = selectionStart + action.markup.length;
    } else {
      nextValue =
        value.slice(0, selectionStart) +
        action.before +
        selected +
        action.after +
        value.slice(selectionEnd);
      nextCursor = selectionStart + action.before.length + selected.length + action.after.length;
    }

    onChange(nextValue);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(nextCursor, nextCursor);
    });
  }

  const id = "field-content";
  const errorId = `${id}-error`;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="block text-sm font-medium text-navy-900">
          Article Content <span className="text-red-600">*</span>
        </label>
        <div className="flex overflow-hidden rounded-md border border-navy-900/15 text-xs font-medium">
          <button
            type="button"
            onClick={() => setTab("write")}
            aria-pressed={tab === "write"}
            className={cn("px-3 py-1.5", tab === "write" ? "bg-navy-900 text-cream-50" : "bg-white text-navy-700 hover:bg-cream-50")}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            aria-pressed={tab === "preview"}
            className={cn("px-3 py-1.5", tab === "preview" ? "bg-navy-900 text-cream-50" : "bg-white text-navy-700 hover:bg-cream-50")}
          >
            Preview
          </button>
        </div>
      </div>

      {tab === "write" ? (
        <>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {TOOLBAR_ACTIONS.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => applyAction(action)}
                className="rounded-md border border-navy-900/15 bg-white px-2.5 py-1 text-xs font-medium text-navy-800 hover:bg-cream-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
              >
                {action.label}
              </button>
            ))}
          </div>
          <textarea
            id={id}
            ref={textareaRef}
            rows={14}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : "content-hint"}
            className={cn(
              "w-full rounded-md border bg-white px-3.5 py-2.5 font-mono text-sm text-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-600",
              error ? "border-red-400" : "border-navy-900/15 focus:border-navy-900/40"
            )}
          />
          <div className="mt-1.5 flex items-center justify-between">
            {error ? (
              <p id={errorId} role="alert" className="text-sm text-red-600">
                {error}
              </p>
            ) : (
              <p id="content-hint" className="text-xs text-muted-400">
                Supports ## headings, **bold**, - lists, and [link](url).
              </p>
            )}
            <span className="shrink-0 text-xs text-muted-400">{wordCount(value)} words</span>
          </div>
        </>
      ) : (
        <div className="rounded-md border border-navy-900/15 bg-cream-50 p-5">
          <ArticleContentBlocks content={value} />
        </div>
      )}
    </div>
  );
}

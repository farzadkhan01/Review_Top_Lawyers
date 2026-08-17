/** @format */

/**
 * Minimal markdown-lite parser for the article body editor. Deliberately
 * small and dependency-free — the backend developer can later swap the
 * editor + this parser for a proper rich-text solution without changing
 * the `content` field's contract (it stays a plain string).
 *
 * Supported syntax:
 *   ## Heading            -> heading (level 2)
 *   ### Heading           -> heading (level 3)
 *   - list item           -> bullet list (consecutive lines grouped)
 *   blank-line separated  -> paragraphs
 *   **bold** / [text](url) -> inline formatting within paragraphs and list items
 */

export function parseArticleContent(content = "") {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let paragraphLines = [];
  let listItems = [];

  function flushParagraph() {
    if (paragraphLines.length) {
      blocks.push({ type: "paragraph", text: paragraphLines.join(" ").trim() });
      paragraphLines = [];
    }
  }

  function flushList() {
    if (listItems.length) {
      blocks.push({ type: "list", items: listItems });
      listItems = [];
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    if (line.startsWith("### ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "heading", level: 3, text: line.slice(4).trim() });
      continue;
    }

    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "heading", level: 2, text: line.slice(3).trim() });
      continue;
    }

    if (line.startsWith("- ")) {
      flushParagraph();
      listItems.push(line.slice(2).trim());
      continue;
    }

    flushList();
    paragraphLines.push(line);
  }

  flushParagraph();
  flushList();

  return blocks;
}

/** Splits inline text on **bold** and [label](url) markers for rendering. */
export function parseInline(text = "") {
  const parts = [];
  const pattern = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    if (match[1] !== undefined) {
      parts.push({ type: "bold", value: match[1] });
    } else {
      parts.push({ type: "link", value: match[2], href: match[3] });
    }
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", value: text.slice(lastIndex) });
  }

  return parts;
}

export function wordCount(content = "") {
  return content.trim().split(/\s+/).filter(Boolean).length;
}

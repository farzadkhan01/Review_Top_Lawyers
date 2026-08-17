/** @format */

import { parseArticleContent, parseInline } from "@/lib/admin/articleContent";

function Inline({ text }) {
  return parseInline(text).map((part, index) => {
    if (part.type === "bold") return <strong key={index}>{part.value}</strong>;
    if (part.type === "link") {
      return (
        <a
          key={index}
          href={part.href}
          className="underline underline-offset-2 hover:text-gold-700"
          target="_blank"
          rel="noopener noreferrer"
        >
          {part.value}
        </a>
      );
    }
    return <span key={index}>{part.value}</span>;
  });
}

export default function ArticleContentBlocks({ content, className }) {
  const blocks = parseArticleContent(content);

  if (!blocks.length) {
    return <p className={className ?? "text-sm text-muted-400"}>Nothing to preview yet.</p>;
  }

  return (
    <div className={className ?? "flex flex-col gap-5"}>
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const Tag = block.level === 3 ? "h3" : "h2";
          return (
            <Tag
              key={index}
              className={
                block.level === 3
                  ? "font-heading text-lg font-semibold text-navy-900"
                  : "font-heading text-xl font-semibold text-navy-900"
              }
            >
              <Inline text={block.text} />
            </Tag>
          );
        }

        if (block.type === "list") {
          return (
            <ul key={index} className="list-disc space-y-1.5 pl-5 text-base leading-relaxed text-muted-600">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <Inline text={item} />
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={index} className="break-words text-base leading-relaxed text-muted-600">
            <Inline text={block.text} />
          </p>
        );
      })}
    </div>
  );
}

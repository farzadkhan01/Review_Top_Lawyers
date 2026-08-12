import { cn } from "@/lib/utils";

export default function Card({ as: Tag = "div", className, children }) {
  return (
    <Tag
      className={cn(
        "rounded-lg border border-cream-200 bg-white p-6 shadow-sm transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-md motion-reduce:hover:translate-y-0",
        className
      )}
    >
      {children}
    </Tag>
  );
}

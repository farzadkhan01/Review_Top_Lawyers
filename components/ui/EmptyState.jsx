import { cn } from "@/lib/utils";

export default function EmptyState({ title, description, action, className }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-lg border border-dashed border-navy-900/15 bg-white px-6 py-16 text-center",
        className
      )}
    >
      <h3 className="font-heading text-xl font-semibold text-navy-900">{title}</h3>
      {description && (
        <p className="max-w-md text-sm leading-relaxed text-muted-600">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

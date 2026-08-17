/** @format */

import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  active: "bg-emerald-50 text-emerald-700",
  published: "bg-emerald-50 text-emerald-700",
  inactive: "bg-navy-900/5 text-muted-600",
  hidden: "bg-navy-900/5 text-muted-600",
  pending: "bg-gold-500/10 text-gold-700",
  draft: "bg-gold-500/10 text-gold-700",
};

const STATUS_LABELS = {
  active: "Active",
  inactive: "Inactive",
  published: "Published",
  pending: "Pending",
  hidden: "Hidden",
  draft: "Draft",
};

export default function StatusBadge({ status, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        STATUS_STYLES[status] ?? "bg-navy-900/5 text-muted-600",
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

import { cn } from "@/lib/utils";

const VARIANT_STYLES = {
  neutral: "bg-navy-900/5 text-navy-800",
  gold: "bg-gold-500/10 text-gold-700",
  outline: "border border-navy-900/15 text-navy-700",
};

export default function Badge({ children, variant = "neutral", className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        VARIANT_STYLES[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

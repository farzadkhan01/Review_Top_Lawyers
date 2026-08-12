import Link from "next/link";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";

/**
 * Text-based brand mark. Replace the monogram span with an <Image> once a
 * real logo asset is available — the surrounding markup/props stay stable.
 */
export default function Logo({ tone = "dark", className }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2 font-heading text-lg font-semibold tracking-tight sm:text-xl",
        tone === "dark" ? "text-navy-900" : "text-cream-50",
        className
      )}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-500 text-sm font-bold text-navy-950">
        RL
      </span>
      <span>{SITE_NAME}</span>
    </Link>
  );
}

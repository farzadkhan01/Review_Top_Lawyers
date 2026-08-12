"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const VARIANT_STYLES = {
  primary: "bg-navy-900 text-cream-50 hover:bg-navy-800",
  secondary:
    "bg-transparent text-navy-900 ring-1 ring-inset ring-navy-900/20 hover:bg-navy-900/5 hover:ring-navy-900/40",
  ghost: "bg-transparent text-navy-900 hover:bg-navy-900/5",
  light: "bg-cream-50 text-navy-900 hover:bg-cream-100",
};

const SIZE_STYLES = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-base",
};

const MOTION_PROPS = {
  whileHover: { y: -1 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.15 },
};

export default function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  type = "button",
  disabled = false,
  ...props
}) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600",
    "disabled:pointer-events-none disabled:opacity-50",
    VARIANT_STYLES[variant],
    SIZE_STYLES[size],
    className
  );

  if (href) {
    return (
      <motion.div className="inline-block" {...MOTION_PROPS}>
        <Link href={href} className={classes} {...props}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      type={type}
      disabled={disabled}
      className={classes}
      {...(disabled ? {} : MOTION_PROPS)}
      {...props}
    >
      {children}
    </motion.button>
  );
}

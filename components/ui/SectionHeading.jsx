"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  titleAs: Tag = "h2",
  className,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && (
        <span className="text-sm font-semibold uppercase tracking-wider text-gold-700">
          {eyebrow}
        </span>
      )}
      <Tag className="font-heading text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl">
        {title}
      </Tag>
      {description && (
        <p className="max-w-2xl text-base leading-relaxed text-muted-600">{description}</p>
      )}
    </motion.div>
  );
}

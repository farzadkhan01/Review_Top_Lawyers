"use client";

import { motion } from "framer-motion";

/**
 * Generic fade/slide-up entrance wrapper. Lets server components (grids of
 * cards, feature lists) get a scroll-triggered reveal without becoming
 * client components themselves — only this leaf needs the "use client" boundary.
 */
export default function Reveal({ children, delay = 0, y = 16, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

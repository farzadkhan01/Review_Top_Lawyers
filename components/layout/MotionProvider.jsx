"use client";

import { MotionConfig } from "framer-motion";

/**
 * Makes every Framer Motion animation in the app honor the user's
 * prefers-reduced-motion setting from a single place.
 */
export default function MotionProvider({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

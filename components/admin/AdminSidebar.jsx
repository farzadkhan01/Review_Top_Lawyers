/** @format */

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ADMIN_NAV_LINKS } from "@/components/admin/adminNav";
import { CloseIcon, LogoutIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const TRANSITION_MS = 250;

function SidebarNav({ pathname, onNavigate }) {
  return (
    <nav aria-label="Admin" className="flex flex-1 flex-col gap-1">
      {ADMIN_NAV_LINKS.map((link) => {
        const isActive =
          pathname === link.href || (link.href !== "/admin/dashboard" && pathname.startsWith(link.href));

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-navy-900 text-cream-50"
                : "text-navy-800 hover:bg-navy-900/5"
            )}
          >
            <link.icon className="h-4.5 w-4.5" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarFooter({ admin, onLogout }) {
  return (
    <div className="border-t border-cream-200 pt-4">
      <div className="flex items-center gap-3 px-1">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500 text-sm font-bold text-navy-950">
          {admin?.name?.[0] ?? "A"}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-navy-900">{admin?.name ?? "Admin"}</p>
          <p className="truncate text-xs text-muted-400">{admin?.role ?? "Administrator"}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onLogout}
        className="mt-3 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-navy-800 transition-colors hover:bg-navy-900/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
      >
        <LogoutIcon className="h-4.5 w-4.5" />
        Log Out
      </button>
    </div>
  );
}

export default function AdminSidebar({ open, onClose, admin, onLogout }) {
  const pathname = usePathname();
  const [isRendered, setIsRendered] = useState(open);
  const closeTimeoutRef = useRef(null);

  useEffect(() => {
    if (open) {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsRendered(true);
      return undefined;
    }
    closeTimeoutRef.current = setTimeout(() => setIsRendered(false), TRANSITION_MS);
    return () => clearTimeout(closeTimeoutRef.current);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose?.();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col gap-6 border-r border-cream-200 bg-white p-5 lg:flex">
        <Link href="/admin/dashboard" className="flex items-center gap-2 px-1">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-500 text-sm font-bold text-navy-950">
            RL
          </span>
          <span className="font-heading text-lg font-semibold text-navy-900">Admin Portal</span>
        </Link>
        <SidebarNav pathname={pathname} />
        <SidebarFooter admin={admin} onLogout={onLogout} />
      </aside>

      {/* Mobile drawer */}
      {isRendered && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-navy-950/40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: open ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            id="admin-mobile-sidebar"
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation"
            className="fixed inset-y-0 left-0 z-50 flex w-full max-w-xs flex-col gap-6 overflow-y-auto bg-white p-5 shadow-xl lg:hidden"
            initial={{ x: "-100%" }}
            animate={{ x: open ? 0 : "-100%" }}
            transition={{ type: "tween", duration: TRANSITION_MS / 1000, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between">
              <Link href="/admin/dashboard" onClick={onClose} className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-500 text-sm font-bold text-navy-950">
                  RL
                </span>
                <span className="font-heading text-lg font-semibold text-navy-900">Admin Portal</span>
              </Link>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-navy-800 hover:bg-navy-900/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <SidebarNav pathname={pathname} onNavigate={onClose} />
            <SidebarFooter admin={admin} onLogout={onLogout} />
          </motion.div>
        </>
      )}
    </>
  );
}

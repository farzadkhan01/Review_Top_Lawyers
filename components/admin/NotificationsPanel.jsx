/** @format */

"use client";

import { useEffect, useRef, useState } from "react";
import { BellIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: "New review awaiting moderation",
    detail: "A new review for Marcus Webb needs approval.",
    time: "10 min ago",
    unread: true,
  },
  {
    id: 2,
    title: "Article draft updated",
    detail: '"Do You Need a Will? Estate Planning Basics" was saved as a draft.',
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 3,
    title: "Lawyer profile updated",
    detail: "Amelia Torres's profile was edited.",
    time: "Yesterday",
    unread: false,
  },
];

export default function NotificationsPanel() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(INITIAL_NOTIFICATIONS);
  const containerRef = useRef(null);
  const unreadCount = items.filter((item) => item.unread).length;

  useEffect(() => {
    if (!open) return undefined;

    function handleClick(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-md text-navy-800 hover:bg-navy-900/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
      >
        <BellIcon className="h-5 w-5" />
        {unreadCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-gold-500 ring-2 ring-white"
          />
        )}
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Notifications"
          className="absolute right-0 z-30 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-lg border border-cream-200 bg-white p-2 shadow-xl"
        >
          <div className="flex items-center justify-between px-2 py-1.5">
            <p className="text-sm font-semibold text-navy-900">Notifications</p>
            {items.length > 0 && (
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setItems((prev) => prev.map((item) => ({ ...item, unread: false })))}
                    className="rounded text-xs font-medium text-navy-600 hover:text-gold-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setItems([])}
                  className="rounded text-xs font-medium text-muted-400 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {items.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-muted-600">You&apos;re all caught up.</p>
          ) : (
            <ul className="mt-1 flex max-h-80 flex-col gap-0.5 overflow-y-auto">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() =>
                      setItems((prev) => prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n)))
                    }
                    className={cn(
                      "flex w-full flex-col gap-0.5 rounded-md px-2 py-2 text-left hover:bg-cream-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600",
                      item.unread && "bg-gold-500/5"
                    )}
                  >
                    <span className="flex items-center gap-2 text-sm font-medium text-navy-900">
                      {item.unread && (
                        <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                      )}
                      {item.title}
                    </span>
                    <span className="text-xs text-muted-600">{item.detail}</span>
                    <span className="text-xs text-muted-400">{item.time}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

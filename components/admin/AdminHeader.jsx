/** @format */

import { MenuIcon } from "@/components/ui/icons";
import AdminGlobalSearch from "@/components/admin/AdminGlobalSearch";
import NotificationsPanel from "@/components/admin/NotificationsPanel";

export default function AdminHeader({ onMenuClick, admin }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b border-cream-200 bg-white/95 px-4 backdrop-blur sm:gap-4 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open admin menu"
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-navy-800 hover:bg-navy-900/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600 lg:hidden"
      >
        <MenuIcon className="h-5.5 w-5.5" />
      </button>

      <div className="min-w-0 flex-1">
        <AdminGlobalSearch />
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <NotificationsPanel />
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-500 text-xs font-bold text-navy-950 lg:hidden">
          {admin?.name?.[0] ?? "A"}
        </span>
      </div>
    </header>
  );
}

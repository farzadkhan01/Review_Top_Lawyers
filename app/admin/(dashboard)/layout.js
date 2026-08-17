/** @format */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { getCurrentAdmin, logout } from "@/lib/admin/auth";

export default function AdminDashboardLayout({ children }) {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getCurrentAdmin().then((current) => {
      if (!isMounted) return;
      if (!current) {
        router.replace("/admin/login");
        return;
      }
      setAdmin(current);
      setAuthChecked(true);
    });

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleLogout() {
    await logout();
    router.replace("/admin/login");
  }

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-100">
        <p className="text-sm text-muted-600">Loading admin portal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <AdminSidebar
        open={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        admin={admin}
        onLogout={handleLogout}
      />

      <div className="lg:pl-64">
        <AdminHeader onMenuClick={() => setIsMobileNavOpen(true)} admin={admin} />
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

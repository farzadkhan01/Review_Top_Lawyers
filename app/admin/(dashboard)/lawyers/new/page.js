/** @format */

"use client";

import { useRouter } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Breadcrumbs from "@/components/admin/Breadcrumbs";
import LawyerForm from "@/components/admin/lawyers/LawyerForm";
import { createLawyer } from "@/lib/admin/lawyers";

export default function NewLawyerPage() {
  const router = useRouter();

  async function handleSubmit(payload) {
    await createLawyer(payload);
    router.push("/admin/lawyers");
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Lawyers", href: "/admin/lawyers" },
          { label: "New Lawyer" },
        ]}
      />
      <AdminPageHeader title="Add Lawyer" description="Create a new lawyer profile for the public directory." />
      <div className="max-w-3xl rounded-lg border border-cream-200 bg-white p-6 sm:p-8">
        <LawyerForm
          onSubmit={handleSubmit}
          onCancel={() => router.push("/admin/lawyers")}
          submitLabel="Create Lawyer"
        />
      </div>
    </div>
  );
}

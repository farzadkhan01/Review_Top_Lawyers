/** @format */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Breadcrumbs from "@/components/admin/Breadcrumbs";
import LawyerForm from "@/components/admin/lawyers/LawyerForm";
import Button from "@/components/ui/Button";
import { getLawyer, updateLawyer } from "@/lib/admin/lawyers";

export default function EditLawyerClient({ id }) {
  const router = useRouter();
  const [lawyer, setLawyer] = useState(null);
  const [status, setStatus] = useState("loading");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getLawyer(id).then((result) => {
      if (!isMounted) return;
      setLawyer(result);
      setStatus(result ? "ready" : "not-found");
    });
    return () => {
      isMounted = false;
    };
  }, [id]);

  async function handleSubmit(payload) {
    await updateLawyer(id, payload);
    setSaved(true);
  }

  if (status === "loading") {
    return <p className="text-sm text-muted-600">Loading lawyer...</p>;
  }

  if (status === "not-found") {
    return (
      <div className="flex flex-col gap-4">
        <AdminPageHeader
          title="Lawyer Not Found"
          description="This lawyer profile does not exist or may have been removed."
        />
        <Button href="/admin/lawyers" variant="primary" className="self-start">
          Back to Lawyers
        </Button>
      </div>
    );
  }

  if (saved) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-lg border border-cream-200 bg-white p-8">
        <h1 className="font-heading text-xl font-semibold text-navy-900">Changes Saved</h1>
        <p className="text-sm text-muted-600">{lawyer.name}&apos;s profile has been updated.</p>
        <div className="flex gap-3">
          <Button href="/admin/lawyers" variant="primary">
            Back to Lawyers
          </Button>
          <Button type="button" variant="secondary" onClick={() => setSaved(false)}>
            Keep Editing
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Lawyers", href: "/admin/lawyers" },
          { label: lawyer.name },
        ]}
      />
      <AdminPageHeader title={`Edit ${lawyer.name}`} description="Update this lawyer's public profile information." />
      <div className="max-w-3xl rounded-lg border border-cream-200 bg-white p-6 sm:p-8">
        <LawyerForm
          initialValues={lawyer}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/admin/lawyers")}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}

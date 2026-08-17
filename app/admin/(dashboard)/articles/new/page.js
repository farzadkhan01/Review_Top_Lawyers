/** @format */

"use client";

import { useRouter } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Breadcrumbs from "@/components/admin/Breadcrumbs";
import ArticleForm from "@/components/admin/articles/ArticleForm";
import { createArticle } from "@/lib/admin/articles";

export default function NewArticlePage() {
  const router = useRouter();

  async function handleSave(payload) {
    await createArticle(payload);
    router.push("/admin/articles");
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Articles", href: "/admin/articles" },
          { label: "New Article" },
        ]}
      />
      <AdminPageHeader title="Add Article" description="Write and publish a new article for the public site." />
      <div className="max-w-3xl rounded-lg border border-cream-200 bg-white p-6 sm:p-8">
        <ArticleForm mode="create" onSave={handleSave} onCancel={() => router.push("/admin/articles")} />
      </div>
    </div>
  );
}

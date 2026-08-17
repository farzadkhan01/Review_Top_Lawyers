/** @format */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Breadcrumbs from "@/components/admin/Breadcrumbs";
import ArticleForm from "@/components/admin/articles/ArticleForm";
import Button from "@/components/ui/Button";
import { getArticle, updateArticle } from "@/lib/admin/articles";

export default function EditArticleClient({ id }) {
  const router = useRouter();
  const [article, setArticle] = useState(null);
  const [status, setStatus] = useState("loading");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getArticle(id).then((result) => {
      if (!isMounted) return;
      setArticle(result);
      setStatus(result ? "ready" : "not-found");
    });
    return () => {
      isMounted = false;
    };
  }, [id]);

  async function handleSave(payload) {
    const updated = await updateArticle(id, payload);
    setArticle(updated);
    setSaved(true);
  }

  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Articles", href: "/admin/articles" },
    { label: article ? article.title : "Edit Article" },
  ];

  if (status === "loading") {
    return <p className="text-sm text-muted-600">Loading article...</p>;
  }

  if (status === "not-found") {
    return (
      <div className="flex flex-col gap-4">
        <AdminPageHeader
          title="Article Not Found"
          description="This article does not exist or may have been removed."
        />
        <Button href="/admin/articles" variant="primary" className="self-start">
          Back to Articles
        </Button>
      </div>
    );
  }

  if (saved) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-lg border border-cream-200 bg-white p-8">
        <h1 className="font-heading text-xl font-semibold text-navy-900">Changes Saved</h1>
        <p className="text-sm text-muted-600">
          &ldquo;{article.title}&rdquo; has been {article.status === "published" ? "published" : "saved as a draft"}.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button href="/admin/articles" variant="primary">
            Back to Articles
          </Button>
          <Button href={`/admin/articles/${article.id}/preview`} variant="secondary">
            Preview
          </Button>
          <Button type="button" variant="ghost" onClick={() => setSaved(false)}>
            Keep Editing
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={breadcrumbItems} />
      <AdminPageHeader title={`Edit Article`} description={article.title} />
      <div className="max-w-3xl rounded-lg border border-cream-200 bg-white p-6 sm:p-8">
        <ArticleForm
          mode="edit"
          initialValues={article}
          onSave={handleSave}
          onCancel={() => router.push("/admin/articles")}
        />
      </div>
    </div>
  );
}

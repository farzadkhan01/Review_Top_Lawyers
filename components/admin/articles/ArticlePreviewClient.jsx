/** @format */

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/admin/StatusBadge";
import Breadcrumbs from "@/components/admin/Breadcrumbs";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ArticleContentBlocks from "@/components/admin/articles/ArticleContentBlocks";
import { AlertTriangleIcon } from "@/components/ui/icons";
import { getArticle } from "@/lib/admin/articles";

function formatArticleDate(dateString) {
  if (!dateString) return "Not set";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ArticlePreviewClient({ id }) {
  const [article, setArticle] = useState(null);
  const [status, setStatus] = useState("loading");

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

  if (status === "loading") {
    return <p className="text-sm text-muted-600">Loading preview...</p>;
  }

  if (status === "not-found") {
    return (
      <div className="flex flex-col gap-4">
        <AdminPageHeader title="Article Not Found" description="This article does not exist or may have been removed." />
        <Button href="/admin/articles" variant="primary" className="self-start">
          Back to Articles
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Articles", href: "/admin/articles" },
          { label: article.title },
          { label: "Preview" },
        ]}
      />

      <div className="flex flex-col gap-4 rounded-lg border border-gold-500/30 bg-gold-500/5 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-gold-700">
            <AlertTriangleIcon className="h-4 w-4" />
          </span>
          <div>
            <p className="font-heading text-sm font-semibold text-navy-900">Preview Mode</p>
            <p className="mt-0.5 text-sm text-muted-600">
              This is an approximation of how the article will appear on the public site. It is not the live page.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <StatusBadge status={article.status} />
          <Button href={`/admin/articles/${article.id}/edit`} variant="secondary">
            Edit Article
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-cream-200 bg-white">
        <section className="border-b border-cream-200 bg-cream-50 px-6 py-12 sm:px-10 sm:py-16">
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            <Badge variant="outline">{article.category || "Uncategorized"}</Badge>
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl">
              {article.title || "Untitled Article"}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-600">
              <span>{article.author || "Unknown author"}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>
              {article.readingTime && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{article.readingTime}</span>
                </>
              )}
            </div>
          </div>
        </section>

        <div className="px-6 py-12 sm:px-10 sm:py-16">
          <div className="mx-auto max-w-3xl">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-cream-100">
              {article.image ? (
                <Image
                  src={article.image}
                  alt={`Illustration placeholder for ${article.title}`}
                  fill
                  sizes="(min-width: 1024px) 768px, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-400">
                  No featured image set
                </div>
              )}
            </div>

            <p className="mt-6 text-xs italic text-muted-400">
              This content is fictional demo content and is not legal advice.
            </p>

            <div className="mt-6">
              <ArticleContentBlocks content={article.content} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

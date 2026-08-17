/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import SearchBar from "@/components/admin/SearchBar";
import FilterSelect from "@/components/admin/FilterSelect";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { PencilIcon, TrashIcon, EyeIcon, PlusIcon, DocumentIcon } from "@/components/ui/icons";
import { getArticles, deleteArticle, getCategoryOptions } from "@/lib/admin/articles";

const SORT_OPTIONS = [
  { value: "updated", label: "Recently Updated" },
  { value: "published", label: "Recently Published" },
  { value: "title", label: "Title A–Z" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("updated");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const categoryOptions = useMemo(
    () => [{ value: "", label: "All Categories" }, ...getCategoryOptions()],
    []
  );

  async function loadArticles() {
    setLoading(true);
    setLoadError(false);
    try {
      const results = await getArticles({ search, category, status, sort });
      setArticles(results);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, status, sort]);

  const hasActiveFilters = Boolean(search || category || status || sort !== "updated");

  function resetFilters() {
    setSearch("");
    setCategory("");
    setStatus("");
    setSort("updated");
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteArticle(deleteTarget.id);
      setDeleteTarget(null);
      await loadArticles();
    } catch (err) {
      setDeleteError(err.message || "Unable to delete this article.");
    } finally {
      setDeleting(false);
    }
  }

  const columns = [
    {
      key: "article",
      header: "Article",
      render: (article) => (
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-cream-100">
            {article.image ? (
              <Image src={article.image} alt="" fill sizes="64px" className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-300">
                <DocumentIcon className="h-4 w-4" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-navy-900">{article.title}</p>
            <p className="truncate text-xs text-muted-400">{article.author}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (article) => <span className="text-sm text-muted-600">{article.category}</span>,
    },
    { key: "status", header: "Status", render: (article) => <StatusBadge status={article.status} /> },
    {
      key: "publishedAt",
      header: "Published",
      render: (article) => <span className="text-sm text-muted-400">{formatDate(article.publishedAt)}</span>,
    },
    {
      key: "readingTime",
      header: "Reading Time",
      render: (article) => <span className="text-sm text-muted-600">{article.readingTime}</span>,
    },
    {
      key: "updatedAt",
      header: "Last Updated",
      render: (article) => <span className="text-sm text-muted-400">{formatDate(article.updatedAt)}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      render: (article) => (
        <div className="flex items-center gap-1">
          {article.status === "published" && (
            <Link
              href={`/articles/${article.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${article.title} on the public site`}
              className="rounded-md p-2 text-muted-600 hover:bg-navy-900/5 hover:text-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
            >
              <EyeIcon className="h-4 w-4" />
            </Link>
          )}
          <Link
            href={`/admin/articles/${article.id}/preview`}
            aria-label={`Preview ${article.title}`}
            className="rounded-md px-2 py-1.5 text-xs font-medium text-navy-800 hover:bg-navy-900/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
          >
            Preview
          </Link>
          <Link
            href={`/admin/articles/${article.id}/edit`}
            aria-label={`Edit ${article.title}`}
            className="rounded-md p-2 text-muted-600 hover:bg-navy-900/5 hover:text-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
          >
            <PencilIcon className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => setDeleteTarget(article)}
            aria-label={`Delete ${article.title}`}
            className="rounded-md p-2 text-muted-600 hover:bg-red-50 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Articles"
        description="Create, edit, and publish the articles shown on the public site."
        action={
          <Button href="/admin/articles/new" variant="primary">
            <PlusIcon className="h-4 w-4" />
            Add Article
          </Button>
        }
      />

      <div className="rounded-lg border border-cream-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end">
          <SearchBar
            id="article-search"
            label="Search articles"
            value={search}
            onChange={setSearch}
            placeholder="Search by title or author..."
            className="flex-1 lg:min-w-[220px]"
          />
          <FilterSelect id="article-category" label="Category" value={category} onChange={setCategory} options={categoryOptions} className="lg:w-52" />
          <FilterSelect id="article-status" label="Status" value={status} onChange={setStatus} options={STATUS_OPTIONS} className="lg:w-40" />
          <FilterSelect id="article-sort" label="Sort By" value={sort} onChange={setSort} options={SORT_OPTIONS} className="lg:w-48" />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-cream-200 pt-4">
          <p aria-live="polite" className="text-sm text-muted-600">
            {loading ? "Loading..." : `${articles.length} article${articles.length === 1 ? "" : "s"} found`}
          </p>
          {hasActiveFilters && (
            <Button type="button" variant="ghost" onClick={resetFilters}>
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="rounded-lg border border-cream-200 bg-white p-16 text-center text-sm text-muted-600">
          Loading articles...
        </div>
      ) : loadError ? (
        <EmptyState
          title="Unable to load articles"
          description="Something went wrong while loading your articles."
          action={
            <Button type="button" variant="secondary" onClick={loadArticles}>
              Try Again
            </Button>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          rows={articles}
          getRowKey={(article) => article.id}
          emptyState={
            hasActiveFilters ? (
              <EmptyState
                title="No articles matched your search"
                description="Try adjusting or resetting your filters to see more results."
                action={
                  <Button type="button" variant="secondary" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                }
              />
            ) : (
              <EmptyState
                title="No Articles"
                description="Create your first article to start publishing content."
                action={
                  <Button href="/admin/articles/new" variant="primary">
                    <PlusIcon className="h-4 w-4" /> Add Article
                  </Button>
                }
              />
            )
          }
          renderMobileCard={(article) => (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-cream-100">
                  {article.image ? (
                    <Image src={article.image} alt="" fill sizes="64px" className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-300">
                      <DocumentIcon className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-navy-900">{article.title}</p>
                  <p className="truncate text-xs text-muted-400">{article.category}</p>
                </div>
                <StatusBadge status={article.status} />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-400">
                <span>Published {formatDate(article.publishedAt)}</span>
                <span>{article.readingTime}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 border-t border-cream-200 pt-3">
                {article.status === "published" && (
                  <Link
                    href={`/articles/${article.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-navy-800 hover:bg-navy-900/5"
                  >
                    <EyeIcon className="h-3.5 w-3.5" /> View
                  </Link>
                )}
                <Link
                  href={`/admin/articles/${article.id}/preview`}
                  className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-navy-800 hover:bg-navy-900/5"
                >
                  Preview
                </Link>
                <Link
                  href={`/admin/articles/${article.id}/edit`}
                  className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-navy-800 hover:bg-navy-900/5"
                >
                  <PencilIcon className="h-3.5 w-3.5" /> Edit
                </Link>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(article)}
                  className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <TrashIcon className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          )}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Article?"
        description={
          deleteTarget
            ? `This will remove "${deleteTarget.title}" from the content management system. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete Article"
        loading={deleting}
        error={deleteError}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteTarget(null);
          setDeleteError("");
        }}
      />
    </div>
  );
}

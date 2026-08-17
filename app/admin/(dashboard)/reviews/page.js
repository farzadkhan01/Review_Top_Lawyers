/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import SearchBar from "@/components/admin/SearchBar";
import FilterSelect from "@/components/admin/FilterSelect";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { StarIcon, CheckIcon, EyeOffIcon, TrashIcon } from "@/components/ui/icons";
import { getReviews, updateReviewStatus, deleteReview } from "@/lib/admin/reviews";
import lawyers from "@/data/lawyers";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "published", label: "Published" },
  { value: "pending", label: "Pending" },
  { value: "hidden", label: "Hidden" },
];

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [lawyerId, setLawyerId] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const lawyerOptions = useMemo(
    () => [{ value: "", label: "All Lawyers" }, ...lawyers.map((lawyer) => ({ value: lawyer.slug, label: lawyer.name }))],
    []
  );

  async function load() {
    setLoading(true);
    const results = await getReviews({ search, status, lawyerId });
    setReviews(results);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, lawyerId]);

  const hasActiveFilters = Boolean(search || status || lawyerId);

  function resetFilters() {
    setSearch("");
    setStatus("");
    setLawyerId("");
  }

  async function handleStatusChange(id, nextStatus) {
    await updateReviewStatus(id, nextStatus);
    await load();
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteReview(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setDeleteError(err.message || "Unable to delete this review.");
    } finally {
      setDeleting(false);
    }
  }

  function ReviewActions({ review }) {
    return (
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setExpandedId(expandedId === review.id ? null : review.id)}
          aria-expanded={expandedId === review.id}
          className="rounded-md px-2 py-1.5 text-xs font-medium text-navy-800 hover:bg-navy-900/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
        >
          {expandedId === review.id ? "Hide" : "View"}
        </button>
        {review.status !== "published" && (
          <button
            type="button"
            onClick={() => handleStatusChange(review.id, "published")}
            aria-label={`Approve review from ${review.reviewerName}`}
            className="rounded-md p-2 text-muted-600 hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
          >
            <CheckIcon className="h-4 w-4" />
          </button>
        )}
        {review.status !== "hidden" && (
          <button
            type="button"
            onClick={() => handleStatusChange(review.id, "hidden")}
            aria-label={`Hide review from ${review.reviewerName}`}
            className="rounded-md p-2 text-muted-600 hover:bg-navy-900/5 hover:text-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
          >
            <EyeOffIcon className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          onClick={() => setDeleteTarget(review)}
          aria-label={`Delete review from ${review.reviewerName}`}
          className="rounded-md p-2 text-muted-600 hover:bg-red-50 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    );
  }

  const columns = [
    {
      key: "reviewer",
      header: "Reviewer",
      render: (review) => <span className="font-medium text-navy-900">{review.reviewerName}</span>,
    },
    {
      key: "lawyer",
      header: "Lawyer",
      render: (review) => <span className="text-sm text-muted-600">{review.lawyerName}</span>,
    },
    {
      key: "rating",
      header: "Rating",
      render: (review) => (
        <span className="inline-flex items-center gap-1 text-sm text-muted-600">
          <StarIcon className="h-3.5 w-3.5 text-gold-500" />
          {review.rating.toFixed(1)}
        </span>
      ),
    },
    {
      key: "text",
      header: "Review",
      render: (review) => (
        <p className={expandedId === review.id ? "max-w-sm text-sm text-muted-600" : "line-clamp-1 max-w-sm text-sm text-muted-600"}>
          {review.text}
        </p>
      ),
    },
    { key: "date", header: "Date", render: (review) => <span className="text-sm text-muted-400">{formatDate(review.date)}</span> },
    { key: "status", header: "Status", render: (review) => <StatusBadge status={review.status} /> },
    { key: "actions", header: "Actions", render: (review) => <ReviewActions review={review} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Reviews" description="Moderate reviews submitted across every lawyer profile." />

      <div className="rounded-lg border border-cream-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end">
          <SearchBar
            id="review-search"
            label="Search reviews"
            value={search}
            onChange={setSearch}
            placeholder="Search by reviewer, lawyer, or text..."
            className="flex-1 lg:min-w-[220px]"
          />
          <FilterSelect id="review-lawyer" label="Lawyer" value={lawyerId} onChange={setLawyerId} options={lawyerOptions} className="lg:w-52" />
          <FilterSelect id="review-status" label="Status" value={status} onChange={setStatus} options={STATUS_OPTIONS} className="lg:w-44" />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-cream-200 pt-4">
          <p aria-live="polite" className="text-sm text-muted-600">
            {loading ? "Loading..." : `${reviews.length} review${reviews.length === 1 ? "" : "s"} found`}
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
          Loading reviews...
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={reviews}
          getRowKey={(review) => review.id}
          emptyState={
            <EmptyState
              title="No reviews matched your search"
              description="Try adjusting or resetting your filters."
              action={
                <Button type="button" variant="secondary" onClick={resetFilters}>
                  Reset Filters
                </Button>
              }
            />
          }
          renderMobileCard={(review) => (
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-navy-900">{review.reviewerName}</p>
                  <p className="text-xs text-muted-400">{review.lawyerName}</p>
                </div>
                <StatusBadge status={review.status} />
              </div>
              <span className="inline-flex items-center gap-1 text-sm text-muted-600">
                <StarIcon className="h-3.5 w-3.5 text-gold-500" />
                {review.rating.toFixed(1)}
                <span className="ml-2 text-xs text-muted-400">{formatDate(review.date)}</span>
              </span>
              <p className="text-sm text-muted-600">{review.text}</p>
              <div className="flex flex-wrap items-center gap-2 border-t border-cream-200 pt-3">
                {review.status !== "published" && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(review.id, "published")}
                    className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                  >
                    <CheckIcon className="h-3.5 w-3.5" /> Approve
                  </button>
                )}
                {review.status !== "hidden" && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(review.id, "hidden")}
                    className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-navy-800 hover:bg-navy-900/5"
                  >
                    <EyeOffIcon className="h-3.5 w-3.5" /> Hide
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setDeleteTarget(review)}
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
        title="Delete Review?"
        description={
          deleteTarget
            ? `This permanently removes the review from ${deleteTarget.reviewerName} for ${deleteTarget.lawyerName}.`
            : ""
        }
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

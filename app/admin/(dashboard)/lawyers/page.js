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
import { PencilIcon, TrashIcon, EyeIcon, PlusIcon, StarIcon } from "@/components/ui/icons";
import {
  getLawyers,
  deleteLawyer,
  getPracticeAreaOptions,
  getLocationOptions,
} from "@/lib/admin/lawyers";

const SORT_OPTIONS = [
  { value: "updated", label: "Recently Updated" },
  { value: "name", label: "Name A–Z" },
  { value: "rating", label: "Highest Rated" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export default function AdminLawyersPage() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [practiceArea, setPracticeArea] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("updated");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const practiceAreaOptions = useMemo(
    () => [{ value: "", label: "All Practice Areas" }, ...getPracticeAreaOptions()],
    []
  );
  const locationOptions = useMemo(
    () => [{ value: "", label: "All Locations" }, ...getLocationOptions().map((loc) => ({ value: loc, label: loc }))],
    []
  );

  async function loadLawyers() {
    setLoading(true);
    const results = await getLawyers({ search, practiceArea, status, location, sort });
    setLawyers(results);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadLawyers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, practiceArea, status, location, sort]);

  const hasActiveFilters = Boolean(search || practiceArea || status || location || sort !== "updated");

  function resetFilters() {
    setSearch("");
    setPracticeArea("");
    setStatus("");
    setLocation("");
    setSort("updated");
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteLawyer(deleteTarget.id);
      setDeleteTarget(null);
      await loadLawyers();
    } catch (err) {
      setDeleteError(err.message || "Unable to delete this lawyer.");
    } finally {
      setDeleting(false);
    }
  }

  const columns = [
    {
      key: "lawyer",
      header: "Lawyer",
      render: (lawyer) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-cream-100">
            <Image src={lawyer.image} alt="" fill sizes="40px" className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-navy-900">{lawyer.name}</p>
            <p className="truncate text-xs text-muted-400">{lawyer.title}</p>
          </div>
        </div>
      ),
    },
    {
      key: "practiceAreas",
      header: "Practice Area",
      render: (lawyer) => (
        <span className="text-sm text-muted-600">
          {getPracticeAreaOptions().find((option) => lawyer.practiceAreas.includes(option.value))?.label ?? "—"}
        </span>
      ),
    },
    { key: "location", header: "Location", render: (lawyer) => <span className="text-sm text-muted-600">{lawyer.location}</span> },
    {
      key: "rating",
      header: "Rating",
      render: (lawyer) => (
        <span className="inline-flex items-center gap-1 text-sm text-muted-600">
          <StarIcon className="h-3.5 w-3.5 text-gold-500" />
          {lawyer.rating.toFixed(1)}
        </span>
      ),
    },
    { key: "reviewCount", header: "Reviews", render: (lawyer) => <span className="text-sm text-muted-600">{lawyer.reviewCount}</span> },
    { key: "status", header: "Status", render: (lawyer) => <StatusBadge status={lawyer.status} /> },
    {
      key: "updatedAt",
      header: "Last Updated",
      render: (lawyer) => (
        <span className="text-sm text-muted-400">
          {new Date(lawyer.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (lawyer) => (
        <div className="flex items-center gap-1">
          <Link
            href={`/lawyers/${lawyer.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${lawyer.name}'s public profile`}
            className="rounded-md p-2 text-muted-600 hover:bg-navy-900/5 hover:text-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
          >
            <EyeIcon className="h-4 w-4" />
          </Link>
          <Link
            href={`/admin/lawyers/${lawyer.id}/edit`}
            aria-label={`Edit ${lawyer.name}`}
            className="rounded-md p-2 text-muted-600 hover:bg-navy-900/5 hover:text-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
          >
            <PencilIcon className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => setDeleteTarget(lawyer)}
            aria-label={`Delete ${lawyer.name}`}
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
        title="Lawyers"
        description="Manage every lawyer profile shown across the public directory."
        action={
          <Button href="/admin/lawyers/new" variant="primary">
            <PlusIcon className="h-4 w-4" />
            Add Lawyer
          </Button>
        }
      />

      <div className="rounded-lg border border-cream-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end">
          <SearchBar
            id="lawyer-search"
            label="Search lawyers"
            value={search}
            onChange={setSearch}
            placeholder="Search by name, title, or location..."
            className="flex-1 lg:min-w-[220px]"
          />
          <FilterSelect id="lawyer-practice-area" label="Practice Area" value={practiceArea} onChange={setPracticeArea} options={practiceAreaOptions} className="lg:w-48" />
          <FilterSelect id="lawyer-location" label="Location" value={location} onChange={setLocation} options={locationOptions} className="lg:w-44" />
          <FilterSelect id="lawyer-status" label="Status" value={status} onChange={setStatus} options={STATUS_OPTIONS} className="lg:w-40" />
          <FilterSelect id="lawyer-sort" label="Sort By" value={sort} onChange={setSort} options={SORT_OPTIONS} className="lg:w-48" />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-cream-200 pt-4">
          <p aria-live="polite" className="text-sm text-muted-600">
            {loading ? "Loading..." : `${lawyers.length} lawyer${lawyers.length === 1 ? "" : "s"} found`}
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
          Loading lawyers...
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={lawyers}
          getRowKey={(lawyer) => lawyer.id}
          emptyState={
            <EmptyState
              title="No lawyers matched your search"
              description="Try adjusting or resetting your filters to see more results."
              action={
                <Button type="button" variant="secondary" onClick={resetFilters}>
                  Reset Filters
                </Button>
              }
            />
          }
          renderMobileCard={(lawyer) => (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-cream-100">
                  <Image src={lawyer.image} alt="" fill sizes="48px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-navy-900">{lawyer.name}</p>
                  <p className="truncate text-xs text-muted-400">{lawyer.location}</p>
                </div>
                <StatusBadge status={lawyer.status} />
              </div>
              <div className="flex items-center justify-between text-sm text-muted-600">
                <span className="inline-flex items-center gap-1">
                  <StarIcon className="h-3.5 w-3.5 text-gold-500" />
                  {lawyer.rating.toFixed(1)} ({lawyer.reviewCount})
                </span>
                <span className="text-xs text-muted-400">
                  Updated {new Date(lawyer.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
              <div className="flex items-center gap-2 border-t border-cream-200 pt-3">
                <Link
                  href={`/lawyers/${lawyer.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-navy-800 hover:bg-navy-900/5"
                >
                  <EyeIcon className="h-3.5 w-3.5" /> View
                </Link>
                <Link
                  href={`/admin/lawyers/${lawyer.id}/edit`}
                  className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-navy-800 hover:bg-navy-900/5"
                >
                  <PencilIcon className="h-3.5 w-3.5" /> Edit
                </Link>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(lawyer)}
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
        title="Delete Lawyer?"
        description={
          deleteTarget
            ? `This removes "${deleteTarget.name}" from the public directory and their profile page. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
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

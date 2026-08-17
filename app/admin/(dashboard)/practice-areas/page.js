/** @format */

"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import SearchBar from "@/components/admin/SearchBar";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import PracticeAreaDialog from "@/components/admin/practice-areas/PracticeAreaDialog";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { PencilIcon, TrashIcon, PlusIcon } from "@/components/ui/icons";
import {
  getPracticeAreas,
  createPracticeArea,
  updatePracticeArea,
  deletePracticeArea,
} from "@/lib/admin/practiceAreas";

export default function AdminPracticeAreasPage() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogState, setDialogState] = useState({ open: false, area: null });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  async function load() {
    setLoading(true);
    const results = await getPracticeAreas({ search });
    setAreas(results);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  async function handleSubmit(values) {
    if (dialogState.area) {
      await updatePracticeArea(dialogState.area.id, values);
    } else {
      await createPracticeArea(values);
    }
    setDialogState({ open: false, area: null });
    await load();
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await deletePracticeArea(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setDeleteError(err.message || "Unable to delete this practice area.");
    } finally {
      setDeleting(false);
    }
  }

  const columns = [
    {
      key: "name",
      header: "Practice Area",
      render: (area) => (
        <div>
          <p className="font-medium text-navy-900">{area.name}</p>
          <p className="mt-0.5 line-clamp-1 text-xs text-muted-400">{area.description}</p>
        </div>
      ),
    },
    {
      key: "lawyerCount",
      header: "Lawyers",
      render: (area) => <span className="text-sm text-muted-600">{area.lawyerCount}</span>,
    },
    { key: "status", header: "Status", render: (area) => <StatusBadge status={area.status} /> },
    {
      key: "actions",
      header: "Actions",
      render: (area) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setDialogState({ open: true, area })}
            aria-label={`Edit ${area.name}`}
            className="rounded-md p-2 text-muted-600 hover:bg-navy-900/5 hover:text-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(area)}
            aria-label={`Delete ${area.name}`}
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
        title="Practice Areas"
        description="Manage the practice areas lawyers can be associated with."
        action={
          <Button
            type="button"
            variant="primary"
            onClick={() => setDialogState({ open: true, area: null })}
          >
            <PlusIcon className="h-4 w-4" /> Add Practice Area
          </Button>
        }
      />

      <div className="rounded-lg border border-cream-200 bg-white p-4 sm:p-5">
        <SearchBar
          id="practice-area-search"
          label="Search practice areas"
          value={search}
          onChange={setSearch}
          placeholder="Search practice areas..."
        />
        <p aria-live="polite" className="mt-3 text-sm text-muted-600">
          {loading ? "Loading..." : `${areas.length} practice area${areas.length === 1 ? "" : "s"} found`}
        </p>
      </div>

      {loading ? (
        <div className="rounded-lg border border-cream-200 bg-white p-16 text-center text-sm text-muted-600">
          Loading practice areas...
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={areas}
          getRowKey={(area) => area.id}
          emptyState={
            <EmptyState
              title="No practice areas found"
              description="Try a different search, or add a new practice area."
              action={
                <Button type="button" variant="secondary" onClick={() => setSearch("")}>
                  Clear Search
                </Button>
              }
            />
          }
          renderMobileCard={(area) => (
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-navy-900">{area.name}</p>
                  <p className="mt-0.5 text-xs text-muted-400">{area.lawyerCount} lawyers</p>
                </div>
                <StatusBadge status={area.status} />
              </div>
              <p className="line-clamp-2 text-sm text-muted-600">{area.description}</p>
              <div className="flex items-center gap-2 border-t border-cream-200 pt-3">
                <button
                  type="button"
                  onClick={() => setDialogState({ open: true, area })}
                  className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-navy-800 hover:bg-navy-900/5"
                >
                  <PencilIcon className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(area)}
                  className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <TrashIcon className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          )}
        />
      )}

      <PracticeAreaDialog
        open={dialogState.open}
        initialValues={dialogState.area}
        onSubmit={handleSubmit}
        onClose={() => setDialogState({ open: false, area: null })}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Practice Area?"
        description={
          deleteTarget
            ? `This removes "${deleteTarget.name}" and unlinks it from any lawyers currently assigned to it.`
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

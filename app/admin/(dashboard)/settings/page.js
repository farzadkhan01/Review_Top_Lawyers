/** @format */

"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import FormField from "@/components/admin/FormField";
import ImageUploader from "@/components/admin/ImageUploader";
import Button from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/icons";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { cn } from "@/lib/utils";

function useSectionSave() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    setSaved(false);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setSaving(false);
    setSaved(true);
  }

  return { saving, saved, save };
}

function SettingsSection({ title, description, children, onSave, saving, saved }) {
  return (
    <section className="rounded-lg border border-cream-200 bg-white p-6 sm:p-8">
      <h2 className="font-heading text-lg font-semibold text-navy-900">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted-600">{description}</p>}
      <div className="mt-6 flex flex-col gap-5">{children}</div>
      <div className="mt-6 flex items-center gap-3 border-t border-cream-200 pt-6">
        <Button type="button" variant="primary" onClick={onSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700">
            <CheckIcon className="h-4 w-4" /> Saved for this session
          </span>
        )}
      </div>
    </section>
  );
}

const NOTIFICATION_ITEMS = [
  { key: "newReview", label: "New review submitted" },
  { key: "newLawyer", label: "New lawyer profile created" },
  { key: "weeklySummary", label: "Weekly summary email" },
];

const THEME_OPTIONS = ["light", "dark", "system"];

export default function AdminSettingsPage() {
  const [account, setAccount] = useState({ name: "", email: "", avatar: "", role: "", lastLogin: "" });
  const accountSave = useSectionSave();

  const [security, setSecurity] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const securitySave = useSectionSave();

  const [notifications, setNotifications] = useState({
    newReview: true,
    newLawyer: true,
    weeklySummary: false,
  });
  const notificationsSave = useSectionSave();

  const [theme, setTheme] = useState("light");

  useEffect(() => {
    getCurrentAdmin().then((admin) => {
      if (admin) {
        setAccount({
          name: admin.name,
          email: admin.email,
          avatar: admin.avatar ?? "",
          role: admin.role ?? "Administrator",
          lastLogin: new Date().toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          }),
        });
      }
    });
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Settings" description="Manage your admin account and preferences." />

      <p className="rounded-md bg-gold-500/10 px-4 py-3 text-sm text-gold-700">
        These settings are for preview purposes only. Changes are not persisted once a real backend is connected.
      </p>

      <SettingsSection
        title="Account"
        description="Your admin profile information."
        onSave={accountSave.save}
        saving={accountSave.saving}
        saved={accountSave.saved}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label="Name"
            name="account-name"
            value={account.name}
            onChange={(event) => setAccount((prev) => ({ ...prev, name: event.target.value }))}
          />
          <FormField
            label="Email"
            name="account-email"
            type="email"
            value={account.email}
            onChange={(event) => setAccount((prev) => ({ ...prev, email: event.target.value }))}
          />
        </div>
        <ImageUploader
          label="Avatar"
          value={account.avatar}
          onChange={(url) => setAccount((prev) => ({ ...prev, avatar: url }))}
        />
        <div className="grid gap-5 rounded-md bg-cream-50 p-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-400">Role</p>
            <p className="mt-1 text-sm font-medium text-navy-900">{account.role || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-400">Last Login</p>
            <p className="mt-1 text-sm font-medium text-navy-900">{account.lastLogin || "—"}</p>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Security"
        description="Update your password."
        onSave={securitySave.save}
        saving={securitySave.saving}
        saved={securitySave.saved}
      >
        <FormField
          label="Current Password"
          name="current-password"
          type="password"
          value={security.currentPassword}
          onChange={(event) => setSecurity((prev) => ({ ...prev, currentPassword: event.target.value }))}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label="New Password"
            name="new-password"
            type="password"
            value={security.newPassword}
            onChange={(event) => setSecurity((prev) => ({ ...prev, newPassword: event.target.value }))}
          />
          <FormField
            label="Confirm New Password"
            name="confirm-password"
            type="password"
            value={security.confirmPassword}
            onChange={(event) => setSecurity((prev) => ({ ...prev, confirmPassword: event.target.value }))}
          />
        </div>
        <p className="text-xs text-muted-400">
          Password changes will take effect once account security is handled by the backend.
        </p>
      </SettingsSection>

      <SettingsSection
        title="Notifications"
        description="Choose which email notifications you receive."
        onSave={notificationsSave.save}
        saving={notificationsSave.saving}
        saved={notificationsSave.saved}
      >
        {NOTIFICATION_ITEMS.map((item) => (
          <label key={item.key} className="flex items-center gap-2 text-sm text-navy-800">
            <input
              type="checkbox"
              checked={notifications[item.key]}
              onChange={(event) =>
                setNotifications((prev) => ({ ...prev, [item.key]: event.target.checked }))
              }
              className="h-4 w-4 rounded border-navy-900/25 text-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
            />
            {item.label}
          </label>
        ))}
      </SettingsSection>

      <section className="rounded-lg border border-cream-200 bg-white p-6 sm:p-8">
        <h2 className="font-heading text-lg font-semibold text-navy-900">Appearance</h2>
        <p className="mt-1 text-sm text-muted-600">Theme preference for the admin portal.</p>
        <div className="mt-6 flex gap-3">
          {THEME_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setTheme(option)}
              aria-pressed={theme === option}
              className={cn(
                "rounded-md border px-4 py-2 text-sm font-medium capitalize focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600",
                theme === option
                  ? "border-navy-900 bg-navy-900 text-cream-50"
                  : "border-navy-900/15 text-navy-800 hover:bg-navy-900/5"
              )}
            >
              {option}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-400">
          Dark mode is not yet available across the admin portal. This preference is saved for when it launches.
        </p>
      </section>
    </div>
  );
}

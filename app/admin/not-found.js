/** @format */

import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream-100 px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-gold-700">404</p>
      <h1 className="font-heading text-3xl font-semibold text-navy-900">Page not found</h1>
      <p className="max-w-md text-sm leading-relaxed text-muted-600">
        The admin page you are looking for does not exist or may have been moved.
      </p>
      <Link
        href="/admin/dashboard"
        className="rounded-md bg-navy-900 px-5 py-2.5 text-sm font-medium text-cream-50 hover:bg-navy-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}

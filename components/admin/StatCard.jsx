/** @format */

export default function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <div className="rounded-lg border border-cream-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-600">{label}</p>
        {Icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-900/5 text-navy-800">
            <Icon className="h-4.5 w-4.5" />
          </span>
        )}
      </div>
      <p className="mt-3 font-heading text-3xl font-semibold text-navy-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-400">{hint}</p>}
    </div>
  );
}

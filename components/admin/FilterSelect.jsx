/** @format */

export default function FilterSelect({ id, label, value, onChange, options, className }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-600">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-navy-900/15 bg-white px-3 py-2.5 text-sm text-navy-900 focus:border-navy-900/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-600"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

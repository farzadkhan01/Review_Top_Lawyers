/** @format */

import { SearchIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export default function SearchBar({ value, onChange, placeholder = "Search...", label, id, className }) {
  return (
    <div className={cn("relative", className)}>
      <label htmlFor={id} className="sr-only">
        {label ?? placeholder}
      </label>
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-400" />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-navy-900/15 bg-white py-2.5 pl-9 pr-3 text-sm text-navy-900 focus:border-navy-900/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-600"
      />
    </div>
  );
}

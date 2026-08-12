import { SearchIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * Global search field. Submits a native GET request to /directory, which
 * reads the "q" param and initializes the directory's search/filter state.
 * No JavaScript required — works the same in Header and MobileNavigation.
 */
export default function SearchField({ className, id = "site-search" }) {
  return (
    <form
      action="/directory"
      method="GET"
      role="search"
      className={cn("relative w-full", className)}
    >
      <label htmlFor={id} className="sr-only">
        Search lawyers, practice areas, or locations
      </label>
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-400" />
      <input
        id={id}
        type="search"
        name="q"
        placeholder="Search lawyers, practice areas..."
        className="w-full rounded-md border border-navy-900/15 bg-white py-2.5 pl-10 pr-4 text-sm text-navy-900 placeholder:text-muted-400 focus:border-navy-900/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-600"
      />
      <button type="submit" className="sr-only">
        Search
      </button>
    </form>
  );
}

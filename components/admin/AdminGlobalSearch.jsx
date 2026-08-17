/** @format */

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon, UsersIcon, DocumentIcon, ScaleIcon } from "@/components/ui/icons";
import { getLawyers } from "@/lib/admin/lawyers";
import { getArticles } from "@/lib/admin/articles";
import { getPracticeAreas } from "@/lib/admin/practiceAreas";

const EMPTY_RESULTS = { lawyers: [], articles: [], practiceAreas: [] };

function ResultGroup({ icon: Icon, label, children }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-400">
        <Icon className="h-3.5 w-3.5" /> {label}
      </p>
      <ul className="flex flex-col gap-0.5">{children}</ul>
    </div>
  );
}

function ResultItem({ label, sublabel, onClick }) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="flex w-full flex-col rounded-md px-2 py-1.5 text-left hover:bg-cream-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
      >
        <span className="truncate text-sm font-medium text-navy-900">{label}</span>
        {sublabel && <span className="truncate text-xs text-muted-400">{sublabel}</span>}
      </button>
    </li>
  );
}

export default function AdminGlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState(EMPTY_RESULTS);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults(EMPTY_RESULTS);
      setLoading(false);
      return undefined;
    }

    let isCurrent = true;
    setLoading(true);

    Promise.all([
      getLawyers({ search: query }),
      getArticles({ search: query }),
      getPracticeAreas({ search: query }),
    ]).then(([lawyers, articles, practiceAreas]) => {
      if (!isCurrent) return;
      setResults({
        lawyers: lawyers.slice(0, 4),
        articles: articles.slice(0, 4),
        practiceAreas: practiceAreas.slice(0, 4),
      });
      setLoading(false);
    });

    return () => {
      isCurrent = false;
    };
  }, [query]);

  useEffect(() => {
    if (!open) return undefined;

    function handleClick(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) setOpen(false);
    }
    function handleKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function goTo(href) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  const hasResults = results.lawyers.length || results.articles.length || results.practiceAreas.length;
  const showPanel = open && query.trim().length > 0;

  return (
    <div className="relative w-full max-w-sm" ref={containerRef}>
      <label htmlFor="admin-global-search" className="sr-only">
        Search lawyers, articles, and practice areas
      </label>
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-400" />
      <input
        id="admin-global-search"
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search lawyers, articles, practice areas..."
        role="combobox"
        aria-expanded={showPanel}
        aria-controls="admin-global-search-results"
        autoComplete="off"
        className="w-full rounded-md border border-navy-900/15 bg-cream-50 py-2 pl-9 pr-3 text-sm text-navy-900 focus:border-navy-900/40 focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-600"
      />

      {showPanel && (
        <div
          id="admin-global-search-results"
          role="listbox"
          aria-label="Search results"
          className="absolute left-0 right-0 z-30 mt-2 max-h-96 overflow-y-auto rounded-lg border border-cream-200 bg-white p-2 shadow-xl"
        >
          {loading ? (
            <p className="px-2 py-4 text-sm text-muted-600">Searching...</p>
          ) : !hasResults ? (
            <p className="px-2 py-4 text-sm text-muted-600">No results for &ldquo;{query}&rdquo;.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {results.lawyers.length > 0 && (
                <ResultGroup icon={UsersIcon} label="Lawyers">
                  {results.lawyers.map((lawyer) => (
                    <ResultItem
                      key={lawyer.id}
                      label={lawyer.name}
                      sublabel={lawyer.location}
                      onClick={() => goTo(`/admin/lawyers/${lawyer.id}/edit`)}
                    />
                  ))}
                </ResultGroup>
              )}
              {results.articles.length > 0 && (
                <ResultGroup icon={DocumentIcon} label="Articles">
                  {results.articles.map((article) => (
                    <ResultItem
                      key={article.id}
                      label={article.title}
                      sublabel={article.category}
                      onClick={() => goTo(`/admin/articles/${article.id}/edit`)}
                    />
                  ))}
                </ResultGroup>
              )}
              {results.practiceAreas.length > 0 && (
                <ResultGroup icon={ScaleIcon} label="Practice Areas">
                  {results.practiceAreas.map((area) => (
                    <ResultItem
                      key={area.id}
                      label={area.name}
                      sublabel={`${area.lawyerCount} lawyers`}
                      onClick={() => goTo("/admin/practice-areas")}
                    />
                  ))}
                </ResultGroup>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

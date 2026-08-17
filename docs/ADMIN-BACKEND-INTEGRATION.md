<!-- @format -->

# Admin Backend Integration

This document describes what the admin frontend expects from a real backend.
It does not prescribe database design, API shape, or hosting. Everything
described below is currently implemented as an in-memory mock in `lib/admin/`
— replace the internals of these functions with real calls and the UI does
not need to change.

The site is built with `output: "export"` (fully static). Dynamic detail
routes (`/admin/lawyers/[id]/edit`, `/admin/articles/[id]/edit`,
`/admin/articles/[id]/preview`) are pre-rendered from the demo data files at
build time via `generateStaticParams`. Records created at runtime through the
mock store exist only in memory for the current browser session — their
detail routes are not pre-rendered and will 404 if navigated to directly.
Introducing a real backend will likely also mean moving off static export (or
regenerating the static build after content changes) so new records get
their own routes.

---

## Authentication

File: `lib/admin/auth.js`

- `getCurrentAdmin()` — resolves the signed-in admin, or `null`. Called on
  every protected page load (see `app/admin/(dashboard)/layout.js`) to decide
  whether to redirect to `/admin/login`.
- `login({ email, password, remember })` — resolves the admin on success, or
  throws an `Error` with a user-facing `message`.
- `logout()` — clears the session.

The frontend has no notion of tokens, cookies, or session storage beyond
calling these three functions. Replace the internals with real session
handling (cookies, JWT, etc.) — the UI only needs the function contract to
stay the same. `/admin/*` routes are not otherwise protected; there is no
middleware gate. Real authorization (who can reach `/admin` at all) must be
enforced server-side once a backend exists.

---

## Lawyers

File: `lib/admin/lawyers.js`

```
getLawyers({ search, practiceArea, status, location, sort }) -> Lawyer[]
getLawyer(id) -> Lawyer | null
createLawyer(data) -> Lawyer
updateLawyer(id, data) -> Lawyer   // throws if not found
deleteLawyer(id) -> { success: true }
getPracticeAreaOptions() -> { value, label }[]
getLocationOptions() -> string[]
```

See `data/lawyers.js` and `DATA.md` for the full `Lawyer` field list. The
admin form additionally tracks `status` (`active`/`inactive`), `featured`,
`isPublic`, `seoTitle`, `seoDescription`, and `updatedAt`.

---

## Articles

File: `lib/admin/articles.js`

```
getArticles({ search, category, status, sort }) -> Article[]
getArticle(id) -> Article | null
createArticle(data) -> Article
updateArticle(id, data) -> Article   // throws if not found
deleteArticle(id) -> { success: true }
getCategoryOptions() -> { value, label }[]   // sourced from practice areas
```

`Article` fields: `id`, `slug`, `title`, `excerpt`, `content`, `category`,
`author`, `status` (`draft`/`published`), `publishedAt`, `image`,
`readingTime`, `seoTitle`, `seoDescription`, `createdAt`, `updatedAt`.

`content` is a plain string using a small markdown-lite syntax (`## heading`,
`- list item`, `**bold**`, `[label](url)`) written and rendered by
`lib/admin/articleContent.js`. This keeps the editor swappable — a backend
developer can plug in a real rich-text/WYSIWYG editor and storage format
later without changing anything else, as long as `content` remains a string
the parser (or its replacement) can render.

`readingTime` is currently computed client-side from `content` word count. A
backend may prefer to compute and store this server-side instead.

---

## Reviews

File: `lib/admin/reviews.js`

```
getReviews({ search, status, lawyerId }) -> Review[]
updateReviewStatus(id, status) -> Review   // "published" | "pending" | "hidden"
deleteReview(id) -> { success: true }
```

Reviews are currently read-only demo data flattened from each lawyer's
embedded review list (`data/lawyers.js`). A real backend will likely need a
`createReview` entry point too, even though the admin UI does not expose
review creation (reviews arrive from the public site).

---

## Practice Areas

File: `lib/admin/practiceAreas.js`

```
getPracticeAreas({ search }) -> PracticeArea[]
getPracticeArea(id) -> PracticeArea | null
createPracticeArea(data) -> PracticeArea
updatePracticeArea(id, data) -> PracticeArea   // throws if not found
deletePracticeArea(id) -> { success: true }
```

`lawyerCount` is currently derived by counting lawyers referencing the area's
slug. Article categories (`getCategoryOptions` in `lib/admin/articles.js`)
are also sourced from this list, so practice area names double as the
article category taxonomy.

---

## Images

File: `lib/admin/upload.js`

```
uploadImage(file) -> { url }   // throws Error with .message / .code on failure
```

Used by `components/admin/ImageUploader.jsx` for lawyer photos, article
featured images, and the settings avatar. The mock implementation validates
file type/size and returns a local blob URL. A real implementation should:

- Accept the same `file` (a browser `File`) in, return `{ url }` out (or
  throw an `Error` with a `.message`).
- Handle replace (re-upload over an existing value) and remove (the UI just
  clears the field locally — no delete call is currently made, so add one if
  orphaned assets need cleanup).

---

## Admin Profile

Surfaced in `/admin/settings` (Account section) and the sidebar/header.
Expected fields: `name`, `email`, `avatar`, `role`, and a `lastLogin`
timestamp. Currently `getCurrentAdmin()` supplies `name`/`email`/`role`/
`avatar`; `lastLogin` is generated client-side as a placeholder and should be
returned by the backend instead once real sessions exist. Settings changes
(account, security, notifications, appearance) are not persisted anywhere
today — the form gives a success state, but a page refresh reverts it.

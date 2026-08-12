<!-- @format -->

# Review Top Lawyers — Claude Code Instructions

## Project

Review Top Lawyers is a modern, professional lawyer discovery and ranking platform.

The original website was reconstructed from an old PDF reference. The PDF is a reference for the site's identity, information architecture, categories and general purpose.

Do NOT recreate the old visual design.

Build a completely new, modern, premium and professional experience.

---

## Technology

Use:

- Next.js App Router
- JavaScript
- JSX
- Tailwind CSS
- Framer Motion

TypeScript is NOT allowed.

Do not create:

- .ts files
- .tsx files
- TypeScript interfaces
- TypeScript types

Use JavaScript throughout the project.

---

## Core Principles

1. Keep the application responsive from large desktop screens down to very small mobile screens.
2. Prefer reusable components.
3. Keep content/data separate from presentation.
4. Do not hardcode repeated lawyer/practice-area/article data inside UI components.
5. Keep fake/demo data centralized so it can easily be replaced later.
6. Use semantic HTML.
7. Prioritize accessibility.
8. Keep components focused and reasonably small.
9. Avoid unnecessary abstraction.
10. Do not introduce libraries unless they provide clear value.
11. Do not over-engineer the application.

---

## Design

The website should feel:

- Premium
- Trustworthy
- Professional
- Modern
- Clean
- Human
- Editorial

Avoid:

- Generic template appearance
- Excessive gradients
- Excessive animations
- Huge decorative effects
- Cartoonish UI
- Overly colorful interfaces
- Old-fashioned legal website styling

Use restrained animation to make the interface feel alive.

Animations should never hurt usability or performance.

---

## Content

All current lawyer information, reviews and contact information are fictional demo content.

They are temporary and will be replaced later.

Never present fictional information as verified real-world information.

Do not invent real lawyer identities, awards, rankings, legal outcomes or statistics.

---

## Search

The global search field must exist in the application from the beginning.

It may remain non-functional in the initial version.

Do not remove it because search functionality will be implemented later.

The directory's local search/filter experience may work against the current demo dataset.

---

## Forms

Forms should include:

- Proper labels
- Validation
- Useful error messages
- Loading state where appropriate
- Success state
- Accessible controls

The submission layer should remain isolated and ready for a future backend/email service.

Do not connect the form to a real service unless explicitly instructed.

---

## SEO

Use Next.js metadata appropriately.

Important pages should have:

- Unique title
- Description
- Relevant metadata
- Semantic headings
- Crawlable links
- Clean URLs

Do not keyword-stuff content.

---

## Images

Use image placeholders where real client assets are unavailable.

Do not invent claims about people shown in images.

Keep image usage easy to replace later.

---

## Architecture

Follow the structure documented in:

- ARCHITECTURE.md
- DESIGN.md
- CONTENT.md
- DATA.md

These files are project source-of-truth documents.

If an implementation decision conflicts with them, prefer the documented project rules unless there is a strong technical reason to change them.

---

## Development Workflow

Before implementing a major feature:

1. Understand the existing architecture.
2. Reuse existing components where appropriate.
3. Avoid duplicating components.
4. Keep data separate from UI.
5. Test the result at desktop and mobile widths.
6. Run lint/build after meaningful changes.

Do not rewrite working parts of the application unnecessarily.

---

## Important

The goal is not to reproduce the broken old website.

The goal is to rebuild Review Top Lawyers as a modern production-quality website while preserving the original site's core concept and information architecture.

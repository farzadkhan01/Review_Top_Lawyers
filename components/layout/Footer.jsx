import Link from "next/link";
import Container from "@/components/ui/Container";
import Logo from "@/components/ui/Logo";
import { NAV_LINKS, SOCIAL_LINKS } from "@/lib/constants";
import practiceAreas from "@/data/practiceAreas";

export default function Footer() {
  const year = new Date().getFullYear();
  const featuredPracticeAreas = practiceAreas.slice(0, 6);

  return (
    <footer className="mt-24 border-t border-cream-200 bg-navy-900 text-cream-50">
      <Container>
        <div className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo tone="light" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream-100/70">
              A modern directory for finding trusted legal representation, organized by
              practice area, location, and reputation.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-cream-100/60">
              Explore
            </h3>
            <ul className="mt-4 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream-100/80 transition-colors hover:text-gold-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-cream-100/60">
              Practice Areas
            </h3>
            <ul className="mt-4 space-y-3">
              {featuredPracticeAreas.map((area) => (
                <li key={area.slug}>
                  <Link
                    href={`/directory/${area.slug}`}
                    className="text-sm text-cream-100/80 transition-colors hover:text-gold-400"
                  >
                    {area.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/directory"
                  className="text-sm font-medium text-gold-400 transition-colors hover:text-gold-300"
                >
                  View All →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-cream-100/60">
              Connect
            </h3>
            <ul className="mt-4 space-y-3">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    title={`${link.label} (coming soon)`}
                    className="text-sm text-cream-100/80 transition-colors hover:text-gold-400"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 py-6 text-xs text-cream-100/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Review Top Lawyers. All rights reserved.</p>
          <p>All lawyer profiles, reviews, and ratings shown are fictional demo content.</p>
        </div>
      </Container>
    </footer>
  );
}

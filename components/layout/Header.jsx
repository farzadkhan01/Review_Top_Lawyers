import Link from "next/link";
import Container from "@/components/ui/Container";
import Logo from "@/components/ui/Logo";
import SearchField from "@/components/ui/SearchField";
import MobileNavigation from "@/components/layout/MobileNavigation";
import { NAV_LINKS } from "@/lib/constants";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-cream-200 bg-cream-50/95 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
          <Logo />

          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-navy-800 transition-colors hover:text-gold-700"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block lg:w-56 xl:w-72">
            <SearchField />
          </div>

          <MobileNavigation navLinks={NAV_LINKS} />
        </div>
      </Container>
    </header>
  );
}

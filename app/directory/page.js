import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import LawyerFilters from "@/components/lawyers/LawyerFilters";
import lawyers from "@/data/lawyers";
import practiceAreas from "@/data/practiceAreas";

export const metadata = {
  title: "Directory",
  description:
    "Search and filter our directory of lawyers by practice area, location, and rating.",
  // Search/filter query params create URL variations of this page — point
  // search engines at the clean, canonical /directory URL.
  alternates: { canonical: "/directory" },
};

export default async function DirectoryPage({ searchParams }) {
  const params = await searchParams;
  const initialSearch = typeof params?.q === "string" ? params.q : "";
  const initialSort = typeof params?.sort === "string" ? params.sort : undefined;
  const initialPracticeArea =
    typeof params?.practiceArea === "string" ? params.practiceArea : "";

  return (
    <>
      <section className="border-b border-cream-200 bg-cream-50 py-16 sm:py-20">
        <Container>
          <SectionHeading
            titleAs="h1"
            eyebrow="Directory"
            title="Find a Lawyer"
            description={`Search and filter ${lawyers.length} demo lawyer profiles across ${practiceAreas.length} practice areas by name, location, practice area, and rating.`}
          />
        </Container>
      </section>

      <Container className="py-16">
        <LawyerFilters
          lawyers={lawyers}
          practiceAreas={practiceAreas}
          initialSearch={initialSearch}
          initialSort={initialSort}
          initialPracticeArea={initialPracticeArea}
        />
      </Container>
    </>
  );
}

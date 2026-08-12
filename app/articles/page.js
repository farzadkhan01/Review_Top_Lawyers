import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ArticleGrid from "@/components/articles/ArticleGrid";
import articles from "@/data/articles";

export const metadata = {
  title: "Articles",
  description: "Original articles and guides on common legal topics.",
};

export default function ArticlesPage() {
  return (
    <>
      <section className="border-b border-cream-200 bg-cream-50 py-16 sm:py-20">
        <Container>
          <SectionHeading
            titleAs="h1"
            eyebrow="Articles"
            title="Legal Insights & Guides"
            description={`Original articles to help you understand common legal topics and know what to look for when choosing a lawyer. ${articles.length} articles are currently available, with more added regularly.`}
          />
        </Container>
      </section>

      <Container className="py-16">
        <ArticleGrid articles={articles} />
      </Container>
    </>
  );
}

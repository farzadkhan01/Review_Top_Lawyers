import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ArticleGrid from "@/components/articles/ArticleGrid";
import articles from "@/data/articles";
import practiceAreas from "@/data/practiceAreas";
import { getRelatedArticles } from "@/lib/utils";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    return { title: "Article Not Found" };
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      images: [article.image],
    },
  };
}

function formatArticleDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    notFound();
  }

  const paragraphs = article.content.split("\n\n").filter(Boolean);
  const relatedArticles = getRelatedArticles(article, articles);
  const relatedPracticeArea = practiceAreas.find((area) => area.name === article.category);

  return (
    <>
      <section className="border-b border-cream-200 bg-cream-50 py-16 sm:py-20">
        <Container className="flex flex-col gap-6">
          <Link
            href="/articles"
            className="inline-flex w-fit items-center gap-1.5 rounded text-sm font-medium text-navy-800 hover:text-gold-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
          >
            ← All Articles
          </Link>

          <div className="flex flex-col gap-4">
            <Badge variant="outline">{article.category}</Badge>
            <h1 className="max-w-3xl font-heading text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-600">
              <span>{article.author}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>
              {article.readingTime && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{article.readingTime}</span>
                </>
              )}
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-16">
        <div className="mx-auto max-w-3xl">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-cream-100">
            <Image
              src={article.image}
              alt={`Illustration placeholder for ${article.title}`}
              fill
              sizes="(min-width: 1024px) 768px, 100vw"
              className="object-cover"
              priority
            />
          </div>

          <p className="mt-6 text-xs italic text-muted-400">
            This content is for general informational purposes and is not legal advice.
          </p>

          <div className="mt-6 flex flex-col gap-5">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="break-words text-base leading-relaxed text-muted-600">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-10 rounded-lg border border-cream-200 bg-cream-50 p-6">
            <h2 className="font-heading text-lg font-semibold text-navy-900">
              Looking for a {article.category.toLowerCase()} lawyer?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-600">
              Browse our directory to find and compare lawyers who focus on this practice area.
            </p>
            <Button
              href={relatedPracticeArea ? `/directory/${relatedPracticeArea.slug}` : "/directory"}
              variant="primary"
              className="mt-4"
            >
              {relatedPracticeArea
                ? `Explore ${relatedPracticeArea.name} Lawyers`
                : "Explore the Directory"}
            </Button>
          </div>
        </div>
      </Container>

      {relatedArticles.length > 0 && (
        <section className="border-t border-cream-200 bg-cream-50 py-16">
          <Container>
            <h2 className="font-heading text-2xl font-semibold text-navy-900">Related Articles</h2>
            <div className="mt-8">
              <ArticleGrid articles={relatedArticles} />
            </div>
          </Container>
        </section>
      )}
    </>
  );
}

import ArticleCard from "@/components/articles/ArticleCard";
import Reveal from "@/components/ui/Reveal";
import EmptyState from "@/components/ui/EmptyState";

export default function ArticleGrid({ articles }) {
  if (!articles?.length) {
    return (
      <EmptyState
        title="No articles yet"
        description="Check back soon for new articles and guides."
      />
    );
  }

  return (
    <ul className="grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, index) => (
        <li key={article.id}>
          <Reveal delay={Math.min(index, 6) * 0.05} className="h-full">
            <ArticleCard article={article} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

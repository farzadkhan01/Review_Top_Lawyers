import Image from "next/image";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { ArrowRightIcon } from "@/components/ui/icons";

function formatArticleDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ArticleCard({ article }) {
  return (
    <Card as="article" className="flex h-full flex-col gap-0 overflow-hidden p-0">
      <div className="relative aspect-[16/9] w-full bg-cream-100">
        <Image
          src={article.image}
          alt={`Illustration placeholder for ${article.title}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Badge variant="outline">{article.category}</Badge>
        <h3 className="line-clamp-2 font-heading text-lg font-semibold text-navy-900">
          <Link
            href={`/articles/${article.slug}`}
            className="rounded hover:text-gold-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
          >
            {article.title}
          </Link>
        </h3>
        <p className="line-clamp-2 flex-1 break-words text-sm leading-relaxed text-muted-600">
          {article.excerpt}
        </p>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-400">
          <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>
          {article.readingTime && (
            <>
              <span aria-hidden="true">·</span>
              <span>{article.readingTime}</span>
            </>
          )}
        </div>
        <Link
          href={`/articles/${article.slug}`}
          className="mt-auto inline-flex items-center gap-1.5 rounded text-sm font-semibold text-navy-900 hover:text-gold-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
        >
          Read Article
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </Card>
  );
}

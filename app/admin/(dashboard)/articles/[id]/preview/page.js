/** @format */

import articles from "@/data/articles";
import ArticlePreviewClient from "@/components/admin/articles/ArticlePreviewClient";

export function generateStaticParams() {
  return articles.map((article) => ({ id: article.slug }));
}

export default async function ArticlePreviewPage({ params }) {
  const { id } = await params;
  return <ArticlePreviewClient id={id} />;
}

/** @format */

import articles from "@/data/articles";
import EditArticleClient from "@/components/admin/articles/EditArticleClient";

export function generateStaticParams() {
  return articles.map((article) => ({ id: article.slug }));
}

export default async function EditArticlePage({ params }) {
  const { id } = await params;
  return <EditArticleClient id={id} />;
}

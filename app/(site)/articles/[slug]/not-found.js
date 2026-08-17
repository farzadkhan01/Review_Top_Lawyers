import NotFoundState from "@/components/ui/NotFoundState";

export default function ArticleNotFound() {
  return (
    <NotFoundState
      title="We could not find that article"
      description="The article you are looking for does not exist. Browse all articles instead."
      actionLabel="Back to Articles"
      actionHref="/articles"
    />
  );
}

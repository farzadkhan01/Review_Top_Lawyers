import NotFoundState from "@/components/ui/NotFoundState";

export default function NotFound() {
  return (
    <NotFoundState
      title="Page not found"
      description="The page you are looking for does not exist or may have been moved."
      actionLabel="Back to Home"
      actionHref="/"
    />
  );
}

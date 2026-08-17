import NotFoundState from "@/components/ui/NotFoundState";

export default function LawyerNotFound() {
  return (
    <NotFoundState
      title="We could not find that lawyer profile"
      description="The lawyer profile you are looking for does not exist. Browse the directory to find a lawyer instead."
      actionLabel="Back to Directory"
      actionHref="/directory"
    />
  );
}

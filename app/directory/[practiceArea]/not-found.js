import NotFoundState from "@/components/ui/NotFoundState";

export default function PracticeAreaNotFound() {
  return (
    <NotFoundState
      title="We could not find that practice area"
      description="The practice area you are looking for does not exist in our directory. Browse all practice areas from the main directory instead."
      actionLabel="Back to Directory"
      actionHref="/directory"
    />
  );
}

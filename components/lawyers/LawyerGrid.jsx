import LawyerCard from "@/components/lawyers/LawyerCard";
import Reveal from "@/components/ui/Reveal";
import EmptyState from "@/components/ui/EmptyState";

export default function LawyerGrid({ lawyers, emptyState }) {
  if (!lawyers?.length) {
    return (
      emptyState ?? (
        <EmptyState title="No lawyers found" description="Try adjusting your search or filters." />
      )
    );
  }

  return (
    <ul className="grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {lawyers.map((lawyer, index) => (
        <li key={lawyer.id}>
          <Reveal delay={Math.min(index, 6) * 0.05} className="h-full">
            <LawyerCard lawyer={lawyer} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

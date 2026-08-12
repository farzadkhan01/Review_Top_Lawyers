import { notFound } from "next/navigation";
import lawyers from "@/data/lawyers";
import practiceAreas from "@/data/practiceAreas";
import articles from "@/data/articles";
import LawyerProfile from "@/components/lawyers/LawyerProfile";
import { getRelatedLawyers } from "@/lib/utils";

export function generateStaticParams() {
  return lawyers.map((lawyer) => ({ slug: lawyer.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const lawyer = lawyers.find((item) => item.slug === slug);

  if (!lawyer) {
    return { title: "Lawyer Not Found" };
  }

  return {
    title: `${lawyer.name} — ${lawyer.specialty}`,
    description: lawyer.shortBio,
  };
}

export default async function LawyerProfilePage({ params }) {
  const { slug } = await params;
  const lawyer = lawyers.find((item) => item.slug === slug);

  if (!lawyer) {
    notFound();
  }

  const relatedLawyers = getRelatedLawyers(lawyer, lawyers);

  const lawyerPracticeAreaNames = practiceAreas
    .filter((area) => lawyer.practiceAreas.includes(area.slug))
    .map((area) => area.name);
  const relevantArticles = articles
    .filter((article) => lawyerPracticeAreaNames.includes(article.category))
    .slice(0, 3);

  return (
    <LawyerProfile
      lawyer={lawyer}
      practiceAreas={practiceAreas}
      relatedLawyers={relatedLawyers}
      relevantArticles={relevantArticles}
    />
  );
}

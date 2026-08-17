/** @format */

import lawyers from "@/data/lawyers";
import EditLawyerClient from "@/components/admin/lawyers/EditLawyerClient";

export function generateStaticParams() {
  return lawyers.map((lawyer) => ({ id: lawyer.slug }));
}

export default async function EditLawyerPage({ params }) {
  const { id } = await params;
  return <EditLawyerClient id={id} />;
}

/** @format */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import StatCard from "@/components/admin/StatCard";
import StatusBadge from "@/components/admin/StatusBadge";
import Button from "@/components/ui/Button";
import { UsersIcon, DocumentIcon, StarIcon, ScaleIcon, PlusIcon } from "@/components/ui/icons";
import { getLawyers } from "@/lib/admin/lawyers";
import { getArticles } from "@/lib/admin/articles";
import { getPracticeAreas } from "@/lib/admin/practiceAreas";
import { getReviews } from "@/lib/admin/reviews";

const RECENT_ACTIVITY = [
  { id: 1, actor: "Jordan Casey", action: "published the article", target: "What to Expect During a Personal Injury Settlement", time: "1 hour ago" },
  { id: 2, actor: "Jordan Casey", action: "updated the profile for", target: "Amelia Torres", time: "2 hours ago" },
  { id: 3, actor: "Jordan Casey", action: "approved a review for", target: "Sofia Reyes", time: "5 hours ago" },
  { id: 4, actor: "Jordan Casey", action: "saved a draft of", target: "Do You Need a Will? Estate Planning Basics", time: "8 hours ago" },
  { id: 5, actor: "Jordan Casey", action: "added a new lawyer profile for", target: "Nina Patel", time: "1 day ago" },
  { id: 6, actor: "Jordan Casey", action: "updated the practice area", target: "Immigration Law", time: "2 days ago" },
];

export default function AdminDashboardPage() {
  const [lawyers, setLawyers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [practiceAreas, setPracticeAreas] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([getLawyers(), getArticles(), getPracticeAreas(), getReviews()]).then(
      ([lawyerData, articleData, areaData, reviewData]) => {
        if (!isMounted) return;
        setLawyers(lawyerData);
        setArticles(articleData);
        setPracticeAreas(areaData);
        setReviews(reviewData);
        setLoading(false);
      }
    );
    return () => {
      isMounted = false;
    };
  }, []);

  const publishedArticles = articles.filter((article) => article.status === "published");
  const draftArticles = articles.filter((article) => article.status === "draft");

  const recentLawyers = [...lawyers]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);
  const recentArticles = [...articles]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader title="Dashboard" description="An overview of your lawyer directory content." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard icon={UsersIcon} label="Total Lawyers" value={loading ? "—" : lawyers.length} />
        <StatCard icon={DocumentIcon} label="Published Articles" value={loading ? "—" : publishedArticles.length} />
        <StatCard icon={DocumentIcon} label="Draft Articles" value={loading ? "—" : draftArticles.length} />
        <StatCard icon={StarIcon} label="Reviews" value={loading ? "—" : reviews.length} />
        <StatCard icon={ScaleIcon} label="Practice Areas" value={loading ? "—" : practiceAreas.length} />
      </div>

      <div>
        <h2 className="mb-3 font-heading text-lg font-semibold text-navy-900">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Button href="/admin/lawyers/new" variant="primary" className="!justify-start">
            <PlusIcon className="h-4 w-4" /> Add Lawyer
          </Button>
          <Button href="/admin/articles/new" variant="primary" className="!justify-start">
            <PlusIcon className="h-4 w-4" /> Add Article
          </Button>
          <Button href="/admin/lawyers" variant="secondary" className="!justify-start">
            Manage Lawyers
          </Button>
          <Button href="/admin/articles" variant="secondary" className="!justify-start">
            Manage Articles
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-cream-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-navy-900">Recent Lawyers</h2>
            <Link href="/admin/lawyers" className="text-sm font-medium text-navy-800 hover:text-gold-700">
              View all
            </Link>
          </div>
          {loading ? (
            <p className="text-sm text-muted-600">Loading...</p>
          ) : recentLawyers.length === 0 ? (
            <p className="text-sm text-muted-600">No lawyers yet.</p>
          ) : (
            <ul className="divide-y divide-cream-200">
              {recentLawyers.map((lawyer) => (
                <li key={lawyer.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-navy-900">{lawyer.name}</p>
                    <p className="truncate text-xs text-muted-400">{lawyer.location}</p>
                  </div>
                  <StatusBadge status={lawyer.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg border border-cream-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-navy-900">Recent Articles</h2>
            <Link href="/admin/articles" className="text-sm font-medium text-navy-800 hover:text-gold-700">
              View all
            </Link>
          </div>
          {loading ? (
            <p className="text-sm text-muted-600">Loading...</p>
          ) : recentArticles.length === 0 ? (
            <p className="text-sm text-muted-600">No articles yet.</p>
          ) : (
            <ul className="divide-y divide-cream-200">
              {recentArticles.map((article) => (
                <li key={article.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-navy-900">{article.title}</p>
                    <p className="truncate text-xs text-muted-400">{article.category}</p>
                  </div>
                  <StatusBadge status={article.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-cream-200 bg-white p-5">
        <h2 className="mb-4 font-heading text-lg font-semibold text-navy-900">Recent Activity</h2>
        <ul className="flex flex-col gap-4">
          {RECENT_ACTIVITY.map((item) => (
            <li key={item.id} className="flex gap-3 text-sm">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" aria-hidden="true" />
              <p className="text-muted-600">
                <span className="font-medium text-navy-900">{item.actor}</span> {item.action}{" "}
                <span className="font-medium text-navy-900">{item.target}</span>
                <span className="ml-2 text-xs text-muted-400">{item.time}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

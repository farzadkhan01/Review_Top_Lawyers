/** @format */

import {
  DashboardIcon,
  UsersIcon,
  DocumentIcon,
  StarIcon,
  ScaleIcon,
  SettingsIcon,
} from "@/components/ui/icons";

export const ADMIN_NAV_LINKS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: DashboardIcon },
  { label: "Lawyers", href: "/admin/lawyers", icon: UsersIcon },
  { label: "Articles", href: "/admin/articles", icon: DocumentIcon },
  { label: "Reviews", href: "/admin/reviews", icon: StarIcon },
  { label: "Practice Areas", href: "/admin/practice-areas", icon: ScaleIcon },
  { label: "Settings", href: "/admin/settings", icon: SettingsIcon },
];

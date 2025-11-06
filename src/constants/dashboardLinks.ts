import {
  Home,
  Megaphone,
  Calendar,
  Clock,
  Users,
  UserSquare2,
  FileCheck,
  GraduationCap,
  IdCard,
} from "lucide-react";

export type DashboardLink = {
  icon: React.ElementType;
  name: string;
  href: string;
  authorization: string[];
};

export type DashboardSection = {
  header: string;
  links: DashboardLink[];
  allowed: string[];
};

const dashboardLinks: DashboardSection[] = [
  {
    header: "Main",
    links: [
      {
        icon: Home,
        name: "Dashboard",
        href: "/dashboard",
        authorization: [""],
      },
      {
        icon: Megaphone,
        name: "Announcements",
        href: "/dashboard/announcements",
        authorization: [""],
      },
    ],
    allowed: [""],
  },
  {
    header: "Schedule",
    links: [
      {
        icon: Calendar,
        name: "Defense Schedule",
        href: "/dashboard/defense-schedules",
        authorization: ["FACULTY", "STUDENT", "ADMIN"],
      },
      {
        icon: Clock,
        name: "Defense Schedule Requests",
        href: "/dashboard/schedules",
        authorization: ["STAFF", "ADMIN"],
      },
    ],
    allowed: ["ADMIN", "STAFF", "FACULTY"],
  },
  {
    header: "Thesis",
    links: [
      {
        icon: UserSquare2, // represents a group of users
        name: "Advisees",
        href: "/dashboard/advisees",
        authorization: [""],
      },
    ],
    allowed: ["STAFF", "FACULTY", "ADMIN"],
  },
  {
    header: "Documents",
    links: [
      {
        icon: FileCheck,
        name: "Faculty Requirements",
        href: "/dashboard/faculty-requirements",
        authorization: [""],
      },
    ],
    allowed: ["STAFF", "FACULTY", "ADMIN"],
  },
  {
    header: "Account Management",
    links: [
      {
        icon: Users,
        name: "Staff",
        href: "/dashboard/staffs",
        authorization: ["ADMIN"],
      },
      {
        icon: GraduationCap,
        name: "Faculty",
        href: "/dashboard/faculties",
        authorization: ["ADMIN"],
      },
      {
        icon: IdCard,
        name: "Students",
        href: "/dashboard/students",
        authorization: ["ADMIN"],
      },
    ],
    allowed: ["ADMIN"],
  },
];

export default dashboardLinks;

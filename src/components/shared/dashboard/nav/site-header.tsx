"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "../../../ui/sidebar";
import { Separator } from "../../../ui/separator";
import dashboardLinks from "@/src/constants/dashboardLinks";
import { match } from "assert";
import Link from "next/link";

const SiteHeader = ({ dataName }: { dataName?: string }) => {
  const pathname = usePathname();

  // Flatten dashboard links
  const allLinks = dashboardLinks.flatMap((section) =>
    section.links.map((link) => ({
      ...link,
      sectionHeader: section.header,
    }))
  );

  // Split pathname
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbPaths = segments.map(
    (_, i) => "/" + segments.slice(0, i + 1).join("/")
  );

  const findExactOrBestMatch = (path: string) => {
    const matches = allLinks.filter(
      (link) => path === link.href || path.startsWith(link.href + "/")
    );

    if (!matches.length) return null;

    return matches.reduce((a, b) => (a.href.length > b.href.length ? a : b));
  };

  // Helper for fallback segments
  const formatGenericSegment = (segment: string) => {
    const lower = segment.toLocaleLowerCase();
    if (["view", "details"].includes(lower)) return "Viewing";
    if (["edit", "update"].includes(lower)) return "Editing";
    if (["create", "new"].includes(lower)) return "Creating";
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  // Breadcrumbs
  const breadCrumbs = breadcrumbPaths
    .map((path, i) => {
      const isLast = i === breadcrumbPaths.length - 1;
      const match = findExactOrBestMatch(path);

      if (match) {
        return {
          name: match.name,
          href: match.href,
          icon: match.icon ?? null,
          isLast,
        };
      }
      const segment = path.split("/").pop() || "";

      // Handle edit/view/create
      if (["view", "edit", "create", "new", "add"].includes(segment)) {
        return {
          name: formatGenericSegment(segment),
          href: path,
          icon: null,
          isLast,
        };
      }

      // Handle dynamic ID with dataName (e.g. /students/[id])
      if (isLast && dataName) {
        return {
          firsName: dataName,
          href: path,
          icon: null,
          isLast,
        };
      }

      // Fallback segment name
      const formattedName = segment
        .replace(/-/g, "")
        .replace(/\b\w/g, (l) => l.toUpperCase());

      return { name: formattedName, href: path, icon: null, isLast };
    })
    .filter(
      (item, index, self) =>
        index === self.findIndex((b) => b.name === item.name)
    );

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-2 px-4 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1 text-sm min-w-0"
        >
          {breadCrumbs.map((crumb, i) => {
            const key = `${crumb.href}-${i}`;
            const isLast = i === breadCrumbs.length - 1;

            return (
              <div key={key} className="flex items-center min-w-0">
                {!isLast ? (
                  <Link
                    href={crumb.href}
                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors truncate max-w-[140px] sm:max-w-[220px]"
                    title={crumb.name}
                  >
                    <span className="truncate">{crumb.name}</span>
                  </Link>
                ) : (
                  <span
                    className="flex items-center gap-1 text-foreground truncate max-w-[150px] sm:max-w-[250px]"
                    title={crumb.name}
                  >
                    <span className="truncate">{crumb.name}</span>
                  </span>
                )}

                {!isLast && (
                  <span className="mx-1 text-muted-foreground select-none">
                    /
                  </span>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default SiteHeader;

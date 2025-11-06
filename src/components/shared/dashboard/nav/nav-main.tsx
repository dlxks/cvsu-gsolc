import dashboardLinks from "@/src/constants/dashboardLinks";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../../../ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../ui/collapsible";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface NavMainProps {
  role: string;
}

const NavMain = ({ role }: NavMainProps) => {
  const filteredSections = dashboardLinks.filter(
    (section) => section.allowed.includes(role) || section.allowed.includes("")
  );

  return (
    <>
      {filteredSections.map((section) => (
        <SidebarGroup key={section.header}>
          <SidebarMenu>
            <Collapsible asChild defaultOpen className="group/collapsible">
              <SidebarMenuItem>
                {/* Trigger */}
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={section.header}>
                    <span>{section.header}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                {/* Contents */}
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {section.links
                      .filter(
                        (link) =>
                          link.authorization.includes(role) ||
                          link.authorization.includes("")
                      )
                      .map((link) => {
                        const Icon = link.icon;
                        return (
                          <SidebarMenuSubItem key={link.href}>
                            <SidebarMenuSubButton asChild>
                              <Link
                                href={link.href}
                                className="flex items-center gap-2"
                              >
                                <Icon className="2-5 h-5" />
                                <span>{link.name}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
};

export default NavMain;

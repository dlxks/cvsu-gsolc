import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../../ui/sidebar";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import NavMain from "./nav-main";
import { NavUser } from "./nav-user";

const AppSidebar = async ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const session = await auth();
  const role = session?.user?.role ?? "";

  return (
    <Sidebar variant="inset" {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                <GraduationCap />
                <span className="text-base font-semibold">CvSU-GSOLC</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        <NavMain role={role} />
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        {session?.user && <NavUser session={session} />}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;

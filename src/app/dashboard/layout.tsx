import { auth } from "@/lib/auth";
import AppSidebar from "@/src/components/shared/dashboard/nav/app-sidebar";
import SiteHeader from "@/src/components/shared/dashboard/nav/site-header";
import { SidebarInset, SidebarProvider } from "@/src/components/ui/sidebar";
import React from "react";
import { Toaster } from "sonner";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/signin"); // ✅ SERVER REDIRECT — stops the render immediately
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      {/* Sidebar */}
      <AppSidebar />

      <SidebarInset>
        {/* Site header breadcrumbs */}
        <SiteHeader />

        {/* Main contents */}
        <main className="space-y-6 p-4">
          {children}
          <Toaster position="top-right" richColors />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

import HomeNavbar from "@/src/components/home/home-navbar";
import HomeSidebar from "@/src/components/home/home-sidebar";
import { homeNavLinks } from "@/src/constants/homeNavLinks";
import Link from "next/link";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Navbar */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4 lg:px-8">
          <div className="flex items-center gap-2">
            {/* Sidebar */}
            <HomeSidebar />
            {/* Logo */}
            <Link href="/" className="text-xl font-semibold">
              CvSU-GSOLC
            </Link>
          </div>

          {/* Desktop nav */}
          <HomeNavbar />
        </div>
      </header>

      {/* Page content here */}
      <main className="flex-1 p-4 lg:p-8">{children}</main>
    </div>
  );
}

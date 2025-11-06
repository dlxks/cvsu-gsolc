import { homeNavLinks } from "@/src/constants/homeNavLinks";
import Link from "next/link";
import { Button } from "../ui/button";

const HomeNavbar = () => {
  return (
    <nav className="flex items-center gap-6">
      <div className="hidden lg:flex items-center gap-6">
        {homeNavLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <Button asChild variant="default">
        <Link href="signin">Sign in</Link>
      </Button>
    </nav>
  );
};

export default HomeNavbar;

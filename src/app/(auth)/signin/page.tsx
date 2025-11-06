import { auth } from "@/lib/auth";
import Link from "next/link";
import { SignIn } from "@/src/components/auth/auth-components";
import { ChevronLeft } from "lucide-react";
import UserRedirect from "@/src/components/auth/user-redirect";

const SignInPage = async () => {
  const session = await auth();

  if (session?.user) {
    const redirectTarget = "/dashboard";

    return (
      <UserRedirect
        redirectTo={redirectTarget}
        delay={3}
        message="Redirecting to dashboard"
      />
    );
  }

  return (
    <section className="container mx-auto py-12 px-4 lg:px-0">
      <Link href="/" className="flex items-center link link-hover">
        <ChevronLeft size={18} />
        Return to home
      </Link>
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="bg-slate-500/80 glass w-full max-w-md rounded-xl p-8 shadow-md/20">
          <h1 className="mb-6 text-center text-2xl text-white font-semibold tracking-wide">
            Sign in to your account
          </h1>
          <div className="w-full flex items-center justify-center">
            <SignIn provider="google" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignInPage;

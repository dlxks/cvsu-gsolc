"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

interface RedirectLoaderProps {
  redirectTo: string; // Target path for redirection
  delay?: number; // Countdown duration in seconds (default = 3)
  message?: string; // Optional message to display while waiting
}

/**
 * UserRedirect
 *
 * A client-side loader component that:
 * - Shows a spinner, countdown, and message before redirecting.
 * - Redirects automatically after a configurable delay (default: 3 seconds).
 * - Provides a "Redirect Now" button to skip the countdown.
 *
 * Useful for showing users a clear transition when they are redirected
 * after sign-in, role validation, or access checks.
 */
export default function UserRedirect({
  redirectTo,
  delay = 3,
  message = "Redirecting you...",
}: RedirectLoaderProps) {
  const [countdown, setCountdown] = useState(delay);
  const router = useRouter();

  // Countdown timer logic → auto-redirect when countdown hits 0
  useEffect(() => {
    if (countdown <= 0) {
      router.replace(redirectTo);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, redirectTo, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="text-center space-y-4">
        {/* Spinner Loader */}
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-blue-500 border-t-transparent mx-auto" />

        {/* Status Message */}
        <h1 className="text-xl font-semibold">{message}</h1>

        {/* Countdown Display */}
        <p className="text-gray-600">
          Redirecting in <span className="font-bold">{countdown}</span>{" "}
          seconds...
        </p>

        {/* Manual Redirect Button */}
        <Button onClick={() => router.replace(redirectTo)} variant="default">
          Redirect Now
        </Button>
      </div>
    </div>
  );
}

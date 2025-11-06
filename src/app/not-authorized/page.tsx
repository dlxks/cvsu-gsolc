"use client";

import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotAuthorized() {
  const router = useRouter();

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-base-200 text-center">
      <h1 className="text-4xl font-bold text-error mb-4">
        403 - Not Authorized
      </h1>
      <p className="text-lg mb-6">
        You do not have permission to view this page.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => router.back()} variant="outline">
          Go Back
        </Button>
        <Button onClick={() => router.push("/dashboard")} variant="default">
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}

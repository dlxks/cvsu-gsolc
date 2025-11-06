"use client";

import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-4 text-red-500">
        404 - Page Not Found
      </h1>
      <p className="text-lg mb-6">
        Sorry, the page you are looking for does not exist.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => router.back()} variant="default">
          Go Back
        </Button>
        <Button onClick={() => router.push("/dashboard")} variant="outline">
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}

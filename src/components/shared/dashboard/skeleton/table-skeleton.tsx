"use client";

import { Skeleton } from "@/src/components/ui/skeleton";

export default function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2 mx-auto w-full">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-32" />
        </div>
      ))}
    </div>
  );
}

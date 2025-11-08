import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm z-50">
      <Loader2 className="h-15 w-15 animate-spin text-primary" />
    </div>
  );
}

import { Suspense } from "react";

import { AuthErrorContent } from "./_components/auth-error-content";

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="size-16 animate-pulse rounded-full bg-muted" />
          <div className="space-y-2">
            <div className="mx-auto h-8 w-48 animate-pulse rounded bg-muted" />
            <div className="mx-auto h-4 w-64 animate-pulse rounded bg-muted" />
          </div>
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}

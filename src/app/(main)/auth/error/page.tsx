"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { AlertTriangle, Home, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";

const ERROR_MESSAGES: Record<string, { title: string; description: string }> = {
  access_denied: {
    title: "Access Denied",
    description: "You denied access or the authorization was cancelled. Please try again.",
  },
  OAuthAccountNotLinked: {
    title: "Account Not Linked",
    description: "This email is already associated with another account. Please sign in with your original method.",
  },
  default: {
    title: "Authentication Error",
    description: "Something went wrong during authentication. Please try again.",
  },
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") ?? "default";
  const errorInfo = ERROR_MESSAGES[error] ?? ERROR_MESSAGES.default;

  return (
    <div className="flex flex-col items-center space-y-6 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="size-8 text-destructive" />
      </div>
      <div className="space-y-2">
        <h1 className="font-medium text-2xl">{errorInfo.title}</h1>
        <p className="text-muted-foreground text-sm">{errorInfo.description}</p>
      </div>
      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href="/">
            <Home className="mr-2 size-4" />
            Go Home
          </Link>
        </Button>
        <Button asChild>
          <Link href="/auth/v2/login">
            <RotateCw className="mr-2 size-4" />
            Try Again
          </Link>
        </Button>
      </div>
    </div>
  );
}

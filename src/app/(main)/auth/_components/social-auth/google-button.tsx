"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { siGoogle } from "simple-icons";

import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function GoogleButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackURL = searchParams.get("callbackUrl") || "/dashboard";

  async function handleGoogleLogin() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL,
    });
    router.refresh();
  }

  return (
    <Button variant="secondary" className={cn("cursor-pointer", className)} onClick={handleGoogleLogin} {...props}>
      <SimpleIcon icon={siGoogle} className="size-4" />
      Continue with Google
    </Button>
  );
}

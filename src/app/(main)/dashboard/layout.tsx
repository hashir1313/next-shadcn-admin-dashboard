import type { ReactNode } from "react";

import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { PlusCircleIcon } from "lucide-react";
import { siGithub } from "simple-icons";

import { AppSidebar } from "@/app/(main)/dashboard/_components/sidebar/app-sidebar";
import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { getPreference } from "@/server/server-actions";

import { OnboardingTour } from "./_components/onboarding-tour";
import { LayoutControls } from "./_components/sidebar/layout-controls";
import { SearchDialog } from "./_components/sidebar/search-dialog";
import { ThemeSwitcher } from "./_components/sidebar/theme-switcher";
import { UserMenu } from "./_components/sidebar/user-menu";

export default async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/v2/login");
  }

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";
  const [variant, collapsible, userData] = await Promise.all([
    getPreference("sidebar_variant"),
    getPreference("sidebar_collapsible"),
    prisma.user.findUnique({ where: { id: user.id }, select: { onboardingCompleted: true } }),
  ]);

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 68)",
        } as React.CSSProperties
      }
    >
      <AppSidebar user={user} variant={variant} collapsible={collapsible} />
      <OnboardingTour showTour={userData?.onboardingCompleted === false} />
      <SidebarInset
        className={cn(
          "[html[data-content-layout=centered]_&>*]:mx-auto",
          "[html[data-content-layout=centered]_&>*]:w-full",
          "[html[data-content-layout=centered]_&>*]:max-w-screen-2xl",
          "peer-data-[variant=inset]:border",
          "[--dashboard-header-height:--spacing(12)]",
          "min-w-0 overflow-x-clip",
        )}
      >
        <header
          className={cn(
            "flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12",
            "[html[data-navbar-style=sticky]_&]:sticky [html[data-navbar-style=sticky]_&]:top-0 [html[data-navbar-style=sticky]_&]:z-50 [html[data-navbar-style=sticky]_&]:overflow-hidden [html[data-navbar-style=sticky]_&]:rounded-t-[inherit] [html[data-navbar-style=sticky]_&]:bg-background/50 [html[data-navbar-style=sticky]_&]:backdrop-blur-md",
          )}
        >
          <div className="flex w-full items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-1 lg:gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="hidden data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-center md:mx-2 md:block"
              />
              <span className="hidden md:inline-flex" data-tour="search">
                <SearchDialog />
              </span>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <LayoutControls />
              <ThemeSwitcher />
              <Button asChild size="icon">
                <Link
                  prefetch={false}
                  href="https://github.com/arhamkhnz/next-shadcn-admin-dashboard"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open GitHub repository"
                >
                  <SimpleIcon icon={siGithub} className="fill-primary-foreground" />
                </Link>
              </Button>
              <UserMenu user={user} />
            </div>
            <Button asChild size="sm" className="md:hidden">
              <Link prefetch={false} href="/dashboard/projects/new">
                <PlusCircleIcon className="mr-1 size-4" />
                Create Project
              </Link>
            </Button>
          </div>
        </header>
        {/* Pages can set data-content-padding="false" to render full-bleed app layouts. */}
        <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden p-4 has-data-[content-padding=false]:p-0 md:p-6 md:has-data-[content-padding=false]:p-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

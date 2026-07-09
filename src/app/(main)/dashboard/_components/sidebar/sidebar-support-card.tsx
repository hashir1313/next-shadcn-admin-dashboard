import Link from "next/link";

import { siGithub, siX } from "simple-icons";

import { SimpleIcon } from "@/components/simple-icon";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SidebarSupportCard() {
  return (
    <Card size="sm" className="overflow-hidden shadow-none group-data-[collapsible=icon]:hidden">
      <CardHeader className="min-w-0 px-4">
        <CardTitle className="truncate text-sm">Found a Bug?</CardTitle>
        <CardDescription className="line-clamp-3">
          This project is currently in open beta, if you have found a bug open an issue on &nbsp;
          <Link
            href="https://github.com/hashir1313/traqqy/issues"
            target="_blank"
            rel="noreferrer"
            aria-label="Open an issue on Github"
            className="inline-flex items-center text-foreground"
          >
            <SimpleIcon icon={siGithub} aria-hidden className="size-3 fill-current" />
          </Link>
          .
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

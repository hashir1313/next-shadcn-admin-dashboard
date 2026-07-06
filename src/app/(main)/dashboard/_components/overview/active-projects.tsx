"use client";

import Link from "next/link";

import { ArrowRight, PlusCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Project {
  id: string;
  name: string;
  clientName: string | null;
  totalMilestones: number;
  completedMilestones: number;
  updatedAt: string;
}

interface ActiveProjectsProps {
  projects: Project[];
}

export function ActiveProjects({ projects }: ActiveProjectsProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-medium text-sm">Active Projects</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/projects">
            View all
            <ArrowRight className="ml-1 size-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Button asChild>
              <Link href="/dashboard/projects/new">
                <PlusCircleIcon className="mr-1 size-4" />
                Create Project
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => {
              const progress =
                project.totalMilestones > 0
                  ? Math.round((project.completedMilestones / project.totalMilestones) * 100)
                  : 0;

              return (
                <Link
                  key={project.id}
                  href={`/dashboard/projects/${project.id}`}
                  className="block space-y-2 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{project.name}</p>
                      {project.clientName && (
                        <p className="text-muted-foreground text-xs">Client: {project.clientName}</p>
                      )}
                    </div>
                    <span className="font-medium text-muted-foreground text-xs tabular-nums">
                      {project.completedMilestones}/{project.totalMilestones}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={progress} className="h-2 flex-1" />
                    <span className="font-medium text-muted-foreground text-xs tabular-nums">{progress}%</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

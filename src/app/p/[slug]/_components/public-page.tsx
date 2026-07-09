import { CheckCircle2, Circle, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PublicPageProps {
  project: {
    name: string;
    description: string | null;
    status: string;
    clientName: string | null;
    slug: string;
    updatedAt: string;
  };
  freelancer: {
    name: string;
    email: string;
    logoUrl: string | null;
    brandColor: string | null;
  };
  milestones: {
    id: string;
    title: string;
    description: string | null;
    status: string;
  }[];
  activity: {
    id: string;
    type: string;
    description: string;
    createdAt: string;
  }[];
  progress: number;
  stats: {
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
  };
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  draft: "secondary",
  completed: "outline",
  paused: "destructive",
};

const milestoneIcon: Record<string, typeof CheckCircle2> = {
  completed: CheckCircle2,
  in_progress: Clock,
  pending: Circle,
};

export function PublicPage({ project, freelancer, milestones, activity, progress, stats }: PublicPageProps) {
  const completed = milestones.filter((m) => m.status === "completed");
  const remaining = milestones.filter((m) => m.status !== "completed");

  const brandStyle = freelancer.brandColor
    ? ({ "--brand-color": freelancer.brandColor } as React.CSSProperties)
    : undefined;

  return (
    <div className="min-h-screen bg-muted/30" style={brandStyle}>
      <div className="mx-auto max-w-2xl space-y-8 p-4 py-12 md:p-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-2xl tracking-tight">{project.name}</h1>
            <Badge variant={statusVariant[project.status] ?? "secondary"}>{project.status}</Badge>
          </div>
          {project.description && <p className="text-muted-foreground text-sm">{project.description}</p>}
          <p className="text-muted-foreground text-xs">
            Last updated {new Date(project.updatedAt).toLocaleDateString()}
          </p>
        </div>

        {/* Freelancer Info */}
        <Card>
          <CardContent className="flex items-center justify-between">
            <div className="w-full flex items-center gap-3">
              <div className="relative w-fit aspect-square overflow-hidden rounded-[50%]">
                {freelancer.logoUrl ? (
                  // biome-ignore lint/performance/noImgElement: user-uploaded logo
                  <img src={freelancer.logoUrl} alt={`${freelancer.name} logo`} className="size-10 object-cover" />
                ) : null}
              </div>
              <div className="flex w-full flex-row justify-between">
                <p className="font-medium text-sm">{freelancer.name}</p>
                <p className="text-muted-foreground text-xs">{freelancer.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-end justify-between">
              <span className="font-semibold text-3xl">{progress}%</span>
              <span className="text-muted-foreground text-sm">
                {stats.completed} of {stats.total} milestones
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${progress}%`,
                  backgroundColor: freelancer.brandColor ?? "var(--color-primary)",
                }}
              />
            </div>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="size-3" style={{ color: freelancer.brandColor ?? "var(--color-primary)" }} />{" "}
                {stats.completed} completed
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-3 text-muted-foreground" /> {stats.inProgress} in progress
              </span>
              <span className="flex items-center gap-1">
                <Circle className="size-3 text-muted-foreground" /> {stats.pending} pending
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Completed Milestones */}
        {completed.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {completed.map((m) => {
                  const Icon = milestoneIcon[m.status];
                  return (
                    <div
                      key={m.id}
                      className="flex items-start gap-3 rounded-lg border p-3"
                      style={{
                        borderColor: freelancer.brandColor ? `${freelancer.brandColor}33` : undefined,
                        backgroundColor: freelancer.brandColor ? `${freelancer.brandColor}0d` : undefined,
                      }}
                    >
                      <Icon
                        className="mt-0.5 size-4 shrink-0"
                        style={{ color: freelancer.brandColor ?? "var(--color-primary)" }}
                      />
                      <div>
                        <p className="font-medium text-sm">{m.title}</p>
                        {m.description && <p className="text-muted-foreground text-xs">{m.description}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Remaining Milestones */}
        {remaining.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Remaining</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {remaining.map((m) => {
                  const Icon = milestoneIcon[m.status];
                  return (
                    <div key={m.id} className="flex items-start gap-3 rounded-lg border p-3">
                      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{m.title}</p>
                        {m.description && <p className="text-muted-foreground text-xs">{m.description}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Activity Timeline */}
        {activity.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activity.map((log, i) => (
                  <div key={log.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className="size-2 rounded-full"
                        style={{ backgroundColor: freelancer.brandColor ?? "var(--color-primary)" }}
                      />
                      {i < activity.length - 1 && <div className="w-px flex-1 bg-border" />}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm">{log.description}</p>
                      <p className="text-muted-foreground text-xs">
                        {new Date(log.createdAt).toLocaleDateString()} {new Date(log.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center text-muted-foreground text-xs">
          Powered by <strong>Traqqy</strong>
        </div>
      </div>
    </div>
  );
}

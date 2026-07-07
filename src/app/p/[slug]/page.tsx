import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import { PublicPage } from "./_components/public-page";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      milestones: { orderBy: { position: "asc" } },
      activityLog: { orderBy: { createdAt: "desc" }, take: 20 },
      user: { select: { name: true, email: true, logoUrl: true, brandColor: true } },
    },
  });

  if (!project) notFound();

  const totalMilestones = project.milestones.length;
  const completedMilestones = project.milestones.filter((m) => m.status === "completed").length;
  const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  return (
    <PublicPage
      project={{
        name: project.name,
        description: project.description,
        status: project.status,
        clientName: project.clientName,
        slug: project.slug,
        updatedAt: project.updatedAt.toISOString(),
      }}
      freelancer={{
        name: project.user.name,
        email: project.user.email,
        logoUrl: project.user.logoUrl,
        brandColor: project.user.brandColor,
      }}
      milestones={project.milestones.map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        status: m.status,
      }))}
      activity={project.activityLog.map((log) => ({
        id: log.id,
        type: log.type,
        description: log.description,
        createdAt: log.createdAt.toISOString(),
      }))}
      progress={progress}
      stats={{
        total: totalMilestones,
        completed: completedMilestones,
        pending: project.milestones.filter((m) => m.status === "pending").length,
        inProgress: project.milestones.filter((m) => m.status === "in_progress").length,
      }}
    />
  );
}

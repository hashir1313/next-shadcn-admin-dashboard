import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type RouteParams = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;

    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        milestones: { orderBy: { position: "asc" } },
        activityLog: { orderBy: { createdAt: "desc" }, take: 20 },
        user: { select: { name: true, email: true } },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const totalMilestones = project.milestones.length;
    const completedMilestones = project.milestones.filter((m) => m.status === "completed").length;
    const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

    return NextResponse.json({
      project: {
        name: project.name,
        description: project.description,
        status: project.status,
        clientName: project.clientName,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      },
      freelancer: {
        name: project.user.name,
        email: project.user.email,
      },
      milestones: project.milestones.map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        status: m.status,
        position: m.position,
      })),
      activity: project.activityLog.map((log) => ({
        id: log.id,
        type: log.type,
        description: log.description,
        createdAt: log.createdAt,
      })),
      progress,
      stats: {
        total: totalMilestones,
        completed: completedMilestones,
        pending: project.milestones.filter((m) => m.status === "pending").length,
        inProgress: project.milestones.filter((m) => m.status === "in_progress").length,
      },
    });
  } catch (error) {
    console.error("Failed to fetch public project:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

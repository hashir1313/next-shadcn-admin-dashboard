import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { updateMilestoneSchema } from "@/lib/validations/milestone";

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = updateMilestoneSchema.parse(body);

    const existing = await prisma.milestone.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: "Milestone not found" }, { status: 404 });
    }

    const milestone = await prisma.milestone.update({
      where: { id },
      data,
    });

    if (data.status && data.status !== existing.status) {
      await prisma.activityLog.create({
        data: {
          projectId: existing.projectId,
          type: "status_changed",
          description: `Milestone "${milestone.title}" status changed to ${data.status}`,
        },
      });

      if (data.status === "completed") {
        await prisma.activityLog.create({
          data: {
            projectId: existing.projectId,
            type: "milestone_completed",
            description: `Milestone "${milestone.title}" was completed`,
          },
        });
      }
    }

    return NextResponse.json(milestone);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.message }, { status: 400 });
    }
    console.error("Failed to update milestone:", error);
    return NextResponse.json({ error: "Failed to update milestone" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const milestone = await prisma.milestone.findUnique({ where: { id } });

    if (!milestone) {
      return NextResponse.json({ error: "Milestone not found" }, { status: 404 });
    }

    await prisma.milestone.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        projectId: milestone.projectId,
        type: "milestone_deleted",
        description: `Milestone "${milestone.title}" was deleted`,
      },
    });

    return NextResponse.json({ message: "Milestone deleted" });
  } catch (error) {
    console.error("Failed to delete milestone:", error);
    return NextResponse.json({ error: "Failed to delete milestone" }, { status: 500 });
  }
}

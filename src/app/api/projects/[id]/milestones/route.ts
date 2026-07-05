import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createMilestoneSchema } from "@/lib/validations/milestone";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const milestones = await prisma.milestone.findMany({
      where: { projectId: id },
      orderBy: { position: "asc" },
    });

    return NextResponse.json(milestones);
  } catch (error) {
    console.error("Failed to fetch milestones:", error);
    return NextResponse.json({ error: "Failed to fetch milestones" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = createMilestoneSchema.parse(body);

    const maxPosition = await prisma.milestone.findFirst({
      where: { projectId: id },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const milestone = await prisma.milestone.create({
      data: {
        ...data,
        projectId: id,
        position: (maxPosition?.position ?? -1) + 1,
      },
    });

    await prisma.activityLog.create({
      data: {
        projectId: id,
        type: "milestone_created",
        description: `Milestone "${milestone.title}" was created`,
      },
    });

    return NextResponse.json(milestone, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.message }, { status: 400 });
    }
    console.error("Failed to create milestone:", error);
    return NextResponse.json({ error: "Failed to create milestone" }, { status: 500 });
  }
}

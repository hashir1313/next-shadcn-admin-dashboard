import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { reorderMilestonesSchema } from "@/lib/validations/milestone";

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = reorderMilestonesSchema.parse(body);

    const milestone = await prisma.milestone.findUnique({ where: { id } });

    if (!milestone) {
      return NextResponse.json({ error: "Milestone not found" }, { status: 404 });
    }

    await prisma.$transaction(
      data.milestoneIds.map((milestoneId, index) =>
        prisma.milestone.update({
          where: { id: milestoneId },
          data: { position: index },
        }),
      ),
    );

    const milestones = await prisma.milestone.findMany({
      where: { projectId: milestone.projectId },
      orderBy: { position: "asc" },
    });

    return NextResponse.json(milestones);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.message }, { status: 400 });
    }
    console.error("Failed to reorder milestones:", error);
    return NextResponse.json({ error: "Failed to reorder milestones" }, { status: 500 });
  }
}

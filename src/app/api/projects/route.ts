import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createProjectSchema } from "@/lib/validations/project";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        _count: { select: { milestones: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = createProjectSchema.parse(body);

    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const existingSlug = await prisma.project.findUnique({ where: { slug } });
    const uniqueSlug = existingSlug ? `${slug}-${Date.now()}` : slug;

    const project = await prisma.project.create({
      data: {
        ...data,
        slug: uniqueSlug,
        userId: "00000000-0000-0000-0000-000000000000",
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.message }, { status: 400 });
    }
    console.error("Failed to create project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

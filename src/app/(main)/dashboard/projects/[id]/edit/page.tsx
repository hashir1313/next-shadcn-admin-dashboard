import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import { BackButton } from "../../../_components/back-button";
import { EditProjectForm } from "../../_components/edit-project-form";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const project = await prisma.project.findUnique({ where: { id } });

  if (!project) notFound();

  const milestones = await prisma.milestone.findMany({
    where: { projectId: id },
    orderBy: { position: "asc" },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <BackButton />
        <div>
          <h2 className="font-medium text-2xl tracking-tight">Edit Project</h2>
          <p className="text-muted-foreground text-sm">Update project details and milestones.</p>
        </div>
      </div>
      <EditProjectForm project={project} milestones={milestones} />
    </div>
  );
}

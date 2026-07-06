import { BackButton } from "../../_components/back-button";
import { CreateProjectForm } from "../_components/create-project-form";

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <BackButton />
        <div>
          <h2 className="font-medium text-2xl tracking-tight">New Project</h2>
          <p className="text-muted-foreground text-sm">Create a new project to track milestones and share progress.</p>
        </div>
      </div>
      <CreateProjectForm />
    </div>
  );
}

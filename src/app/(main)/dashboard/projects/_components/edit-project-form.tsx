"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Trash2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be 100 characters or less"),
  description: z.string().max(500, "Description must be 500 characters or less").optional(),
  status: z.enum(["draft", "active", "paused", "completed"]),
  clientName: z.string().max(100, "Client name must be 100 characters or less").optional(),
  clientEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
});

interface ExistingMilestone {
  id: string;
  title: string;
  description: string | null;
  status: string;
  position: number;
}

interface NewMilestone {
  title: string;
  description: string;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  clientName: string | null;
  clientEmail: string | null;
}

interface EditProjectFormProps {
  project: Project;
  milestones: ExistingMilestone[];
}

export function EditProjectForm({ project, milestones: initialMilestones }: EditProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [existingMilestones, setExistingMilestones] = useState<ExistingMilestone[]>(initialMilestones);
  const [newMilestones, setNewMilestones] = useState<NewMilestone[]>([]);
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [editingMilestone, setEditingMilestone] = useState<{ title: string; description: string }>({
    title: "",
    description: "",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: project.name,
      description: project.description ?? "",
      status: project.status as "draft" | "active" | "paused" | "completed",
      clientName: project.clientName ?? "",
      clientEmail: project.clientEmail ?? "",
    },
  });

  function addNewMilestone() {
    setNewMilestones((prev) => [...prev, { title: "", description: "" }]);
  }

  function removeNewMilestone(index: number) {
    setNewMilestones((prev) => prev.filter((_, i) => i !== index));
  }

  function updateNewMilestone(index: number, field: "title" | "description", value: string) {
    setNewMilestones((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)));
  }

  function startEditMilestone(milestone: ExistingMilestone) {
    setEditingMilestoneId(milestone.id);
    setEditingMilestone({
      title: milestone.title,
      description: milestone.description ?? "",
    });
  }

  function cancelEditMilestone() {
    setEditingMilestoneId(null);
    setEditingMilestone({ title: "", description: "" });
  }

  async function saveEditMilestone(milestoneId: string) {
    try {
      const response = await fetch(`/api/milestones/${milestoneId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingMilestone.title,
          description: editingMilestone.description || undefined,
        }),
      });

      if (!response.ok) throw new Error("Failed to update milestone");

      const updated = await response.json();
      setExistingMilestones((prev) => prev.map((m) => (m.id === milestoneId ? { ...m, ...updated } : m)));
      cancelEditMilestone();
      toast.success("Milestone updated");
    } catch {
      toast.error("Failed to update milestone");
    }
  }

  async function deleteExistingMilestone(milestoneId: string) {
    try {
      const response = await fetch(`/api/milestones/${milestoneId}`, { method: "DELETE" });

      if (!response.ok) throw new Error("Failed to delete milestone");

      setExistingMilestones((prev) => prev.filter((m) => m.id !== milestoneId));
      toast.success("Milestone deleted");
    } catch {
      toast.error("Failed to delete milestone");
    }
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update project");

      for (const milestone of newMilestones) {
        if (!milestone.title.trim()) continue;
        await fetch(`/api/projects/${project.id}/milestones`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: milestone.title,
            description: milestone.description || undefined,
          }),
        });
      }

      toast.success("Project updated");
      router.push(`/dashboard/projects/${project.id}`);
      router.refresh();
    } catch {
      toast.error("Failed to update project");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Project</CardTitle>
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup className="gap-4">
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="project-name">Project Name *</FieldLabel>
                  <Input
                    {...field}
                    id="project-name"
                    placeholder="My awesome project"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="project-description">Description</FieldLabel>
                  <Textarea
                    {...field}
                    id="project-description"
                    placeholder="Brief description of the project"
                    rows={3}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="status"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel>Status</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="clientName"
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="client-name">Client Name</FieldLabel>
                    <Input {...field} id="client-name" placeholder="Client name" aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="clientEmail"
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="client-email">Client Email</FieldLabel>
                    <Input
                      {...field}
                      id="client-email"
                      type="email"
                      placeholder="client@example.com"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">Milestones</h3>
              <Button type="button" variant="outline" size="sm" onClick={addNewMilestone}>
                Add Milestone
              </Button>
            </div>

            {existingMilestones.length > 0 && (
              <div className="space-y-2">
                {existingMilestones.map((milestone) => (
                  <div key={milestone.id} className="space-y-2 rounded-lg border p-3">
                    {editingMilestoneId === milestone.id ? (
                      <div className="space-y-2">
                        <Input
                          placeholder="Milestone title"
                          value={editingMilestone.title}
                          onChange={(e) => setEditingMilestone((prev) => ({ ...prev, title: e.target.value }))}
                        />
                        <Textarea
                          placeholder="Optional description"
                          value={editingMilestone.description}
                          onChange={(e) => setEditingMilestone((prev) => ({ ...prev, description: e.target.value }))}
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <Button type="button" size="sm" onClick={() => saveEditMilestone(milestone.id)}>
                            Save
                          </Button>
                          <Button type="button" size="sm" variant="ghost" onClick={cancelEditMilestone}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm">{milestone.title}</p>
                          {milestone.description && (
                            <p className="mt-0.5 text-muted-foreground text-xs">{milestone.description}</p>
                          )}
                        </div>
                        <div className="flex shrink-0 gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => startEditMilestone(milestone)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteExistingMilestone(milestone.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {newMilestones.length > 0 && (
              <div className="space-y-2">
                {newMilestones.map((milestone, index) => (
                  <div key={index} className="space-y-2 rounded-lg border p-3">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="Milestone title"
                          value={milestone.title}
                          onChange={(e) => updateNewMilestone(index, "title", e.target.value)}
                        />
                        <Textarea
                          placeholder="Optional description"
                          value={milestone.description}
                          onChange={(e) => updateNewMilestone(index, "description", e.target.value)}
                          rows={2}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="mt-0.5 shrink-0"
                        onClick={() => removeNewMilestone(index)}
                      >
                        &times;
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {existingMilestones.length === 0 && newMilestones.length === 0 && (
              <p className="py-2 text-center text-muted-foreground text-sm">
                No milestones yet. Add one to get started.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

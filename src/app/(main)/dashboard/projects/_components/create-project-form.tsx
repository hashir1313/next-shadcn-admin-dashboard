"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be 100 characters or less"),
  description: z.string().max(500, "Description must be 500 characters or less").optional(),
  clientName: z.string().max(100, "Client name must be 100 characters or less").optional(),
  clientEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
});

interface MilestoneEntry {
  title: string;
  description: string;
}

export function CreateProjectForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [milestones, setMilestones] = useState<MilestoneEntry[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      clientName: "",
      clientEmail: "",
    },
  });

  function addMilestone() {
    setMilestones((prev) => [...prev, { title: "", description: "" }]);
  }

  function removeMilestone(index: number) {
    setMilestones((prev) => prev.filter((_, i) => i !== index));
  }

  function updateMilestone(index: number, field: "title" | "description", value: string) {
    setMilestones((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)));
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create project");

      const project = await response.json();

      for (const milestone of milestones) {
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

      toast.success("Project created");
      router.push(`/dashboard/projects/${project.id}`);
      router.refresh();
    } catch {
      toast.error("Failed to create project");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Details</CardTitle>
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
              <Button type="button" variant="outline" size="sm" onClick={addMilestone}>
                Add Milestone
              </Button>
            </div>
            {milestones.length > 0 && (
              <div className="space-y-3">
                {milestones.map((milestone, index) => (
                  <div key={index} className="space-y-2 rounded-lg border p-3">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="Milestone title"
                          value={milestone.title}
                          onChange={(e) => updateMilestone(index, "title", e.target.value)}
                        />
                        <Textarea
                          placeholder="Optional description"
                          value={milestone.description}
                          onChange={(e) => updateMilestone(index, "description", e.target.value)}
                          rows={2}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="mt-0.5 shrink-0"
                        onClick={() => removeMilestone(index)}
                      >
                        &times;
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

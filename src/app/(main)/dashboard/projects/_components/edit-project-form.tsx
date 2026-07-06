"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { zodResolver } from "@hookform/resolvers/zod";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
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
  tempId: string;
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

function SortableExistingMilestoneRow({
  milestone,
  isEditing,
  editTitle,
  editDescription,
  onEditTitleChange,
  onEditDescriptionChange,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
}: {
  milestone: ExistingMilestone;
  isEditing: boolean;
  editTitle: string;
  editDescription: string;
  onEditTitleChange: (v: string) => void;
  onEditDescriptionChange: (v: string) => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: milestone.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="space-y-2 rounded-lg border p-3">
      {isEditing ? (
        <div className="space-y-2">
          <Input placeholder="Milestone title" value={editTitle} onChange={(e) => onEditTitleChange(e.target.value)} />
          <Textarea
            placeholder="Optional description"
            value={editDescription}
            onChange={(e) => onEditDescriptionChange(e.target.value)}
            rows={2}
          />
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={onSaveEdit}>
              Save
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={onCancelEdit}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-2">
          <button
            className="mt-2 cursor-grab touch-none text-muted-foreground hover:text-foreground"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="size-4" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm">{milestone.title}</p>
            {milestone.description && <p className="mt-0.5 text-muted-foreground text-xs">{milestone.description}</p>}
          </div>
          <div className="flex shrink-0 gap-1">
            <Button type="button" variant="ghost" size="icon" onClick={onStartEdit}>
              <Pencil className="size-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" onClick={onDelete}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function SortableNewMilestoneRow({
  milestone,
  onUpdate,
  onRemove,
}: {
  milestone: NewMilestone;
  onUpdate: (field: "title" | "description", value: string) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: milestone.tempId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-start gap-2 rounded-lg border p-3">
      <button
        className="mt-2 cursor-grab touch-none text-muted-foreground hover:text-foreground"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>
      <div className="flex-1 space-y-2">
        <Input
          placeholder="Milestone title"
          value={milestone.title}
          onChange={(e) => onUpdate("title", e.target.value)}
        />
        <Textarea
          placeholder="Optional description"
          value={milestone.description}
          onChange={(e) => onUpdate("description", e.target.value)}
          rows={2}
        />
      </div>
      <Button type="button" variant="ghost" size="icon" className="mt-0.5 shrink-0" onClick={onRemove}>
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const allMilestoneIds = [...existingMilestones.map((m) => m.id), ...newMilestones.map((m) => m.tempId)];

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
    setNewMilestones((prev) => [...prev, { tempId: `temp-${crypto.randomUUID()}`, title: "", description: "" }]);
  }

  function removeNewMilestone(tempId: string) {
    setNewMilestones((prev) => prev.filter((m) => m.tempId !== tempId));
  }

  function updateNewMilestone(tempId: string, field: "title" | "description", value: string) {
    setNewMilestones((prev) => prev.map((m) => (m.tempId === tempId ? { ...m, [field]: value } : m)));
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

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeIsExisting = existingMilestones.some((m) => m.id === active.id);
    const overIsExisting = existingMilestones.some((m) => m.id === over.id);

    if (activeIsExisting && overIsExisting) {
      const oldIndex = existingMilestones.findIndex((m) => m.id === active.id);
      const newIndex = existingMilestones.findIndex((m) => m.id === over.id);

      const newItems = [...existingMilestones];
      const [moved] = newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, moved);
      setExistingMilestones(newItems);

      try {
        await fetch(`/api/milestones/${active.id}/reorder`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ milestoneIds: newItems.map((m) => m.id) }),
        });
      } catch {
        toast.error("Failed to reorder milestones");
        setExistingMilestones(initialMilestones);
      }
    } else if (!activeIsExisting && !overIsExisting) {
      const oldIndex = newMilestones.findIndex((m) => m.tempId === active.id);
      const newIndex = newMilestones.findIndex((m) => m.tempId === over.id);

      const newItems = [...newMilestones];
      const [moved] = newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, moved);
      setNewMilestones(newItems);
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

            {(existingMilestones.length > 0 || newMilestones.length > 0) && (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={allMilestoneIds} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {existingMilestones.map((milestone) => (
                      <SortableExistingMilestoneRow
                        key={milestone.id}
                        milestone={milestone}
                        isEditing={editingMilestoneId === milestone.id}
                        editTitle={editingMilestone.title}
                        editDescription={editingMilestone.description}
                        onEditTitleChange={(v) => setEditingMilestone((prev) => ({ ...prev, title: v }))}
                        onEditDescriptionChange={(v) => setEditingMilestone((prev) => ({ ...prev, description: v }))}
                        onStartEdit={() => startEditMilestone(milestone)}
                        onCancelEdit={cancelEditMilestone}
                        onSaveEdit={() => saveEditMilestone(milestone.id)}
                        onDelete={() => deleteExistingMilestone(milestone.id)}
                      />
                    ))}
                    {newMilestones.map((milestone) => (
                      <SortableNewMilestoneRow
                        key={milestone.tempId}
                        milestone={milestone}
                        onUpdate={(field, value) => updateNewMilestone(milestone.tempId, field, value)}
                        onRemove={() => removeNewMilestone(milestone.tempId)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
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

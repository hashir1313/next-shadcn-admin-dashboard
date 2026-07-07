"use client";

import { useRef, useState } from "react";

import { ImagePlus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface BrandingSettingsProps {
  logoUrl: string | null;
  brandColor: string | null;
}

export function BrandingSettings({ logoUrl: initialLogoUrl, brandColor: initialBrandColor }: BrandingSettingsProps) {
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl);
  const [brandColor, setBrandColor] = useState(initialBrandColor ?? "#6366f1");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleLogoUpload(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/settings/logo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to upload logo");
      }

      const data = await response.json();
      setLogoUrl(data.logoUrl);
      toast.success("Logo uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload logo");
    } finally {
      setUploading(false);
    }
  }

  async function handleLogoDelete() {
    try {
      const response = await fetch("/api/settings/logo", { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to remove logo");
      setLogoUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success("Logo removed");
    } catch {
      toast.error("Failed to remove logo");
    }
  }

  async function handleSaveColor() {
    setSaving(true);
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandColor }),
      });

      if (!response.ok) throw new Error("Failed to save");
      toast.success("Brand color saved");
    } catch {
      toast.error("Failed to save brand color");
    } finally {
      setSaving(false);
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) void handleLogoUpload(file);
  }

  return (
    <div className="space-y-6">
      {/* Logo Upload */}
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div className="space-y-0.5">
          <FieldLabel className="font-medium text-sm">Logo</FieldLabel>
          <p className="text-muted-foreground text-xs">Upload a logo to display on your public pages.</p>
        </div>
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                {/* biome-ignore lint/performance/noImgElement: user-uploaded logo */}
                <img src={logoUrl} alt="Logo" className="size-full object-contain" />
              </div>
              <Button variant="ghost" size="icon-sm" onClick={handleLogoDelete} aria-label="Remove logo">
                <Trash2 className="text-muted-foreground" />
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              <ImagePlus className="mr-2 size-4" />
              {uploading ? "Uploading..." : "Upload Logo"}
            </Button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <Separator />

      {/* Brand Color */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-0.5">
          <FieldLabel className="font-medium text-sm">Accent Color</FieldLabel>
          <p className="text-muted-foreground text-xs">
            Choose a color for progress bars and accents on your public pages.
          </p>
        </div>
        <FieldGroup>
          <div className="flex items-end gap-2">
            <input
              type="color"
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              className="size-8 cursor-pointer rounded-md border bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded-md"
            />
            <Input
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              className="h-8 w-24 font-mono text-xs"
              maxLength={7}
            />
            <Button
              size="sm"
              onClick={handleSaveColor}
              disabled={saving || brandColor === initialBrandColor}
              style={{ backgroundColor: brandColor, color: "#fff" }}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </FieldGroup>
      </div>
    </div>
  );
}

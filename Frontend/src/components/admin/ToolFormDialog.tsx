import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/context/AppContext";
import {
  CATEGORIES as categories,
  PRICING_MODELS as pricingModels,
} from "@/lib/constants";
import { AITool, Category, PricingModel } from "@/types";
import { toast } from "sonner";

interface ToolFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tool?: AITool;
}

export function ToolFormDialog({
  open,
  onOpenChange,
  tool,
}: ToolFormDialogProps) {
  const { addTool, updateTool } = useApp();
  const isEditing = !!tool;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    useCase: "",
    category: "" as Category | "",
    pricingModel: "" as PricingModel | "",
    website: "",
  });

  useEffect(() => {
    if (tool) {
      setFormData({
        name: tool.name,
        description: tool.description,
        useCase: tool.useCase,
        category: tool.category,
        pricingModel: tool.pricingModel,
        website: tool.website || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        useCase: "",
        category: "",
        pricingModel: "",
        website: "",
      });
    }
  }, [tool, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.useCase.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.category || !formData.pricingModel) {
      toast.error("Please select category and pricing model");
      return;
    }

    if (isEditing && tool) {
      updateTool(tool.id, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        useCase: formData.useCase.trim(),
        category: formData.category as Category,
        pricingModel: formData.pricingModel as PricingModel,
        website: formData.website.trim() || undefined,
      });
      toast.success("Tool updated successfully!");
    } else {
      addTool({
        name: formData.name.trim(),
        description: formData.description.trim(),
        useCase: formData.useCase.trim(),
        category: formData.category as Category,
        pricingModel: formData.pricingModel as PricingModel,
        website: formData.website.trim() || undefined,
      });
      toast.success("Tool added successfully!");
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Tool" : "Add New Tool"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tool Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., GitHub Copilot"
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief description of the tool..."
              rows={3}
              maxLength={500}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="useCase">Use Case *</Label>
            <Input
              id="useCase"
              value={formData.useCase}
              onChange={(e) =>
                setFormData({ ...formData, useCase: e.target.value })
              }
              placeholder="e.g., Content creation, customer support"
              maxLength={200}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value as Category })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Pricing *</Label>
              <Select
                value={formData.pricingModel}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    pricingModel: value as PricingModel,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select pricing" />
                </SelectTrigger>
                <SelectContent>
                  {pricingModels.map((pricing) => (
                    <SelectItem key={pricing} value={pricing}>
                      {pricing}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website URL</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              placeholder="https://..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {isEditing ? "Save Changes" : "Add Tool"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

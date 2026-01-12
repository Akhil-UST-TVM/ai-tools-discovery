import { X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/context/AppContext";
import {
  CATEGORIES as categories,
  PRICING_MODELS as pricingModels,
} from "@/lib/constants";
import { Category, PricingModel } from "@/types";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  className?: string;
  onClose?: () => void;
}

export function FilterSidebar({ className, onClose }: FilterSidebarProps) {
  const { filters, setFilters } = useApp();

  const handleCategoryChange = (category: Category, checked: boolean) => {
    setFilters({
      ...filters,
      categories: checked
        ? [...filters.categories, category]
        : filters.categories.filter((c) => c !== category),
    });
  };

  const handlePricingChange = (pricing: PricingModel, checked: boolean) => {
    setFilters({
      ...filters,
      pricingModels: checked
        ? [...filters.pricingModels, pricing]
        : filters.pricingModels.filter((p) => p !== pricing),
    });
  };

  const handleRatingChange = (value: number[]) => {
    setFilters({ ...filters, minRating: value[0] });
  };

  const handleReset = () => {
    setFilters({
      categories: [],
      pricingModels: [],
      minRating: 0,
      searchQuery: "",
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.pricingModels.length > 0 ||
    filters.minRating > 0;

  return (
    <aside className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold">Filters</h2>
        <div className="flex gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
          )}
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <Separator />

      {/* Categories */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Category</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center gap-2">
              <Checkbox
                id={`category-${category}`}
                checked={filters.categories.includes(category)}
                onCheckedChange={(checked) =>
                  handleCategoryChange(category, checked as boolean)
                }
              />
              <Label
                htmlFor={`category-${category}`}
                className="text-sm font-normal cursor-pointer"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Pricing */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Pricing</h3>
        <div className="space-y-2">
          {pricingModels.map((pricing) => (
            <div key={pricing} className="flex items-center gap-2">
              <Checkbox
                id={`pricing-${pricing}`}
                checked={filters.pricingModels.includes(pricing)}
                onCheckedChange={(checked) =>
                  handlePricingChange(pricing, checked as boolean)
                }
              />
              <Label
                htmlFor={`pricing-${pricing}`}
                className="text-sm font-normal cursor-pointer"
              >
                {pricing}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Minimum Rating */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Minimum Rating</h3>
          <span className="text-sm text-muted-foreground">
            {filters.minRating > 0 ? `${filters.minRating}+` : "Any"}
          </span>
        </div>
        <Slider
          value={[filters.minRating]}
          onValueChange={handleRatingChange}
          max={5}
          step={0.5}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>5</span>
        </div>
      </div>
    </aside>
  );
}

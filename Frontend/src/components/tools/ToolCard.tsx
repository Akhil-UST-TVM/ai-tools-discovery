import { useNavigate } from "react-router-dom";
import { ExternalLink, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AITool } from "@/types";
import { StarRating } from "./StarRating";
import { CategoryBadge } from "./CategoryBadge";
import { PricingBadge } from "./PricingBadge";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  tool: AITool;
  index?: number;
}

export function ToolCard({ tool, index = 0 }: ToolCardProps) {
  return (
    <Card
      className={cn(
        "group gradient-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1",
        "animate-slide-up w-full"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary font-heading font-bold text-lg">
            {tool.name.charAt(0)}
          </div>
          <div className="flex gap-1.5">
            <CategoryBadge category={tool.category} />
            <PricingBadge pricing={tool.pricingModel} />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="font-heading text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
            {tool.name}
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
            {tool.description}
          </p>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex items-center gap-3">
          <StarRating rating={tool.averageRating} size="sm" showValue />
          <span className="text-xs text-muted-foreground">
            ({tool.totalReviews} reviews)
          </span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          <span className="font-medium">Use case:</span> {tool.useCase}
        </p>
      </CardContent>

      <CardFooter className="gap-2 pt-0">
        <ViewButton tool={tool} />

        {/* Review button opens a popup dialog with the review form */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Review
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Write a review for {tool.name}</DialogTitle>
            </DialogHeader>
            <div className="mt-2">
              <ReviewForm toolId={String(tool.id)} />
            </div>
          </DialogContent>
        </Dialog>

        {tool.website && (
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={() => window.open(tool.website, "_blank")}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function ViewButton({ tool }: { tool: AITool }) {
  const navigate = useNavigate();

  function handleClick() {
    // primary: use tool.website
    const primary = tool.website;
    // fallback: if no website, navigate to tool detail page (backend is canonical)
    const url = primary;

    if (url) {
      window.open(url, "_blank");
    } else {
      navigate(`/tool/${tool.id}`);
    }
  }

  return (
    <div className="flex-1">
      <Button
        variant="default"
        size="sm"
        className="w-full gap-2"
        onClick={handleClick}
      >
        <MessageSquare className="h-4 w-4" />
        View
      </Button>
    </div>
  );
}

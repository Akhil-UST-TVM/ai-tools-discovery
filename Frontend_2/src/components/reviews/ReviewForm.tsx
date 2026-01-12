import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarRating } from "@/components/tools/StarRating";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { postReview } from "@/lib/api";

interface ReviewFormProps {
  toolId: string;
}

export function ReviewForm({ toolId }: ReviewFormProps) {
  const { addReview } = useApp();
  const { token, user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userName, setUserName] = useState(user?.username ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!userName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setIsSubmitting(true);

    // Attempt to post review to backend if token exists
    try {
      const body: any = {
        rating,
        comment: comment.trim() || undefined,
      };

      const authToken =
        token || window.localStorage.getItem("authToken") || undefined;

      if (authToken) {
        // backend expects POST /api/reviews/{tool_id}
        await postReview(toolId, body, authToken);
        toast.success("Review submitted! It will appear after admin approval.");
      } else {
        // fallback to local state when not authenticated
        addReview({
          toolId,
          userId: `user-${Date.now()}`,
          userName: userName.trim(),
          rating,
          comment: comment.trim() || undefined,
        });
        toast.success(
          "Review submitted locally! It will appear after admin approval."
        );
      }
    } catch (err) {
      // on error, fallback to local add
      addReview({
        toolId,
        userId: `user-${Date.now()}`,
        userName: userName.trim(),
        rating,
        comment: comment.trim() || undefined,
      });
      toast.success("Review submitted locally (backend failed).");
    } finally {
      setRating(0);
      setComment("");
      setUserName("");
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userName">Your Name</Label>
            <Input
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label>Rating</Label>
            <StarRating
              rating={rating}
              size="lg"
              interactive
              onRatingChange={setRating}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comment (Optional)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this tool..."
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {comment.length}/500
            </p>
          </div>

          <Button
            type="submit"
            className="w-full gap-2"
            disabled={isSubmitting || rating === 0 || !userName.trim()}
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

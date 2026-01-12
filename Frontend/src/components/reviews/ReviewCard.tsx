import { formatDistanceToNow } from 'date-fns';
import { User } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Review } from '@/types';
import { StarRating } from '@/components/tools/StarRating';

interface ReviewCardProps {
  review: Review;
  showStatus?: boolean;
}

export function ReviewCard({ review, showStatus = false }: ReviewCardProps) {
  const statusVariant = {
    pending: 'pending',
    approved: 'approved',
    rejected: 'rejected',
  } as const;

  return (
    <Card className="gradient-card shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">{review.userName}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StarRating rating={review.rating} size="sm" />
            {showStatus && (
              <Badge variant={statusVariant[review.status]} className="capitalize">
                {review.status}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      {review.comment && (
        <CardContent className="pt-2">
          <p className="text-sm text-muted-foreground">{review.comment}</p>
        </CardContent>
      )}
    </Card>
  );
}

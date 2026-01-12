import { Check, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/context/AppContext';
import { StarRating } from '@/components/tools/StarRating';
import { toast } from 'sonner';

export function AdminReviewsTable() {
  const { reviews, tools, approveReview, rejectReview } = useApp();

  const pendingReviews = reviews.filter(r => r.status === 'pending');
  const approvedReviews = reviews.filter(r => r.status === 'approved');
  const rejectedReviews = reviews.filter(r => r.status === 'rejected');

  const getToolName = (toolId: string) => {
    const tool = tools.find(t => t.id === toolId);
    return tool?.name || 'Unknown Tool';
  };

  const handleApprove = (reviewId: string) => {
    approveReview(reviewId);
    toast.success('Review approved! Tool rating has been updated.');
  };

  const handleReject = (reviewId: string) => {
    rejectReview(reviewId);
    toast.success('Review rejected.');
  };

  const statusVariant = {
    pending: 'pending',
    approved: 'approved',
    rejected: 'rejected',
  } as const;

  const renderTable = (reviewList: typeof reviews, showActions = false) => (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tool</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            {showActions && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviewList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showActions ? 7 : 6} className="text-center text-muted-foreground py-8">
                No reviews found
              </TableCell>
            </TableRow>
          ) : (
            reviewList.map(review => (
              <TableRow key={review.id}>
                <TableCell className="font-medium">{getToolName(review.toolId)}</TableCell>
                <TableCell>{review.userName}</TableCell>
                <TableCell>
                  <StarRating rating={review.rating} size="sm" />
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {review.comment || '-'}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[review.status]} className="capitalize">
                    {review.status}
                  </Badge>
                </TableCell>
                {showActions && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleApprove(review.id)}
                        className="text-success hover:text-success hover:bg-success/10"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleReject(review.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-xl font-semibold">Moderate Reviews</h2>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            Pending
            {pendingReviews.length > 0 && (
              <Badge variant="pending" className="ml-1 h-5 w-5 p-0 justify-center">
                {pendingReviews.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedReviews.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedReviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          {renderTable(pendingReviews, true)}
        </TabsContent>

        <TabsContent value="approved" className="mt-4">
          {renderTable(approvedReviews)}
        </TabsContent>

        <TabsContent value="rejected" className="mt-4">
          {renderTable(rejectedReviews)}
        </TabsContent>
      </Tabs>
    </div>
  );
}

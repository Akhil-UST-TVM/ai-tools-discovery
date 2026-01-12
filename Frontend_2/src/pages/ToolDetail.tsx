import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/layout/Header';
import { StarRating } from '@/components/tools/StarRating';
import { CategoryBadge } from '@/components/tools/CategoryBadge';
import { PricingBadge } from '@/components/tools/PricingBadge';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { useApp } from '@/context/AppContext';

export default function ToolDetail() {
  const { id } = useParams<{ id: string }>();
  const { getToolById, getReviewsForTool } = useApp();

  const tool = getToolById(id || '');
  const reviews = getReviewsForTool(id || '').filter(r => r.status === 'approved');

  if (!tool) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16 text-center">
          <h1 className="font-heading text-2xl font-bold">Tool not found</h1>
          <p className="mt-2 text-muted-foreground">
            The tool you're looking for doesn't exist.
          </p>
          <Link to="/">
            <Button className="mt-6">Back to Home</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Tools
          </Button>
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Tool Details */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border bg-card p-6 md:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary font-heading font-bold text-2xl">
                    {tool.name.charAt(0)}
                  </div>
                  <div>
                    <h1 className="font-heading text-2xl font-bold md:text-3xl">
                      {tool.name}
                    </h1>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <CategoryBadge category={tool.category} />
                      <PricingBadge pricing={tool.pricingModel} />
                    </div>
                  </div>
                </div>
                {tool.website && (
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => window.open(tool.website, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Visit Website
                  </Button>
                )}
              </div>

              <Separator className="my-6" />

              <div className="space-y-6">
                <div>
                  <h2 className="font-heading text-lg font-semibold">Description</h2>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div>
                  <h2 className="font-heading text-lg font-semibold">Use Cases</h2>
                  <p className="mt-2 text-muted-foreground">{tool.useCase}</p>
                </div>

                <div className="flex flex-wrap gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Rating</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <StarRating rating={tool.averageRating} size="md" showValue />
                      <span className="text-sm text-muted-foreground">
                        ({tool.totalReviews} reviews)
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Added</h3>
                    <div className="mt-1 flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {formatDistanceToNow(new Date(tool.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="mt-8">
              <h2 className="font-heading text-xl font-semibold">
                Reviews ({reviews.length})
              </h2>
              {reviews.length > 0 ? (
                <div className="mt-4 space-y-4">
                  {reviews.map(review => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-xl border bg-card py-12 text-center">
                  <p className="text-muted-foreground">
                    No reviews yet. Be the first to share your experience!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Review Form Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ReviewForm toolId={tool.id} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

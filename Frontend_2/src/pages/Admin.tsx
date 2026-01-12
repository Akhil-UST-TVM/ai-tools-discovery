import { Navigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { AdminToolsTable } from '@/components/admin/AdminToolsTable';
import { AdminReviewsTable } from '@/components/admin/AdminReviewsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/context/AppContext';
import { Wrench, MessageSquare, LayoutDashboard } from 'lucide-react';

export default function Admin() {
  const { isAdmin, tools, reviews } = useApp();

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const pendingReviewsCount = reviews.filter(r => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
              <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold md:text-3xl">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage AI tools and moderate user reviews
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Wrench className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{tools.length}</p>
                <p className="text-sm text-muted-foreground">Total Tools</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <MessageSquare className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {reviews.filter(r => r.status === 'approved').length}
                </p>
                <p className="text-sm text-muted-foreground">Approved Reviews</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pending/10">
                <MessageSquare className="h-5 w-5 text-pending" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingReviewsCount}</p>
                <p className="text-sm text-muted-foreground">Pending Reviews</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="tools" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="tools" className="gap-2">
              <Wrench className="h-4 w-4" />
              Tools
            </TabsTrigger>
            <TabsTrigger value="reviews" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Reviews
              {pendingReviewsCount > 0 && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-pending text-xs text-pending-foreground">
                  {pendingReviewsCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tools">
            <AdminToolsTable />
          </TabsContent>

          <TabsContent value="reviews">
            <AdminReviewsTable />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

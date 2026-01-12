import { useState } from 'react';
import { Filter, Bot, Sparkles, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Header } from '@/components/layout/Header';
import { FilterSidebar } from '@/components/filters/FilterSidebar';
import { SearchBar } from '@/components/filters/SearchBar';
import { ToolCard } from '@/components/tools/ToolCard';
import { useApp } from '@/context/AppContext';

export default function Index() {
  const { getFilteredTools, filters } = useApp();
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const filteredTools = getFilteredTools();

  const activeFiltersCount =
    filters.categories.length +
    filters.pricingModels.length +
    (filters.minRating > 0 ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero py-16 md:py-24">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        </div>
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary-foreground/80">
              <Sparkles className="h-4 w-4" />
              Start here
            </div>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-primary-foreground md:text-5xl lg:text-6xl hero-shimmer">
              Find the right <span className="text-accent">AI</span> for your team — fast
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/70">
              Explore, compare, and choose from community-rated AI tools built for real teams.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-sm text-primary-foreground/60">
                <Bot className="h-4 w-4" />
                <span>100+ tools</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/60">
                <Shield className="h-4 w-4" />
                <span>Community-reviewed</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/60">
                <Zap className="h-4 w-4" />
                <span>Always up to date</span>
              </div>
            </div>
          </div>
        </div>
        {/* animated orbs behind the hero */}
        <div className="orb-wrap" aria-hidden>
          <div className="orb" style={{ width: 360, height: 360, top: -80, left: -60, background: 'radial-gradient(circle at 30% 30%, rgba(0,160,160,0.22), rgba(0,120,120,0.06))' }} />
          <div className="orb" style={{ width: 420, height: 420, bottom: -120, right: -80, background: 'radial-gradient(circle at 70% 70%, rgba(90,200,150,0.12), rgba(80,140,120,0.04))', animationDirection: 'reverse' }} />
          <div className="orb" style={{ width: 220, height: 220, top: 60, right: 40, background: 'radial-gradient(circle at 50% 50%, rgba(255,180,80,0.08), rgba(255,120,40,0.02))' }} />
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar - Desktop */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 rounded-xl border bg-card p-5">
              <FilterSidebar />
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1">
            {/* Search & Mobile Filter */}
            <div className="mb-6 flex gap-3">
              <SearchBar className="flex-1" />
              <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2 lg:hidden">
                    <Filter className="h-4 w-4" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-6">
                  <FilterSidebar onClose={() => setFilterSheetOpen(false)} />
                </SheetContent>
              </Sheet>
            </div>

            {/* Results Count */}
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''}
              {activeFiltersCount > 0 && (
                <span className="ml-1">with active filters</span>
              )}
            </div>

            {/* Tools Grid */}
            {filteredTools.length > 0 ? (
              <div className="grid gap-8 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                {filteredTools.map((tool, index) => (
                  <ToolCard key={tool.id} tool={tool} index={index} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-16 text-center">
                <Bot className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 font-heading text-lg font-semibold">No tools found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try adjusting your filters or search query
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

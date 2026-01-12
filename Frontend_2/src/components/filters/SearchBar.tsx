import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className }: SearchBarProps) {
  const { filters, setFilters } = useApp();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, searchQuery: e.target.value });
  };

  const handleClear = () => {
    setFilters({ ...filters, searchQuery: '' });
  };

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search AI tools by name, use case..."
        value={filters.searchQuery}
        onChange={handleChange}
        className="pl-10 pr-10 h-11"
      />
      {filters.searchQuery && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

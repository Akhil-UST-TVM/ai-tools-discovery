import { Badge } from '@/components/ui/badge';
import { Category } from '@/types';

const categoryVariantMap: Record<Category, 'nlp' | 'vision' | 'dev' | 'analytics' | 'automation'> = {
  'NLP': 'nlp',
  'Computer Vision': 'vision',
  'Dev Tools': 'dev',
  'Analytics': 'analytics',
  'Automation': 'automation',
};

interface CategoryBadgeProps {
  category: Category;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <Badge variant={categoryVariantMap[category]} className={className}>
      {category}
    </Badge>
  );
}

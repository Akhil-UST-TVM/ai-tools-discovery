import { Badge } from '@/components/ui/badge';
import { PricingModel } from '@/types';

const pricingVariantMap: Record<PricingModel, 'free' | 'paid' | 'subscription'> = {
  'Free': 'free',
  'Paid': 'paid',
  'Subscription': 'subscription',
};

interface PricingBadgeProps {
  pricing: PricingModel;
  className?: string;
}

export function PricingBadge({ pricing, className }: PricingBadgeProps) {
  return (
    <Badge variant={pricingVariantMap[pricing]} className={className}>
      {pricing}
    </Badge>
  );
}

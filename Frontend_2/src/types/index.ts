export type Category = 'NLP' | 'Computer Vision' | 'Dev Tools' | 'Analytics' | 'Automation';

export type PricingModel = 'Free' | 'Paid' | 'Subscription';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface AITool {
  id: string;
  name: string;
  description: string;
  useCase: string;
  category: Category;
  pricingModel: PricingModel;
  averageRating: number;
  totalReviews: number;
  website?: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  toolId: string;
  userId: string;
  userName: string;
  rating: number;
  comment?: string;
  status: ReviewStatus;
  createdAt: string;
}

export interface FilterState {
  categories: Category[];
  pricingModels: PricingModel[];
  minRating: number;
  searchQuery: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Review Types

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  images?: string[]; // Review images
  variantInfo?: string; // e.g., "Xanh dương / 16GB / 512GB"
  isVerifiedPurchase: boolean;
  helpful: number; // Number of users who found this helpful
  createdAt: string;
  updatedAt?: string;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface CreateReviewRequest {
  productId: string;
  variantId?: string;
  rating: number;
  title: string;
  comment: string;
  images?: File[]; // For image upload
}

export interface UpdateReviewRequest {
  rating?: number;
  title?: string;
  comment?: string;
}

export interface ReviewFilters {
  rating?: number; // Filter by specific rating
  sort?: 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful';
  page?: number;
  pageSize?: number;
}

export interface PaginatedReviews {
  reviews: Review[];
  summary: ReviewSummary;
  currentPage: number;
  totalPages: number;
  totalReviews: number;
}

// API Response type
export interface ApiResponse<T> {
  code: number;
  message?: string;
  result: T;
}


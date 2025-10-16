import type {
  Review,
  ReviewSummary,
  CreateReviewRequest,
  ReviewFilters,
  PaginatedReviews,
} from '../types';

// Mock reviews database
let mockReviews: Review[] = [
  {
    id: '1',
    productId: 'dell-xps-13-plus',
    userId: 'user-1',
    userName: 'Nguyễn Văn A',
    userAvatar: 'https://i.pravatar.cc/150?img=1',
    rating: 5,
    title: 'Sản phẩm tuyệt vời!',
    comment:
      'Laptop rất đẹp, màn hình sắc nét, hiệu năng mạnh mẽ. Rất hài lòng với sản phẩm này. Phù hợp cho công việc và giải trí.',
    images: [
      'https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?w=400',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    ],
    variantInfo: 'Bạc / 16GB / 512GB',
    isVerifiedPurchase: true,
    helpful: 24,
    createdAt: '2024-10-01T10:30:00Z',
  },
  {
    id: '2',
    productId: 'dell-xps-13-plus',
    userId: 'user-2',
    userName: 'Trần Thị B',
    userAvatar: 'https://i.pravatar.cc/150?img=5',
    rating: 4,
    title: 'Tốt nhưng hơi nóng',
    comment:
      'Máy chạy mượt, thiết kế đẹp nhưng hơi nóng khi sử dụng lâu. Âm thanh ổn, pin tạm được. Nhìn chung vẫn đáng giá tiền.',
    variantInfo: 'Đen / 32GB / 1TB',
    isVerifiedPurchase: true,
    helpful: 12,
    createdAt: '2024-09-28T14:20:00Z',
  },
  {
    id: '3',
    productId: 'dell-xps-13-plus',
    userId: 'user-3',
    userName: 'Lê Minh C',
    userAvatar: 'https://i.pravatar.cc/150?img=3',
    rating: 5,
    title: 'Hiệu năng vượt trội',
    comment:
      'Dùng cho công việc thiết kế, render video rất tốt. Màn hình 4K đẹp, bàn phím gõ êm. Đáng đồng tiền bát gạo!',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'],
    variantInfo: 'Bạc / 32GB / 1TB',
    isVerifiedPurchase: true,
    helpful: 18,
    createdAt: '2024-09-25T09:15:00Z',
  },
  {
    id: '4',
    productId: 'dell-xps-13-plus',
    userId: 'user-4',
    userName: 'Phạm Thu D',
    userAvatar: 'https://i.pravatar.cc/150?img=9',
    rating: 3,
    title: 'Tạm được',
    comment:
      'Máy ổn nhưng giá hơi cao so với cấu hình. Touchpad hơi nhạy. Pin không được như quảng cáo.',
    isVerifiedPurchase: true,
    helpful: 5,
    createdAt: '2024-09-20T16:45:00Z',
  },
  {
    id: '5',
    productId: 'dell-xps-13-plus',
    userId: 'user-5',
    userName: 'Hoàng Minh E',
    userAvatar: 'https://i.pravatar.cc/150?img=7',
    rating: 5,
    title: 'Rất hài lòng',
    comment:
      'Đây là laptop thứ 3 tôi mua của Dell. Chất lượng luôn đảm bảo. Thiết kế sang trọng, màn hình đẹp, hiệu năng tốt.',
    images: [
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400',
      'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400',
    ],
    variantInfo: 'Bạc / 16GB / 512GB',
    isVerifiedPurchase: true,
    helpful: 31,
    createdAt: '2024-09-15T11:00:00Z',
  },
  // Reviews for Samsung Galaxy S24 Ultra
  {
    id: '6',
    productId: 'samsung-galaxy-s24-ultra',
    userId: 'user-6',
    userName: 'Đinh Văn F',
    userAvatar: 'https://i.pravatar.cc/150?img=12',
    rating: 5,
    title: 'Flagship tốt nhất năm!',
    comment:
      'Camera xuất sắc, màn hình đẹp lung linh, hiệu năng mạnh mẽ. Bút S Pen rất hữu ích. Xứng đáng là flagship!',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400',
    ],
    variantInfo: 'Đen Titan / 12GB / 512GB',
    isVerifiedPurchase: true,
    helpful: 45,
    createdAt: '2024-10-05T08:30:00Z',
  },
  {
    id: '7',
    productId: 'samsung-galaxy-s24-ultra',
    userId: 'user-7',
    userName: 'Vũ Thị G',
    userAvatar: 'https://i.pravatar.cc/150?img=10',
    rating: 4,
    title: 'Tốt nhưng hơi nặng',
    comment:
      'Máy chạy mượt, camera chụp đẹp, nhưng hơi nặng và to. Không phù hợp cho tay nhỏ. Pin trâu.',
    variantInfo: 'Tím / 12GB / 256GB',
    isVerifiedPurchase: true,
    helpful: 8,
    createdAt: '2024-09-30T13:20:00Z',
  },
];

/**
 * Calculate review summary statistics
 */
const calculateSummary = (reviews: Review[]): ReviewSummary => {
  const totalReviews = reviews.length;
  
  if (totalReviews === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let totalRating = 0;

  reviews.forEach((review) => {
    totalRating += review.rating;
    distribution[review.rating as keyof typeof distribution]++;
  });

  return {
    averageRating: Math.round((totalRating / totalReviews) * 10) / 10,
    totalReviews,
    ratingDistribution: distribution,
  };
};

/**
 * Sort reviews based on criteria
 */
const sortReviews = (reviews: Review[], sort: ReviewFilters['sort']): Review[] => {
  const sorted = [...reviews];

  switch (sort) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case 'highest':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'lowest':
      return sorted.sort((a, b) => a.rating - b.rating);
    case 'helpful':
      return sorted.sort((a, b) => b.helpful - a.helpful);
    default:
      return sorted;
  }
};

/**
 * Mock Review Service
 */
export const mockReviewService = {
  /**
   * Get reviews for a product
   */
  getReviews: async (
    productId: string,
    filters: ReviewFilters = {}
  ): Promise<PaginatedReviews> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Filter by product
    let filtered = mockReviews.filter((r) => r.productId === productId);

    // Filter by rating if specified
    if (filters.rating) {
      filtered = filtered.filter((r) => r.rating === filters.rating);
    }

    // Sort reviews
    const sorted = sortReviews(filtered, filters.sort || 'newest');

    // Pagination
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedReviews = sorted.slice(startIndex, endIndex);

    const summary = calculateSummary(filtered);

    return {
      reviews: paginatedReviews,
      summary,
      currentPage: page,
      totalPages: Math.ceil(filtered.length / pageSize),
      totalReviews: filtered.length,
    };
  },

  /**
   * Get a single review by ID
   */
  getReviewById: async (id: string): Promise<Review> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const review = mockReviews.find((r) => r.id === id);
    if (!review) {
      throw new Error('Review not found');
    }

    return review;
  },

  /**
   * Create a new review
   */
  createReview: async (request: CreateReviewRequest): Promise<Review> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Validate: user can only review products they purchased
    // In a real app, this would be checked against order history
    // For mock, we'll just create the review

    const newReview: Review = {
      id: `review-${Date.now()}`,
      productId: request.productId,
      userId: 'current-user', // Would be from auth
      userName: 'Bạn', // Would be from user profile
      userAvatar: 'https://i.pravatar.cc/150?img=50',
      rating: request.rating,
      title: request.title,
      comment: request.comment,
      images: [], // In real app, would upload images first
      variantInfo: undefined,
      isVerifiedPurchase: true, // Would be validated
      helpful: 0,
      createdAt: new Date().toISOString(),
    };

    mockReviews.unshift(newReview);

    return newReview;
  },

  /**
   * Mark review as helpful
   */
  markHelpful: async (reviewId: string): Promise<Review> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const review = mockReviews.find((r) => r.id === reviewId);
    if (!review) {
      throw new Error('Review not found');
    }

    review.helpful += 1;

    return review;
  },

  /**
   * Delete review (only owner can delete)
   */
  deleteReview: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = mockReviews.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error('Review not found');
    }

    mockReviews.splice(index, 1);
  },
};


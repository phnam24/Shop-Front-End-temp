import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, Filter, ChevronDown, Loader2, Image as ImageIcon } from 'lucide-react';
import { RatingStars } from '../../../shared/components/ui/RatingStars';
import { reviewService } from '../services/reviewService';
import { useToast } from '../../../shared/hooks/useToast';
import type { PaginatedReviews, ReviewFilters } from '../types';

interface ProductReviewsProps {
  productId: string;
  onWriteReview?: () => void;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  onWriteReview,
}) => {
  const { toast } = useToast();
  const [reviewData, setReviewData] = useState<PaginatedReviews | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ReviewFilters>({
    sort: 'newest',
    page: 1,
    pageSize: 10,
  });

  useEffect(() => {
    loadReviews();
  }, [productId, filters]);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const data = await reviewService.getReviews(productId, filters);
      setReviewData(data);
    } catch (error: any) {
      toast.error(error.message || 'Không thể tải đánh giá');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkHelpful = async (reviewId: string) => {
    try {
      await reviewService.markHelpful(reviewId);
      // Reload reviews to update helpful count
      await loadReviews();
      toast.success('Cảm ơn bạn đã đánh giá hữu ích!');
    } catch (error: any) {
      toast.error(error.message || 'Không thể đánh dấu hữu ích');
    }
  };

  const handleFilterByRating = (rating: number | undefined) => {
    setFilters({ ...filters, rating, page: 1 });
  };

  const handleSortChange = (sort: ReviewFilters['sort']) => {
    setFilters({ ...filters, sort, page: 1 });
  };

  const handleLoadMore = () => {
    if (reviewData && reviewData.currentPage < reviewData.totalPages) {
      setFilters({ ...filters, page: filters.page! + 1 });
    }
  };

  if (isLoading && !reviewData) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!reviewData) {
    return null;
  }

  const { summary, reviews } = reviewData;

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Average Rating */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {summary.averageRating.toFixed(1)}
            </div>
            <RatingStars rating={summary.averageRating} size="lg" />
            <p className="text-gray-600 mt-3">
              {summary.totalReviews} đánh giá
            </p>
            {onWriteReview && (
              <button
                onClick={onWriteReview}
                className="btn btn-primary mt-4 px-6"
              >
                <Star className="w-5 h-5 mr-2" />
                Viết đánh giá
              </button>
            )}
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = summary.ratingDistribution[rating as keyof typeof summary.ratingDistribution];
              const percentage = summary.totalReviews > 0
                ? (count / summary.totalReviews) * 100
                : 0;

              return (
                <button
                  key={rating}
                  onClick={() => handleFilterByRating(filters.rating === rating ? undefined : rating)}
                  className={`flex items-center gap-3 w-full py-2 px-3 rounded-lg transition-all hover:bg-white/50 ${
                    filters.rating === rating ? 'bg-white shadow-sm' : ''
                  }`}
                >
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium text-gray-700">{rating}</span>
                    <Star className="w-4 h-4 fill-accent-400 text-accent-400" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-accent-400 h-full rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-semibold text-gray-700">
            {filters.rating ? `${filters.rating} sao` : 'Tất cả đánh giá'} ({reviewData.totalReviews})
          </span>
          {filters.rating && (
            <button
              onClick={() => handleFilterByRating(undefined)}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sắp xếp:</span>
          <select
            value={filters.sort}
            onChange={(e) => handleSortChange(e.target.value as ReviewFilters['sort'])}
            className="input-field py-2 px-3 text-sm"
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="highest">Đánh giá cao</option>
            <option value="lowest">Đánh giá thấp</option>
            <option value="helpful">Hữu ích nhất</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Chưa có đánh giá nào
          </h3>
          <p className="text-gray-600 mb-6">
            Hãy là người đầu tiên đánh giá sản phẩm này!
          </p>
          {onWriteReview && (
            <button onClick={onWriteReview} className="btn btn-primary">
              <Star className="w-5 h-5 mr-2" />
              Viết đánh giá
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  {/* User Avatar */}
                  <img
                    src={review.userAvatar || 'https://i.pravatar.cc/150'}
                    alt={review.userName}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                      {review.isVerifiedPurchase && (
                        <span className="badge bg-success-100 text-success-700 text-xs">
                          ✓ Đã mua hàng
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <RatingStars rating={review.rating} size="sm" />
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    {review.variantInfo && (
                      <p className="text-sm text-gray-600 mt-1">
                        Phân loại: {review.variantInfo}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="mb-4">
                <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-4">
                  {review.images.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg overflow-hidden bg-gray-100 group cursor-pointer relative"
                    >
                      <img
                        src={image}
                        alt={`Review ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Helpful Button */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleMarkHelpful(review.id)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>Hữu ích ({review.helpful})</span>
                </button>
              </div>
            </div>
          ))}

          {/* Load More Button */}
          {reviewData.currentPage < reviewData.totalPages && (
            <div className="flex justify-center pt-4">
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="btn btn-outline px-8"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Đang tải...
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-5 h-5 mr-2" />
                    Xem thêm đánh giá
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


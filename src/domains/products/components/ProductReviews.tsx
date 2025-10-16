import React, { useState } from 'react';
import { Star, ThumbsUp, MessageCircle, Filter } from 'lucide-react';

interface ProductReviewsProps {
  productId: number;
  rating: number;
  reviewCount: number;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  rating,
  reviewCount,
}) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  // Mock reviews data
  const mockReviews = [
    {
      id: 1,
      userName: 'Nguyễn Văn A',
      rating: 5,
      date: '2025-01-15',
      verified: true,
      content: 'Sản phẩm rất tốt, đúng với mô tả. Giao hàng nhanh, đóng gói cẩn thận.',
      likes: 12,
      images: [],
    },
    {
      id: 2,
      userName: 'Trần Thị B',
      rating: 4,
      date: '2025-01-10',
      verified: true,
      content: 'Laptop chạy mượt, màn hình đẹp. Chỉ hơi nóng khi chơi game nặng.',
      likes: 8,
      images: [],
    },
  ];

  const ratingDistribution = [
    { stars: 5, count: 80, percent: 75 },
    { stars: 4, count: 15, percent: 14 },
    { stars: 3, count: 8, percent: 7 },
    { stars: 2, count: 3, percent: 3 },
    { stars: 1, count: 1, percent: 1 },
  ];

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Overall Rating */}
        <div className="text-center p-8 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl">
          <div className="text-6xl font-bold text-primary-900 mb-2">
            {rating.toFixed(1)}
          </div>
          <div className="flex justify-center mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-6 h-6 ${
                  i < Math.floor(rating) ? 'fill-accent-400 text-accent-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="text-gray-600">
            <span className="font-semibold text-gray-900">{reviewCount}</span> đánh giá
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {ratingDistribution.map((item) => (
            <button
              key={item.stars}
              onClick={() => setSelectedRating(selectedRating === item.stars ? null : item.stars)}
              className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors ${
                selectedRating === item.stars ? 'bg-primary-50' : ''
              }`}
            >
              <div className="flex items-center gap-1 w-16">
                <span className="text-sm font-medium">{item.stars}</span>
                <Star className="w-4 h-4 fill-accent-400 text-accent-400" />
              </div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-400 transition-all"
                  style={{ width: `${item.percent}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600 w-12 text-right">
                {item.count}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between py-4 border-y border-gray-200">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-gray-900">
            {selectedRating ? `${selectedRating} sao` : 'Tất cả đánh giá'}
          </span>
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option>Mới nhất</option>
          <option>Hữu ích nhất</option>
          <option>Đánh giá cao nhất</option>
          <option>Đánh giá thấp nhất</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {mockReviews.map((review) => (
          <div key={review.id} className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white font-bold">
                  {review.userName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{review.userName}</span>
                    {review.verified && (
                      <span className="px-2 py-0.5 bg-success-100 text-success-700 text-xs rounded-full font-medium">
                        ✓ Đã mua hàng
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">{review.date}</div>
                </div>
              </div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating ? 'fill-accent-400 text-accent-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed">{review.content}</p>

            <div className="flex items-center gap-4 text-sm">
              <button className="flex items-center gap-1 text-gray-600 hover:text-primary-600 transition-colors">
                <ThumbsUp className="w-4 h-4" />
                <span>Hữu ích ({review.likes})</span>
              </button>
              <button className="flex items-center gap-1 text-gray-600 hover:text-primary-600 transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>Phản hồi</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <button className="btn btn-outline px-8">
          Xem thêm đánh giá
        </button>
      </div>

      {/* Write Review CTA */}
      <div className="text-center p-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl text-white">
        <h3 className="text-2xl font-bold mb-2">Bạn đã mua sản phẩm này?</h3>
        <p className="mb-4 text-blue-100">Chia sẻ trải nghiệm của bạn để giúp người khác</p>
        <button className="btn bg-white text-primary-700 hover:bg-gray-100 font-bold">
          Viết đánh giá
        </button>
      </div>
    </div>
  );
};
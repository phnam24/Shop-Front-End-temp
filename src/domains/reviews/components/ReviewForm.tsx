import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Star, X, Loader2, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { RatingStars } from '../../../shared/components/ui/RatingStars';
import { reviewService } from '../services/reviewService';
import { useToast } from '../../../shared/hooks/useToast';
import type { CreateReviewRequest } from '../types';

interface ReviewFormProps {
  productId: string;
  productName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface ReviewFormData {
  rating: number;
  title: string;
  comment: string;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  productName,
  onSuccess,
  onCancel,
}) => {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + selectedImages.length > 5) {
      toast.warning('Bạn chỉ có thể tải lên tối đa 5 ảnh');
      return;
    }

    setSelectedImages([...selectedImages, ...files]);

    // Create previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...selectedImages];
    const newPreviews = [...imagePreviews];
    
    // Revoke the preview URL to free memory
    URL.revokeObjectURL(newPreviews[index]);
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
  };

  const onSubmit = async (data: ReviewFormData) => {
    if (rating === 0) {
      toast.error('Vui lòng chọn số sao đánh giá');
      return;
    }

    setIsSubmitting(true);
    try {
      const request: CreateReviewRequest = {
        productId,
        rating,
        title: data.title,
        comment: data.comment,
        images: selectedImages,
      };

      await reviewService.createReview(request);

      setShowSuccess(true);
      toast.success('Đánh giá của bạn đã được gửi thành công!');

      // Reset form
      setTimeout(() => {
        reset();
        setRating(0);
        setSelectedImages([]);
        setImagePreviews([]);
        setShowSuccess(false);
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || 'Không thể gửi đánh giá');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingLabel = (rating: number) => {
    const labels: Record<number, string> = {
      1: 'Rất tệ',
      2: 'Tệ',
      3: 'Bình thường',
      4: 'Tốt',
      5: 'Rất tốt',
    };
    return labels[rating] || '';
  };

  if (showSuccess) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center animate-scale-in">
        <CheckCircle2 className="w-16 h-16 text-success-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Cảm ơn bạn đã đánh giá!
        </h3>
        <p className="text-gray-600">
          Đánh giá của bạn sẽ giúp người mua khác có thêm thông tin hữu ích.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">Viết đánh giá</h3>
          <p className="text-sm text-gray-600">{productName}</p>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Rating Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Đánh giá của bạn <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-4">
            <RatingStars
              rating={rating}
              size="lg"
              interactive
              onRatingChange={setRating}
            />
            {rating > 0 && (
              <span className="text-lg font-semibold text-primary-700">
                {getRatingLabel(rating)}
              </span>
            )}
          </div>
          {rating === 0 && (
            <p className="mt-2 text-sm text-gray-500">
              Click vào sao để chọn đánh giá
            </p>
          )}
        </div>

        {/* Review Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            {...register('title', {
              required: 'Vui lòng nhập tiêu đề',
              minLength: {
                value: 10,
                message: 'Tiêu đề phải có ít nhất 10 ký tự',
              },
            })}
            className="input-field"
            placeholder="Tóm tắt đánh giá của bạn..."
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Review Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-semibold text-gray-700 mb-2">
            Nội dung đánh giá <span className="text-red-500">*</span>
          </label>
          <textarea
            id="comment"
            {...register('comment', {
              required: 'Vui lòng nhập nội dung đánh giá',
              minLength: {
                value: 20,
                message: 'Nội dung phải có ít nhất 20 ký tự',
              },
            })}
            className="input-field resize-none"
            rows={5}
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
          />
          {errors.comment && (
            <p className="mt-1 text-sm text-red-600">{errors.comment.message}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Thêm ảnh (tùy chọn)
          </label>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {/* Preview existing images */}
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Add image button */}
            {selectedImages.length < 5 && (
              <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all">
                <ImageIcon className="w-8 h-8 text-gray-400 mb-1" />
                <span className="text-xs text-gray-500">Thêm ảnh</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <p className="mt-2 text-xs text-gray-500">
            Tối đa 5 ảnh. Định dạng: JPG, PNG. Kích thước tối đa: 5MB/ảnh.
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-ghost py-3"
              disabled={isSubmitting}
            >
              Hủy
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="btn btn-primary py-3 flex-1 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Đang gửi...
              </>
            ) : (
              <>
                <Star className="w-5 h-5 mr-2" />
                Gửi đánh giá
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};


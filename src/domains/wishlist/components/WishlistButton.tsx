import React, { useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../../auth/store/authStore';
import { useToast } from '../../../shared/hooks/useToast';

interface WishlistButtonProps {
  productId: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button';
  showLabel?: boolean;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
  size = 'md',
  variant = 'icon',
  showLabel = false,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuthStore();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const inWishlist = isInWishlist(productId);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const buttonSizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.warning('Vui lòng đăng nhập để sử dụng chức năng yêu thích');
      navigate('/auth');
      return;
    }

    setIsLoading(true);
    try {
      if (inWishlist) {
        await removeFromWishlist(productId);
        toast.success('Đã xóa khỏi danh sách yêu thích');
      } else {
        await addToWishlist(productId);
        toast.success('Đã thêm vào danh sách yêu thích');
      }
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`${buttonSizeClasses[size]} rounded-full transition-all hover:scale-110 disabled:opacity-50 ${
          inWishlist
            ? 'bg-red-100 text-red-600 hover:bg-red-200'
            : 'bg-white/90 backdrop-blur text-gray-700 hover:bg-white hover:text-red-600'
        }`}
        title={inWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
      >
        {isLoading ? (
          <Loader2 className={`${sizeClasses[size]} animate-spin`} />
        ) : (
          <Heart
            className={`${sizeClasses[size]} ${
              inWishlist ? 'fill-current' : ''
            } transition-all`}
          />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`btn ${
        inWishlist ? 'btn-secondary' : 'btn-outline'
      } flex items-center gap-2 disabled:opacity-50`}
    >
      {isLoading ? (
        <Loader2 className={`${sizeClasses[size]} animate-spin`} />
      ) : (
        <Heart
          className={`${sizeClasses[size]} ${
            inWishlist ? 'fill-current text-red-600' : ''
          } transition-all`}
        />
      )}
      {showLabel && (
        <span>{inWishlist ? 'Đã yêu thích' : 'Yêu thích'}</span>
      )}
    </button>
  );
};


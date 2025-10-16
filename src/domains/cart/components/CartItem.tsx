import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, Loader2 } from 'lucide-react';
import type { CartItem as CartItemType } from '../types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => Promise<void>;
  onRemove: (itemId: string) => Promise<void>;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const currentPrice = item.priceSale || item.priceList;
  const originalPrice = item.priceList;
  const hasDiscount = !!item.priceSale && item.priceSale < item.priceList;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const handleQuantityChange = async (delta: number) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1 || newQuantity > item.stock || isUpdating) return;

    setIsUpdating(true);
    try {
      await onUpdateQuantity(item.id, newQuantity);
    } catch (error) {
      console.error('Update quantity error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (isRemoving) return;

    setIsRemoving(true);
    try {
      await onRemove(item.id);
    } catch (error) {
      console.error('Remove item error:', error);
      setIsRemoving(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className={`bg-white rounded-xl border-2 border-gray-200 p-4 md:p-6 transition-all relative ${
      isRemoving ? 'opacity-50' : 'hover:border-gray-300 hover:shadow-lg'
    }`}>
      {isRemoving && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      )}

      <div className="flex gap-4 md:gap-6">
        {/* Product Image */}
        <Link
          to={`/products/${item.productSlug}`}
          className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-gray-100 hover:scale-105 transition-transform"
        >
          <img
            src={item.productAvatar}
            alt={item.productName}
            className="w-full h-full object-cover"
          />
        </Link>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between gap-4 mb-2">
            <div className="flex-1">
              {/* Brand */}
              <span className="text-xs font-bold text-primary-700 uppercase tracking-wide">
                {item.brandName}
              </span>

              {/* Product Name */}
              <Link
                to={`/products/${item.productSlug}`}
                className="block text-base md:text-lg font-bold text-gray-900 hover:text-primary-700 transition-colors line-clamp-2 mb-2"
              >
                {item.productName}
              </Link>

              {/* Variant Info */}
              <div className="flex flex-wrap gap-2 mb-3">
                {item.color && (
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-md font-medium">
                    Màu: {item.color}
                  </span>
                )}
                {item.ramGb && (
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-md font-medium">
                    RAM: {item.ramGb}GB
                  </span>
                )}
                {item.storageGb && (
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-md font-medium">
                    SSD: {item.storageGb}GB
                  </span>
                )}
              </div>

              {/* Stock Status */}
              {item.stock < 10 && item.stock > 0 && (
                <p className="text-xs text-orange-600 font-medium">
                  ⚠️ Chỉ còn {item.stock} sản phẩm
                </p>
              )}
              {item.stock === 0 && (
                <p className="text-xs text-red-600 font-bold">
                  ❌ Hết hàng
                </p>
              )}
            </div>

            {/* Remove Button - Desktop */}
            <button
              onClick={handleRemove}
              disabled={isRemoving}
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
              title="Xóa"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {/* Price and Quantity - Bottom Row */}
          <div className="flex items-center justify-between gap-4">
            {/* Quantity Controls */}
            <div className="flex items-center">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={item.quantity <= 1 || isUpdating}
                className="w-8 h-8 flex items-center justify-center border-2 border-gray-300 rounded-l-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="w-14 h-8 flex items-center justify-center border-t-2 border-b-2 border-gray-300 bg-gray-50">
                <span className="font-bold text-sm">{item.quantity}</span>
              </div>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={item.quantity >= item.stock || isUpdating}
                className="w-8 h-8 flex items-center justify-center border-2 border-gray-300 rounded-r-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Price */}
            <div className="text-right">
              <div className="flex items-baseline gap-2 justify-end">
                <span className="text-lg md:text-xl font-bold text-primary-900">
                  {formatPrice(currentPrice * item.quantity)}
                </span>
                {hasDiscount && (
                  <span className="badge bg-red-500 text-white text-xs">
                    -{discountPercent}%
                  </span>
                )}
              </div>
              {hasDiscount && (
                <div className="text-xs text-gray-400 line-through mt-1">
                  {formatPrice(originalPrice * item.quantity)}
                </div>
              )}
            </div>

            {/* Remove Button - Mobile */}
            <button
              onClick={handleRemove}
              disabled={isRemoving}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
              title="Xóa"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


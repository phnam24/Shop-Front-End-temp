import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onAddToWishlist 
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const discountPercent = product.discountPercent || 0;
  const hasStock = product.variants?.some((v) => v.stock > 0) ?? false;

  return (
    <div className="group relative">
      <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border-2 border-gray-100 hover:border-primary-300 transform hover:-translate-y-2 duration-300">
        {/* Image Container */}
        <Link to={`/products/${product.slug}`} className="block relative aspect-square bg-gray-50 overflow-hidden">
          <img
            src={product.firstImage || product.avatar || '/placeholder-product.png'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discountPercent > 0 && (
              <span className="badge bg-red-500 text-white text-xs font-bold shadow-lg animate-pulse-glow">
                -{discountPercent}%
              </span>
            )}
            {!hasStock && (
              <span className="badge bg-gray-700 text-white text-xs font-bold">
                Hết hàng
              </span>
            )}
            {hasStock && product.variants && product.variants[0]?.stock < 5 && (
              <span className="badge bg-accent-500 text-white text-xs font-bold">
                Sắp hết
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.preventDefault();
                onAddToWishlist?.(product);
              }}
              className="w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-red-50 hover:scale-110 transition-all"
              title="Thêm vào yêu thích"
            >
              <Heart className="w-4 h-4 text-gray-700 hover:text-red-500" />
            </button>
            <button
              className="w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-primary-50 hover:scale-110 transition-all"
              title="Xem nhanh"
            >
              <Eye className="w-4 h-4 text-gray-700 hover:text-primary-600" />
            </button>
          </div>

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </Link>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          {/* Brand */}
          <Link to={`/products/${product.slug}`}>
            <span className="text-xs text-primary-700 font-bold uppercase tracking-wide hover:text-primary-900">
              {product.brand?.name || 'N/A'}
            </span>
          </Link>

          {/* Product Name */}
          <Link to={`/products/${product.slug}`}>
            <h3 className="font-medium text-gray-900 line-clamp-2 text-sm leading-relaxed group-hover:text-primary-700 transition-colors min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>

          {/* Price - Fixed height container */}
          <div className="min-h-[80px] flex flex-col justify-center space-y-1.5">
            {/* Discount Badge */}
            {discountPercent > 0 && (
              <div className="inline-flex items-center gap-1 bg-red-50 px-2 py-1 rounded w-fit">
                <span className="text-xs font-bold text-red-600">
                  COMBO GIẢM ~ {formatPrice(product.maxPrice! - product.minPrice!)}
                </span>
              </div>
            )}
            
            {/* Price display */}
            <div className="flex items-baseline gap-2">
              <span className="text-lg md:text-xl font-bold text-red-600">
                {formatPrice(product.minPrice || 0)}
              </span>
            </div>
            
            {/* Original price if discount exists */}
            {product.hasDiscount && product.maxPrice && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="line-through">
                  {formatPrice(product.maxPrice)}
                </span>
              </div>
            )}
          </div>

          {/* Specs Preview - Icon based */}
          {product.variants && product.variants[0] && (
            <div className="space-y-1.5 text-xs text-gray-600 border-t pt-3">
              {product.variants[0].cpuModel && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">🖥️</span>
                  <span className="truncate">{product.variants[0].cpuModel}</span>
                </div>
              )}
              {product.variants[0].ramGb && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">💾</span>
                  <span>{product.variants[0].ramGb}GB</span>
                  {product.variants[0].storageGb && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span>{product.variants[0].storageGb}GB</span>
                    </>
                  )}
                </div>
              )}
              {product.variants[0].gpuModel && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">🎮</span>
                  <span className="truncate">{product.variants[0].gpuModel}</span>
                </div>
              )}
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={() => onAddToCart?.(product)}
            disabled={!hasStock}
            className="btn bg-primary-600 hover:bg-primary-700 text-white w-full text-sm font-medium py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  );
};
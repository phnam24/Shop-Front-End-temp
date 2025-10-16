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
        <div className="p-4 space-y-2">
          {/* Brand */}
          <span className="text-xs text-primary-700 font-bold uppercase tracking-wide">
            {product.brand?.name || 'N/A'}
          </span>

          {/* Product Name */}
          <Link to={`/products/${product.slug}`}>
            <h3 className="font-bold text-gray-900 line-clamp-2 text-sm md:text-base group-hover:text-primary-700 transition-colors min-h-[3rem]">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex text-accent-400">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 md:w-4 md:h-4 ${
                    i < Math.floor(product.rating || 0) ? 'fill-current' : ''
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 font-semibold">
              ({product.reviewCount || 0})
            </span>
          </div>

          {/* Specs Preview */}
          {product.variants && product.variants[0] && (
            <div className="flex flex-wrap gap-2 text-xs text-gray-600">
              {product.variants[0].cpuModel && (
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {product.variants[0].cpuModel.split(' ').slice(0, 3).join(' ')}
                </span>
              )}
              {product.variants[0].ramGb && (
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {product.variants[0].ramGb}GB RAM
                </span>
              )}
              {product.variants[0].storageGb && (
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {product.variants[0].storageGb}GB SSD
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-2">
            <span className="text-xl md:text-2xl font-bold text-primary-900">
              {formatPrice(product.minPrice || 0)}
            </span>
            {product.hasDiscount && product.maxPrice && (
              <span className="text-xs text-gray-400 line-through font-medium">
                {formatPrice(product.maxPrice)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => onAddToCart?.(product)}
            disabled={!hasStock}
            className="btn btn-accent w-full mt-4 text-sm shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {hasStock ? 'Thêm vào giỏ' : 'Hết hàng'}
          </button>
        </div>
      </div>
    </div>
  );
};
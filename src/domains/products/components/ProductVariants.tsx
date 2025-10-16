import React from 'react';
import { Check } from 'lucide-react';
import type { ProductVariant } from '../types';

interface ProductVariantsProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onVariantSelect: (variant: ProductVariant) => void;
}

export const ProductVariants: React.FC<ProductVariantsProps> = ({
  variants,
  selectedVariant,
  onVariantSelect,
}) => {
  // Group variants by color
  const colorGroups = variants.reduce((acc, variant) => {
    const color = variant.color || 'default';
    if (!acc[color]) {
      acc[color] = [];
    }
    acc[color].push(variant);
    return acc;
  }, {} as Record<string, ProductVariant[]>);

  const colors = Object.keys(colorGroups);
  const hasMultipleColors = colors.length > 1;

  // Get unique configurations (RAM + Storage combinations)
  const getUniqueConfigs = () => {
    const configMap = new Map<string, ProductVariant>();
    variants.forEach((variant) => {
      const key = `${variant.ramGb}-${variant.storageGb}`;
      if (!configMap.has(key)) {
        configMap.set(key, variant);
      }
    });
    return Array.from(configMap.values());
  };

  const configs = getUniqueConfigs();
  const hasMultipleConfigs = configs.length > 1;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Color Selector */}
      {hasMultipleColors && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Màu sắc: <span className="text-primary-700">{selectedVariant?.color || 'Chọn màu'}</span>
          </h3>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => {
              const variant = colorGroups[color][0];
              const isSelected = selectedVariant?.color === color;
              const isAvailable = variant.stock > 0;

              return (
                <button
                  key={color}
                  onClick={() => isAvailable && onVariantSelect(variant)}
                  disabled={!isAvailable}
                  className={`relative px-5 py-3 rounded-lg border-2 font-medium transition-all ${
                    isSelected
                      ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-lg scale-105'
                      : isAvailable
                      ? 'border-gray-300 hover:border-primary-300 text-gray-700 hover:scale-105'
                      : 'border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                  }`}
                >
                  {color}
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  {!isAvailable && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-semibold">Hết hàng</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Configuration Selector (RAM + Storage) */}
      {hasMultipleConfigs && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Cấu hình
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {configs.map((variant) => {
              const isSelected = 
                selectedVariant?.ramGb === variant.ramGb && 
                selectedVariant?.storageGb === variant.storageGb;
              const isAvailable = variant.stock > 0;
              const priceDiff = variant.priceList - (configs[0]?.priceList || 0);

              return (
                <button
                  key={variant.id}
                  onClick={() => isAvailable && onVariantSelect(variant)}
                  disabled={!isAvailable}
                  className={`relative p-4 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? 'border-primary-600 bg-primary-50 shadow-lg scale-105'
                      : isAvailable
                      ? 'border-gray-300 hover:border-primary-300 hover:scale-105'
                      : 'border-gray-200 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-bold text-gray-900">
                        {variant.ramGb}GB RAM + {variant.storageGb}GB SSD
                      </div>
                      {variant.cpuModel && (
                        <div className="text-xs text-gray-600 mt-1">
                          {variant.cpuModel}
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    {priceDiff > 0 ? (
                      <span className="text-sm font-semibold text-primary-700">
                        +{formatPrice(priceDiff)}
                      </span>
                    ) : (
                      <span className="text-sm font-semibold text-success-600">
                        Giá cơ bản
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {isAvailable ? `Còn ${variant.stock}` : 'Hết hàng'}
                    </span>
                  </div>

                  {!isAvailable && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-600">Hết hàng</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Variant Summary */}
      {selectedVariant && (
        <div className="p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border border-primary-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-700 mb-1">Đang chọn:</div>
              <div className="font-bold text-gray-900">
                {selectedVariant.color} - {selectedVariant.ramGb}GB RAM - {selectedVariant.storageGb}GB SSD
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-700 mb-1">Còn lại:</div>
              <div className={`font-bold text-lg ${
                selectedVariant.stock < 5 ? 'text-red-600' : 'text-success-600'
              }`}>
                {selectedVariant.stock} sản phẩm
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
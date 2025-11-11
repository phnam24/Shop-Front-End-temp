import React, { useEffect, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import type { ProductFilters as Filters, Brand } from '../types';
import { productService } from '../services/productService';

interface ProductFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  onClearFilters: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  
  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      const data = await productService.getBrands();
      setBrands(data);
    } catch (error) {
      console.error('Load brands error:', error);
    }
  };

  const activeFiltersCount = 
    (filters.brandIds?.length || 0) +
    (filters.ramGb?.length || 0) +
    (filters.minPrice || filters.maxPrice ? 1 : 0) +
    (filters.inStock ? 1 : 0) +
    (filters.onSale ? 1 : 0);

  const handleBrandToggle = (brandId: number) => {
    const brandIds = filters.brandIds || [];
    const newBrandIds = brandIds.includes(brandId)
      ? brandIds.filter(id => id !== brandId)
      : [...brandIds, brandId];
    onFilterChange({ ...filters, brandIds: newBrandIds });
  };

  const handlePriceRangeChange = (min?: number, max?: number) => {
    onFilterChange({ ...filters, minPrice: min, maxPrice: max });
  };

  const handleRAMToggle = (ram: number) => {
    const ramGb = filters.ramGb || [];
    const newRamGb = ramGb.includes(ram)
      ? ramGb.filter(r => r !== ram)
      : [...ramGb, ram];
    onFilterChange({ ...filters, ramGb: newRamGb });
  };

  const handleStockToggle = () => {
    onFilterChange({ ...filters, inStock: !filters.inStock });
  };

  const handleSaleToggle = () => {
    onFilterChange({ ...filters, onSale: !filters.onSale });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <SlidersHorizontal className="w-5 h-5 mr-2" />
          Bộ lọc
          {activeFiltersCount > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={onClearFilters}
            className="flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            <X className="w-4 h-4 mr-1" />
            Xóa tất cả
          </button>
        )}
      </div>

      {/* Brand Filter */}
      <div className="border-b border-gray-200 pb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Thương hiệu</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {brands.slice(0, 9).map((brand) => (
            <label key={brand.id} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.brandIds?.includes(brand.id)}
                onChange={() => handleBrandToggle(brand.id)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-700 group-hover:text-primary-700 transition-colors">
                {brand.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="border-b border-gray-200 pb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Khoảng giá</h4>
        <div className="space-y-2">
          {[
            { label: 'Dưới 15 triệu', min: 0, max: 15000000 },
            { label: '15 - 25 triệu', min: 15000000, max: 25000000 },
            { label: '25 - 35 triệu', min: 25000000, max: 35000000 },
            { label: 'Trên 35 triệu', min: 35000000, max: undefined },
          ].map((range, idx) => (
            <label key={idx} className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="price"
                checked={filters.minPrice === range.min && filters.maxPrice === range.max}
                onChange={() => handlePriceRangeChange(range.min, range.max)}
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500 cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-700 group-hover:text-primary-700 transition-colors">
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* RAM Filter */}
      <div className="border-b border-gray-200 pb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">RAM</h4>
        <div className="grid grid-cols-2 gap-2">
          {[8, 16, 32, 64].map((ram) => (
            <button
              key={ram}
              onClick={() => handleRAMToggle(ram)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                filters.ramGb?.includes(ram)
                  ? 'bg-primary-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              {ram}GB
            </button>
          ))}
        </div>
      </div>

      {/* Storage Filter */}
      <div className="border-b border-gray-200 pb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Ổ cứng</h4>
        <div className="grid grid-cols-2 gap-2">
          {[256, 512, 1024, 2048].map((storage) => (
            <button
              key={storage}
              onClick={() => {
                const storageGb = filters.storageGb || [];
                const newStorageGb = storageGb.includes(storage)
                  ? storageGb.filter(s => s !== storage)
                  : [...storageGb, storage];
                onFilterChange({ ...filters, storageGb: newStorageGb });
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                filters.storageGb?.includes(storage)
                  ? 'bg-primary-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              {storage >= 1024 ? `${storage / 1024}TB` : `${storage}GB`}
            </button>
          ))}
        </div>
      </div>

      {/* Special Filters */}
      <div className="space-y-3">
        <label className="flex items-center cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={handleStockToggle}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
          />
          <span className="ml-2 text-sm text-gray-700 group-hover:text-primary-700 transition-colors">
            Chỉ hiện còn hàng
          </span>
        </label>
        <label className="flex items-center cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.onSale}
            onChange={handleSaleToggle}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
          />
          <span className="ml-2 text-sm text-gray-700 group-hover:text-primary-700 transition-colors">
            Đang giảm giá
          </span>
        </label>
      </div>

      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <div className="pt-6 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Đang áp dụng ({activeFiltersCount})
          </h4>
          <div className="flex flex-wrap gap-2">
            {filters.brandIds?.map((brandId) => {
              const brand = brands.find(b => b.id === brandId);
              return brand ? (
                <span
                  key={brandId}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                >
                  {brand.name}
                  <button
                    onClick={() => handleBrandToggle(brandId)}
                    className="hover:bg-primary-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ) : null;
            })}
            {filters.ramGb?.map((ram) => (
              <span
                key={ram}
                className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
              >
                {ram}GB RAM
                <button
                  onClick={() => handleRAMToggle(ram)}
                  className="hover:bg-primary-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {(filters.minPrice || filters.maxPrice) && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                Giá
                <button
                  onClick={() => handlePriceRangeChange(undefined, undefined)}
                  className="hover:bg-primary-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
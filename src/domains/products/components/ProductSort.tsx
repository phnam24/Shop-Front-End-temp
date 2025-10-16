import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import type { ProductSortOption } from '../types';

interface ProductSortProps {
  currentSort: ProductSortOption;
  onSortChange: (sort: ProductSortOption) => void;
}

const sortOptions = [
  { label: 'Mới nhất', field: 'createdAt' as const, order: 'desc' as const },
  { label: 'Cũ nhất', field: 'createdAt' as const, order: 'asc' as const },
  { label: 'Giá thấp → cao', field: 'priceList' as const, order: 'asc' as const },
  { label: 'Giá cao → thấp', field: 'priceList' as const, order: 'desc' as const },
  { label: 'Tên A → Z', field: 'name' as const, order: 'asc' as const },
  { label: 'Tên Z → A', field: 'name' as const, order: 'desc' as const },
];

export const ProductSort: React.FC<ProductSortProps> = ({
  currentSort,
  onSortChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLabel = sortOptions.find(
    opt => opt.field === currentSort.field && opt.order === currentSort.order
  )?.label || 'Sắp xếp';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSort = (option: typeof sortOptions[0]) => {
    onSortChange({ field: option.field, order: option.order });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-primary-600 transition-colors bg-white text-sm font-medium"
      >
        <span>{currentLabel}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-10 animate-slide-down">
          <div className="py-2">
            {sortOptions.map((option, index) => {
              const isSelected = 
                option.field === currentSort.field && 
                option.order === currentSort.order;

              return (
                <button
                  key={index}
                  onClick={() => handleSelectSort(option)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-primary-50 transition-colors flex items-center justify-between ${
                    isSelected ? 'text-primary-700 font-semibold bg-primary-50' : 'text-gray-700'
                  }`}
                >
                  <span>{option.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-primary-600" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
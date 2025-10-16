import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { mockCategories, mockBrands } from '../../../domains/products/services/mockDataService';

interface MegaMenuProps {
  isOpen: boolean;
  activeCategory: 'laptop' | 'smartphone' | null;
  onClose: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, activeCategory, onClose }) => {
  if (!isOpen || !activeCategory) return null;

  const categoryData = mockCategories.find((c) => 
    activeCategory === 'laptop' ? c.id === 1 : c.id === 2
  );

  if (!categoryData) return null;

  const relevantBrands = activeCategory === 'laptop' 
    ? mockBrands.filter((b) => ['Apple (Macbook)', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer'].includes(b.name))
    : mockBrands.filter((b) => ['Samsung'].includes(b.name));

  const featuredLinks = activeCategory === 'laptop' ? [
    { label: 'Laptop Hi-End', href: '/laptops/hi-end' },
    { label: 'Laptop RTX 5000 series', href: '/laptops/rtx-5000' },
    { label: 'Laptop cũ', href: '/laptops/cu' },
    { label: 'Gói bảo hành mở rộng', href: '/warranty' },
  ] : [
    { label: 'iPhone mới nhất', href: '/smartphones/iphone' },
    { label: 'Điện thoại 5G', href: '/smartphones/5g' },
    { label: 'Điện thoại gaming', href: '/smartphones/gaming' },
  ];

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/20 z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Mega Menu Content */}
      <div className="absolute left-0 right-0 top-full bg-white border-t border-gray-200 shadow-2xl z-50 animate-slide-down">
        <div className="container-custom py-8">
          <div className="grid grid-cols-12 gap-8">
            {/* Left Column - Categories */}
            <div className="col-span-3">
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
                {categoryData.name}
              </h3>
              <ul className="space-y-2">
                {categoryData.children?.map((subCat) => (
                  <li key={subCat.id}>
                    <Link
                      to={`/products?category=${subCat.id}`}
                      onClick={onClose}
                      className="group flex items-center justify-between py-2 px-3 rounded-lg hover:bg-primary-50 transition-colors"
                    >
                      <span className="text-gray-700 group-hover:text-primary-700 font-medium text-sm">
                        {subCat.name}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Middle Column - Brands */}
            <div className="col-span-4">
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
                Thương hiệu
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {relevantBrands.map((brand) => (
                  <Link
                    key={brand.id}
                    to={`/products?brand=${brand.id}`}
                    onClick={onClose}
                    className="group flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-white transition-colors">
                      <span className="text-2xl">{brand.name.charAt(0)}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 group-hover:text-primary-700">
                      {brand.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Column - Featured & Highlights */}
            <div className="col-span-5">
              <div className="grid grid-cols-2 gap-6">
                {/* Featured Links */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
                    Nhu cầu
                  </h3>
                  <ul className="space-y-2">
                    {featuredLinks.map((link, index) => (
                      <li key={index}>
                        <Link
                          to={link.href}
                          onClick={onClose}
                          className="group flex items-center space-x-2 py-2 px-3 rounded-lg hover:bg-primary-50 transition-colors"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-500 group-hover:scale-150 transition-transform"></span>
                          <span className="text-gray-700 group-hover:text-primary-700 text-sm font-medium">
                            {link.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Promotional Banner */}
                <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl p-6 text-white">
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-accent-400 rounded-full text-xs font-bold">
                      HOT DEAL
                    </span>
                  </div>
                  <h4 className="text-lg font-bold mb-2">
                    Giảm đến 50%
                  </h4>
                  <p className="text-sm text-blue-100 mb-4">
                    Cho {categoryData.name.toLowerCase()} cao cấp
                  </p>
                  <Link
                    to="/deals"
                    onClick={onClose}
                    className="inline-flex items-center text-sm font-semibold hover:underline"
                  >
                    Xem ngay
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
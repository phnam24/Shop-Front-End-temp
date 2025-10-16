import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockDataService } from '../services/mockDataService';
import type { Product } from '../types';

interface ProductSearchProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({
  onSearch,
  placeholder = 'Tìm kiếm sản phẩm...',
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);



  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length >= 2) {
      // Debounce search
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        searchProducts(query);
      }, 300);
    } else {
      setResults([]);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query]);

  const searchProducts = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const products = await mockDataService.getProducts({
        search: searchQuery,
        pageSize: 5,
      });
      setResults(products.items);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      // Save to recent searches
      const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      
      onSearch?.(searchQuery);
      setIsFocused(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      handleSearch(query);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };

  const removeRecentSearch = (search: string) => {
    const updated = recentSearches.filter(s => s !== search);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const showDropdown = isFocused && (query.length >= 2 || recentSearches.length > 0);

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100 transition-all bg-gray-50 focus:bg-white"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto animate-slide-down">
          {/* Loading State */}
          {isLoading && (
            <div className="p-4 text-center">
              <div className="inline-block w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Search Results */}
          {!isLoading && query.length >= 2 && results.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Kết quả tìm kiếm
              </div>
              {results.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  onClick={() => handleSearch(query)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <img
                    src={product.firstImage || product.avatar}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{product.name}</div>
                    <div className="text-sm text-gray-600">{product.brand?.name}</div>
                  </div>
                  <div className="text-sm font-bold text-primary-700 whitespace-nowrap">
                    {formatPrice(product.minPrice || 0)}
                  </div>
                </Link>
              ))}
              <Link
                to={`/products?search=${query}`}
                onClick={() => handleSearch(query)}
                className="block px-4 py-3 text-center text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors border-t border-gray-200"
              >
                Xem tất cả kết quả
              </Link>
            </div>
          )}

          {/* No Results */}
          {!isLoading && query.length >= 2 && results.length === 0 && (
            <div className="p-8 text-center">
              <div className="text-4xl mb-2">🔍</div>
              <div className="text-gray-900 font-medium mb-1">Không tìm thấy sản phẩm</div>
              <div className="text-sm text-gray-600">Thử tìm kiếm với từ khóa khác</div>
            </div>
          )}

          {/* Recent Searches */}
          {query.length < 2 && recentSearches.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Tìm kiếm gần đây
              </div>
              {recentSearches.map((search, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors group"
                >
                  <button
                    onClick={() => {
                      setQuery(search);
                      handleSearch(search);
                    }}
                    className="flex-1 text-left text-gray-900 text-sm"
                  >
                    {search}
                  </button>
                  <button
                    onClick={() => removeRecentSearch(search)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Trending Searches (Optional) */}
          {query.length < 2 && recentSearches.length === 0 && (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                Tìm kiếm phổ biến
              </div>
              {['MacBook', 'Dell XPS', 'Gaming Laptop', 'iPhone', 'Samsung'].map((term, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(term);
                    handleSearch(term);
                  }}
                  className="block w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-sm text-gray-900"
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, Grid, List, ChevronDown, X, SlidersHorizontal, Home } from 'lucide-react';
import { ProductCard } from '../domains/products/components/ProductCard';
import { mockDataService, mockBrands, mockCategories } from '../domains/products/services/mockDataService';
import type { Product, ProductFilters, ProductSortOption } from '../domains/products/types';

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filters state
  const [filters, setFilters] = useState<ProductFilters>({
    categoryId: searchParams.get('category') ? Number(searchParams.get('category')) : undefined,
    brandIds: searchParams.get('brand') ? [Number(searchParams.get('brand'))] : [],
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    ramGb: [],
    inStock: searchParams.get('inStock') === 'true',
    onSale: searchParams.get('onSale') === 'true',
  });

  const [sort, setSort] = useState<ProductSortOption>({
    field: 'createdAt',
    order: 'desc',
  });

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 12,
    total: 0,
    totalPages: 0,
  });

  // Get category name
  const getCategoryName = () => {
    if (!filters.categoryId) return 'Tất cả sản phẩm';
    const allCategories = mockCategories.flatMap(c => [c, ...(c.children || [])]);
    const category = allCategories.find(c => c.id === filters.categoryId);
    return category?.name || 'Sản phẩm';
  };

  // Load products
  useEffect(() => {
    loadProducts();
  }, [filters, sort, pagination.page]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const result = await mockDataService.getProducts({
        ...filters,
        sort,
        page: pagination.page,
        pageSize: pagination.pageSize,
      });

      setProducts(result.items);
      setPagination({
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
        totalPages: result.totalPages,
      });
    } catch (error) {
      console.error('Load products error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle filter changes
  const handleBrandToggle = (brandId: number) => {
    setFilters(prev => {
      const brandIds = prev.brandIds || [];
      const newBrandIds = brandIds.includes(brandId)
        ? brandIds.filter(id => id !== brandId)
        : [...brandIds, brandId];
      return { ...prev, brandIds: newBrandIds };
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePriceRangeChange = (min?: number, max?: number) => {
    setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleRAMToggle = (ram: number) => {
    setFilters(prev => {
      const ramGb = prev.ramGb || [];
      const newRamGb = ramGb.includes(ram)
        ? ramGb.filter(r => r !== ram)
        : [...ramGb, ram];
      return { ...prev, ramGb: newRamGb };
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleStockToggle = () => {
    setFilters(prev => ({ ...prev, inStock: !prev.inStock }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSaleToggle = () => {
    setFilters(prev => ({ ...prev, onSale: !prev.onSale }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      categoryId: filters.categoryId, // Keep category
      brandIds: [],
      ramGb: [],
      inStock: false,
      onSale: false,
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSortChange = (field: ProductSortOption['field'], order: 'asc' | 'desc') => {
    setSort({ field, order });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Count active filters
  const activeFiltersCount = 
    (filters.brandIds?.length || 0) +
    (filters.ramGb?.length || 0) +
    (filters.minPrice || filters.maxPrice ? 1 : 0) +
    (filters.inStock ? 1 : 0) +
    (filters.onSale ? 1 : 0);

  const handleAddToCart = (product: Product) => {
    console.log('Add to cart:', product);
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const handleAddToWishlist = (product: Product) => {
    console.log('Add to wishlist:', product);
    alert(`Đã thêm "${product.name}" vào yêu thích!`);
  };

  // Filter Sidebar Component
  const FilterSidebar = () => (
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
            onClick={clearFilters}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      {/* Brand Filter */}
      <div className="border-b border-gray-200 pb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Thương hiệu</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {mockBrands.slice(0, 9).map((brand) => (
            <label key={brand.id} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.brandIds?.includes(brand.id)}
                onChange={() => handleBrandToggle(brand.id)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700 group-hover:text-primary-700">
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
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700 group-hover:text-primary-700">
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
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {ram}GB
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
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-700 group-hover:text-primary-700">
            Còn hàng
          </span>
        </label>
        <label className="flex items-center cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.onSale}
            onChange={handleSaleToggle}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-700 group-hover:text-primary-700">
            Đang giảm giá
          </span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6 animate-slide-down">
          <Link to="/" className="hover:text-primary-600 flex items-center">
            <Home className="w-4 h-4" />
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{getCategoryName()}</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {getCategoryName()}
          </h1>
          <p className="text-gray-600">
            Tìm thấy <span className="font-semibold text-primary-700">{pagination.total}</span> sản phẩm
          </p>
        </div>

        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <FilterSidebar />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Top Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                {/* Mobile Filter Button */}
                <button 
                  className="lg:hidden btn btn-outline relative"
                  onClick={() => setShowMobileFilters(true)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Bộ lọc
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* Sort Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-primary-600 transition-colors text-sm">
                    <span className="font-medium">
                      {sort.field === 'name' && 'Tên A-Z'}
                      {sort.field === 'priceList' && (sort.order === 'asc' ? 'Giá thấp → cao' : 'Giá cao → thấp')}
                      {sort.field === 'createdAt' && 'Mới nhất'}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    <div className="py-2">
                      {[
                        { label: 'Mới nhất', field: 'createdAt' as const, order: 'desc' as const },
                        { label: 'Giá thấp → cao', field: 'priceList' as const, order: 'asc' as const },
                        { label: 'Giá cao → thấp', field: 'priceList' as const, order: 'desc' as const },
                        { label: 'Tên A-Z', field: 'name' as const, order: 'asc' as const },
                      ].map((option) => (
                        <button
                          key={`${option.field}-${option.order}`}
                          onClick={() => handleSortChange(option.field, option.order)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-primary-50 transition-colors ${
                            sort.field === option.field && sort.order === option.order
                              ? 'text-primary-700 font-semibold bg-primary-50'
                              : 'text-gray-700'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Active Filters Count */}
                {activeFiltersCount > 0 && (
                  <span className="hidden sm:inline-flex items-center px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                    {activeFiltersCount} bộ lọc đang áp dụng
                  </span>
                )}
              </div>

              {/* View Toggle */}
              <div className="hidden md:flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'grid' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Lưới"
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'list' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Danh sách"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Products Grid/List */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                }`}>
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onAddToWishlist={handleAddToWishlist}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center gap-2">
                      <button
                        disabled={pagination.page === 1}
                        onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                      >
                        Trước
                      </button>
                      {[...Array(Math.min(pagination.totalPages, 5))].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPagination({ ...pagination, page: pageNum })}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                              pagination.page === pageNum
                                ? 'bg-primary-600 text-white shadow-lg'
                                : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button
                        disabled={pagination.page === pagination.totalPages}
                        onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                      >
                        Sau
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <Filter className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-gray-600 mb-6">
                  Hãy thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
                </p>
                <button onClick={clearFilters} className="btn btn-primary">
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)}></div>
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl animate-slide-in-right">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Bộ lọc</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100vh-8rem)]">
              <FilterSidebar />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="btn btn-primary w-full"
              >
                Áp dụng ({activeFiltersCount} bộ lọc)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
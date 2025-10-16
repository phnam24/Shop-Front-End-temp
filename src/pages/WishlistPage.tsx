import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  ChevronRight,
  Heart,
  Trash2,
  ShoppingCart,
  Loader2,
  X,
} from 'lucide-react';
import { useWishlistStore } from '../domains/wishlist/store/wishlistStore';
import { useCartStore } from '../domains/cart/store/cartStore';
import { useToast } from '../shared/hooks/useToast';
import { WishlistButton } from '../domains/wishlist/components/WishlistButton';

const WishlistPage: React.FC = () => {
  const { toast } = useToast();
  const { items, isLoading, fetchWishlist, removeFromWishlist, clearWishlist } =
    useWishlistStore();
  const { addItem: addToCart } = useCartStore();

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart({
        productId,
        quantity: 1,
      });
      toast.success('Đã thêm vào giỏ hàng');
    } catch (error: any) {
      toast.error(error.message || 'Không thể thêm vào giỏ hàng');
    }
  };

  const handleClearAll = async () => {
    setIsClearing(true);
    try {
      await clearWishlist();
      setShowClearConfirm(false);
      toast.success('Đã xóa tất cả sản phẩm yêu thích');
    } catch (error: any) {
      toast.error(error.message || 'Không thể xóa danh sách yêu thích');
    } finally {
      setIsClearing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải danh sách yêu thích...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6 animate-slide-down">
          <Link to="/" className="hover:text-primary-600 flex items-center">
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Sản phẩm yêu thích</span>
        </nav>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8 animate-slide-up">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Sản phẩm yêu thích
            </h1>
            <p className="text-gray-600">
              Bạn có {items.length} sản phẩm trong danh sách yêu thích
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="hidden md:flex btn btn-ghost items-center gap-2 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-5 h-5" />
              Xóa tất cả
            </button>
          )}
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center animate-fade-in">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Danh sách yêu thích trống
            </h2>
            <p className="text-gray-600 mb-6">
              Hãy thêm những sản phẩm yêu thích của bạn vào đây!
            </p>
            <Link to="/products" className="btn btn-primary px-8">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Khám phá sản phẩm
            </Link>
          </div>
        ) : (
          <>
            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all group"
                >
                  {/* Product Image */}
                  <Link
                    to={`/products/${item.product.slug}`}
                    className="relative block aspect-square overflow-hidden bg-gray-100"
                  >
                    <img
                      src={item.product.thumbnail}
                      alt={item.product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />

                    {/* Discount Badge */}
                    {item.product.discount && item.product.discount > 0 && (
                      <div className="absolute top-3 left-3">
                        <span className="badge bg-red-500 text-white px-3 py-1 font-bold shadow-lg">
                          -{item.product.discount}%
                        </span>
                      </div>
                    )}

                    {/* Wishlist Button */}
                    <div className="absolute top-3 right-3">
                      <WishlistButton productId={item.product.id} size="md" />
                    </div>

                    {/* Stock Status */}
                    {!item.product.inStock && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">
                          Hết hàng
                        </span>
                      </div>
                    )}
                  </Link>

                  {/* Product Info */}
                  <div className="p-4">
                    <Link to={`/products/${item.product.slug}`}>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
                        {item.product.name}
                      </h3>
                    </Link>

                    <p className="text-sm text-gray-600 mb-3">{item.product.brand}</p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 fill-accent-400 text-accent-400" />
                        <span className="text-sm font-semibold text-gray-700 ml-1">
                          {item.product.rating}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        ({item.product.reviewCount})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-primary-700">
                          {formatPrice(item.product.price)}
                        </span>
                        {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(item.product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(item.product.id)}
                      disabled={!item.product.inStock}
                      className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      {item.product.inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Clear All Button */}
            <div className="md:hidden mt-6">
              <button
                onClick={() => setShowClearConfirm(true)}
                className="w-full flex items-center justify-center text-sm text-red-600 hover:text-red-700 font-medium py-3 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa tất cả sản phẩm
              </button>
            </div>
          </>
        )}
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Xóa tất cả?</h3>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-6">
                Bạn có chắc chắn muốn xóa tất cả {items.length} sản phẩm khỏi danh sách yêu thích không?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="btn btn-ghost flex-1 py-3"
                  disabled={isClearing}
                >
                  Hủy
                </button>
                <button
                  onClick={handleClearAll}
                  disabled={isClearing}
                  className="btn bg-red-500 text-white hover:bg-red-600 flex-1 py-3 disabled:opacity-50"
                >
                  {isClearing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Đang xóa...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5 mr-2" />
                      Xóa tất cả
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;


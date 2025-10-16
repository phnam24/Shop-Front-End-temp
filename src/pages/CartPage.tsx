import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  ArrowLeft,
  Tag,
  Trash2,
  Loader2,
  ChevronRight,
  ShoppingBag,
  X,
} from 'lucide-react';
import { useCartStore } from '../domains/cart/store/cartStore';
import { useToast } from '../shared/hooks/useToast';
import { CartItem } from '../domains/cart/components/CartItem';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    cart,
    isLoading,
    fetchCart,
    updateItemQuantity,
    removeItem,
    clearCart,
    applyDiscount,
    removeDiscount,
  } = useCartStore();

  const [discountCode, setDiscountCode] = useState('');
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Load cart on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    try {
      await updateItemQuantity(itemId, quantity);
    } catch (error: any) {
      toast.error(error.message || 'Không thể cập nhật số lượng');
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeItem(itemId);
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
    } catch (error: any) {
      toast.error(error.message || 'Không thể xóa sản phẩm');
    }
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      toast.warning('Vui lòng nhập mã giảm giá');
      return;
    }

    setIsApplyingDiscount(true);
    try {
      await applyDiscount(discountCode.trim());
      toast.success('Áp dụng mã giảm giá thành công! 🎉');
      setDiscountCode('');
    } catch (error: any) {
      toast.error(error.message || 'Mã giảm giá không hợp lệ');
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  const handleRemoveDiscount = async () => {
    try {
      await removeDiscount();
      toast.info('Đã xóa mã giảm giá');
    } catch (error: any) {
      toast.error(error.message || 'Không thể xóa mã giảm giá');
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      toast.success('Đã xóa toàn bộ giỏ hàng');
      setShowClearConfirm(false);
    } catch (error: any) {
      toast.error(error.message || 'Không thể xóa giỏ hàng');
    }
  };

  const handleCheckout = () => {
    if (!cart || cart.items.length === 0) return;
    navigate('/checkout');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Loading state
  if (isLoading && !cart) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  // Empty cart
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gray-100 flex items-center justify-center animate-scale-in">
              <ShoppingCart className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Giỏ hàng trống
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Bạn chưa có sản phẩm nào trong giỏ hàng.
              <br />
              Hãy khám phá và thêm sản phẩm yêu thích nhé!
            </p>
            <Link to="/products" className="btn btn-primary px-8 py-4 text-base shadow-xl inline-flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8 animate-slide-down">
          <Link
            to="/products"
            className="inline-flex items-center text-sm text-gray-600 hover:text-primary-700 mb-4 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Tiếp tục mua sắm
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Giỏ hàng của bạn
              </h1>
              <p className="text-gray-600">
                Bạn có <span className="font-semibold text-primary-700">{cart.itemCount}</span> sản phẩm trong giỏ
              </p>
            </div>
            
            {cart.items.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="hidden md:flex items-center text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa tất cả
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item, index) => (
              <div
                key={item.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CartItem
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              </div>
            ))}
          </div>

          {/* Right: Summary & Checkout */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6 sticky top-24 animate-slide-up">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Thông tin đơn hàng
              </h2>

              {/* Discount Code */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <Tag className="w-4 h-4 mr-2 text-accent-600" />
                  Mã giảm giá
                </h3>
                
                {cart.discountCode ? (
                  <div className="flex items-center justify-between p-3 bg-success-50 border border-success-200 rounded-lg">
                    <div className="flex items-center">
                      <Tag className="w-4 h-4 text-success-600 mr-2" />
                      <span className="font-bold text-success-700">
                        {cart.discountCode}
                      </span>
                      <span className="ml-2 text-xs text-success-600">
                        (-{cart.discountPercent}%)
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveDiscount}
                      className="p-1 hover:bg-success-100 rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-success-600" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                      onKeyPress={(e) => e.key === 'Enter' && handleApplyDiscount()}
                      placeholder="Nhập mã giảm giá"
                      className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary-600 transition-colors"
                      disabled={isApplyingDiscount}
                    />
                    <button
                      onClick={handleApplyDiscount}
                      disabled={isApplyingDiscount || !discountCode.trim()}
                      className="btn btn-outline px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isApplyingDiscount ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Áp dụng'
                      )}
                    </button>
                  </div>
                )}

                <p className="mt-2 text-xs text-gray-500">
                  💡 Mã demo: <span className="font-semibold">WELCOME10</span>, <span className="font-semibold">FLASH20</span>
                </p>
              </div>

              {/* Summary */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính ({cart.itemCount} sản phẩm)</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(cart.subtotal)}
                  </span>
                </div>

                {cart.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Giảm giá</span>
                    <span className="font-semibold text-success-600">
                      -{formatPrice(cart.discount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span className="font-semibold text-gray-900">
                    {cart.shipping === 0 ? (
                      <span className="text-success-600">Miễn phí</span>
                    ) : (
                      formatPrice(cart.shipping)
                    )}
                  </span>
                </div>

                {cart.subtotal <= 5000000 && cart.shipping > 0 && (
                  <p className="text-xs text-orange-600">
                    ⚠️ Mua thêm {formatPrice(5000000 - cart.subtotal)} để được miễn phí ship
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-baseline pt-4 border-t-2 border-gray-200 mb-6">
                <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
                <span className="text-2xl font-bold text-primary-900">
                  {formatPrice(cart.total)}
                </span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="btn btn-primary w-full py-4 text-base shadow-xl hover:shadow-2xl transition-all mb-3"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Tiến hành thanh toán
              </button>

              <Link
                to="/products"
                className="btn btn-ghost w-full py-3 text-sm"
              >
                Tiếp tục mua sắm
              </Link>

              {/* Info */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-2 text-xs text-gray-600">
                <p className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Miễn phí vận chuyển cho đơn hàng trên 5 triệu</span>
                </p>
                <p className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Đổi trả trong 15 ngày</span>
                </p>
                <p className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Bảo hành chính hãng 24 tháng</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Clear All Button */}
        {cart.items.length > 0 && (
          <div className="md:hidden mt-6">
            <button
              onClick={() => setShowClearConfirm(true)}
              className="w-full flex items-center justify-center text-sm text-red-600 hover:text-red-700 font-medium py-3 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Xóa tất cả sản phẩm
            </button>
          </div>
        )}
      </div>

      {/* Clear Cart Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-scale-in">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Xóa toàn bộ giỏ hàng?
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa tất cả {cart.itemCount} sản phẩm khỏi giỏ hàng?
              Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleClearCart}
                className="flex-1 btn bg-red-600 hover:bg-red-700 text-white py-3"
              >
                Xóa tất cả
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 btn btn-ghost py-3"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;


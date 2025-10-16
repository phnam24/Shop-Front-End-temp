import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Home,
  ChevronRight,
  Package,
  MapPin,
  CreditCard,
  FileText,
  Clock,
  Loader2,
  X,
  AlertCircle,
  CheckCircle,
  Truck,
  Box,
} from 'lucide-react';
import { orderService } from '../domains/order/services/orderService';
import { useToast } from '../shared/hooks/useToast';
import type { Order } from '../domains/order/types';

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    if (!orderId) {
      navigate('/');
      return;
    }

    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    if (!orderId) return;

    setIsLoading(true);
    try {
      const orderData = await orderService.getOrderById(orderId);
      setOrder(orderData);
    } catch (error: any) {
      toast.error(error.message || 'Không thể tải thông tin đơn hàng');
      setTimeout(() => navigate('/'), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order || !cancelReason.trim()) {
      toast.error('Vui lòng nhập lý do hủy đơn');
      return;
    }

    setIsCancelling(true);
    try {
      const updatedOrder = await orderService.cancelOrder(order.id, cancelReason);
      setOrder(updatedOrder);
      setShowCancelModal(false);
      setCancelReason('');
      toast.success('Đã hủy đơn hàng thành công');
    } catch (error: any) {
      toast.error(error.message || 'Không thể hủy đơn hàng');
    } finally {
      setIsCancelling(false);
    }
  };

  const getPaymentMethodName = (method: string) => {
    const methods: Record<string, string> = {
      COD: 'Thanh toán khi nhận hàng',
      VNPAY: 'VNPay',
      MOMO: 'MoMo',
    };
    return methods[method] || method;
  };

  const getOrderStatusLabel = (status: string) => {
    const labels: Record<string, { text: string; color: string; icon: any }> = {
      PENDING: { text: 'Chờ xác nhận', color: 'text-amber-600 bg-amber-50', icon: Clock },
      CONFIRMED: { text: 'Đã xác nhận', color: 'text-blue-600 bg-blue-50', icon: CheckCircle },
      PROCESSING: { text: 'Đang xử lý', color: 'text-purple-600 bg-purple-50', icon: Box },
      SHIPPING: { text: 'Đang giao hàng', color: 'text-indigo-600 bg-indigo-50', icon: Truck },
      DELIVERED: { text: 'Đã giao hàng', color: 'text-success-600 bg-success-50', icon: CheckCircle },
      CANCELLED: { text: 'Đã hủy', color: 'text-red-600 bg-red-50', icon: X },
      RETURNED: { text: 'Đã hoàn trả', color: 'text-gray-600 bg-gray-50', icon: Package },
    };
    return labels[status] || { text: status, color: 'text-gray-600 bg-gray-50', icon: Package };
  };

  const canCancelOrder = (order: Order) => {
    return ['PENDING', 'CONFIRMED'].includes(order.status);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy đơn hàng
          </h2>
          <Link to="/" className="btn btn-primary mt-4">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = getOrderStatusLabel(order.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6 animate-slide-down">
          <Link to="/" className="hover:text-primary-600 flex items-center">
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/profile?tab=orders" className="hover:text-primary-600">
            Đơn hàng
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{order.orderCode}</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8 animate-slide-up">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Chi tiết đơn hàng
              </h1>
              <p className="text-gray-600">Mã đơn hàng: <span className="font-semibold">{order.orderCode}</span></p>
            </div>
            <div className={`px-6 py-3 rounded-xl ${statusInfo.color} flex items-center gap-2`}>
              <StatusIcon className="w-5 h-5" />
              <span className="font-bold">{statusInfo.text}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Timeline */}
            {order.timeline && order.timeline.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 animate-slide-in-left">
                <h2 className="font-bold text-gray-900 mb-6 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-primary-600" />
                  Lịch sử đơn hàng
                </h2>
                <div className="space-y-4">
                  {order.timeline.map((event, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            index === 0
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        {index < order.timeline.length - 1 && (
                          <div className="w-0.5 h-12 bg-gray-200 my-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-semibold text-gray-900 mb-1">{event.status}</p>
                        <p className="text-sm text-gray-600 mb-1">
                          {new Date(event.timestamp).toLocaleString('vi-VN')}
                        </p>
                        {event.description && (
                          <p className="text-sm text-gray-500">{event.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 animate-slide-in-left animation-delay-100">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-primary-600" />
                Sản phẩm ({order.items.length})
              </h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0"
                  >
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.productName}</h3>
                      {item.variantInfo && (
                        <p className="text-sm text-gray-600 mt-1">{item.variantInfo}</p>
                      )}
                      <p className="text-sm text-gray-700 mt-1">Số lượng: x{item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {item.price.toLocaleString('vi-VN')}đ
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Tổng: {item.subtotal.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Note */}
            {order.note && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 animate-slide-in-left animation-delay-200">
                <h2 className="font-bold text-gray-900 mb-3 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-primary-600" />
                  Ghi chú đơn hàng
                </h2>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{order.note}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-24 animate-slide-in-right">
              <h3 className="font-bold text-gray-900 mb-4">Tổng quan đơn hàng</h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-1">Thời gian đặt</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(order.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CreditCard className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-1">Thanh toán</p>
                    <p className="text-sm font-medium text-gray-900">
                      {getPaymentMethodName(order.paymentMethod)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span className="text-sm">Tạm tính:</span>
                  <span className="text-sm font-medium">
                    {order.subtotal.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="text-sm">Vận chuyển:</span>
                  <span className="text-sm font-medium">
                    {order.shippingFee > 0
                      ? `${order.shippingFee.toLocaleString('vi-VN')}đ`
                      : 'Miễn phí'}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-success-600">
                    <span className="text-sm">Giảm giá:</span>
                    <span className="text-sm font-medium">
                      -{order.discount.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-gray-900">Tổng cộng:</span>
                <span className="text-xl font-bold text-primary-700">
                  {order.total.toLocaleString('vi-VN')}đ
                </span>
              </div>

              {canCancelOrder(order) && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="btn bg-red-500 text-white hover:bg-red-600 w-full py-3"
                >
                  <X className="w-5 h-5 mr-2" />
                  Hủy đơn hàng
                </button>
              )}
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 animate-slide-in-right animation-delay-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-primary-600" />
                Địa chỉ giao hàng
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-900 mb-2">
                  {order.shippingAddress.fullName}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  SĐT: {order.shippingAddress.phone}
                </p>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress.streetAddress}, {order.shippingAddress.ward},{' '}
                  {order.shippingAddress.district}, {order.shippingAddress.province}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Hủy đơn hàng</h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start">
                <AlertCircle className="w-5 h-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-amber-800 font-semibold mb-1">
                    Lưu ý khi hủy đơn hàng
                  </p>
                  <p className="text-sm text-amber-700">
                    Sau khi hủy, bạn sẽ không thể khôi phục lại đơn hàng này. Vui lòng cân nhắc kỹ trước khi xác nhận.
                  </p>
                </div>
              </div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Lý do hủy đơn <span className="text-red-500">*</span>
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="input-field resize-none"
                rows={4}
                placeholder="Vui lòng cho chúng tôi biết lý do bạn muốn hủy đơn hàng..."
                disabled={isCancelling}
              />

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="btn btn-ghost flex-1 py-3"
                  disabled={isCancelling}
                >
                  Đóng
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={isCancelling || !cancelReason.trim()}
                  className="btn bg-red-500 text-white hover:bg-red-600 flex-1 py-3 disabled:opacity-50"
                >
                  {isCancelling ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Đang hủy...
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5 mr-2" />
                      Xác nhận hủy
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

export default OrderDetailPage;


import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Package,
  MapPin,
  CreditCard,
  Clock,
  Home,
  Loader2,
  FileText,
} from 'lucide-react';
import { orderService } from '../domains/order/services/orderService';
import { useToast } from '../shared/hooks/useToast';
import type { Order } from '../domains/order/types';

const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const getPaymentMethodName = (method: string) => {
    const methods: Record<string, string> = {
      COD: 'Thanh toán khi nhận hàng',
      VNPAY: 'VNPay',
      MOMO: 'MoMo',
    };
    return methods[method] || method;
  };

  const getOrderStatusLabel = (status: string) => {
    const labels: Record<string, { text: string; color: string }> = {
      PENDING: { text: 'Chờ xác nhận', color: 'text-amber-600' },
      CONFIRMED: { text: 'Đã xác nhận', color: 'text-blue-600' },
      PROCESSING: { text: 'Đang xử lý', color: 'text-purple-600' },
      SHIPPING: { text: 'Đang giao hàng', color: 'text-indigo-600' },
      DELIVERED: { text: 'Đã giao hàng', color: 'text-success-600' },
      CANCELLED: { text: 'Đã hủy', color: 'text-red-600' },
      RETURNED: { text: 'Đã hoàn trả', color: 'text-gray-600' },
    };
    return labels[status] || { text: status, color: 'text-gray-600' };
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8 md:py-12">
        {/* Success Header */}
        <div className="max-w-2xl mx-auto text-center mb-8 animate-scale-in">
          <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
            <CheckCircle className="w-12 h-12 text-success-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Đặt hàng thành công!
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Cảm ơn bạn đã mua sắm tại TechStore
          </p>
          <p className="text-gray-600">
            Đơn hàng của bạn đã được tiếp nhận và đang được xử lý.
          </p>
        </div>

        {/* Order Info */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Order Number & Status */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 animate-slide-up">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Mã đơn hàng</p>
                <p className="text-2xl font-bold text-gray-900">{order.orderCode}</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-sm text-gray-600 mb-1">Trạng thái</p>
                <span className={`text-lg font-bold ${statusInfo.color}`}>
                  {statusInfo.text}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600 mb-1">Thời gian đặt hàng</p>
                  <p className="font-medium text-gray-900">
                    {new Date(order.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CreditCard className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600 mb-1">Thanh toán</p>
                  <p className="font-medium text-gray-900">
                    {getPaymentMethodName(order.paymentMethod)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 animate-slide-up animation-delay-100">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-primary-600" />
              Địa chỉ giao hàng
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-900 mb-2">{order.shippingAddress.fullName}</p>
              <p className="text-sm text-gray-700 mb-1">
                SĐT: {order.shippingAddress.phone}
              </p>
              <p className="text-sm text-gray-600">
                {order.shippingAddress.streetAddress}, {order.shippingAddress.ward},{' '}
                {order.shippingAddress.district}, {order.shippingAddress.province}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 animate-slide-up animation-delay-200">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-primary-600" />
              Sản phẩm đã đặt ({order.items.length})
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
                      {item.subtotal.toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Tạm tính:</span>
                <span className="font-medium">
                  {order.subtotal.toLocaleString('vi-VN')}đ
                </span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Phí vận chuyển:</span>
                <span className="font-medium">
                  {order.shippingFee > 0
                    ? `${order.shippingFee.toLocaleString('vi-VN')}đ`
                    : 'Miễn phí'}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-success-600">
                  <span>Giảm giá:</span>
                  <span className="font-medium">
                    -{order.discount.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="text-lg font-bold text-gray-900">Tổng cộng:</span>
                <span className="text-2xl font-bold text-primary-700">
                  {order.total.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>
          </div>

          {/* Order Note */}
          {order.note && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 animate-slide-up animation-delay-300">
              <h2 className="font-bold text-gray-900 mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary-600" />
                Ghi chú đơn hàng
              </h2>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{order.note}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in animation-delay-400">
            <Link to={`/orders/${order.id}`} className="btn btn-primary flex-1 py-3 text-center">
              <Package className="w-5 h-5 mr-2" />
              Xem chi tiết đơn hàng
            </Link>
            <Link to="/" className="btn btn-outline flex-1 py-3 text-center">
              <Home className="w-5 h-5 mr-2" />
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;


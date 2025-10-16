import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Home,
  ChevronRight,
  MapPin,
  Plus,
  CreditCard,
  Package,
  AlertCircle,
  Loader2,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { Stepper } from '../shared/components/ui/Stepper';
import type { Step } from '../shared/components/ui/Stepper';
import { useCartStore } from '../domains/cart/store/cartStore';
import { useAuthStore } from '../domains/auth/store/authStore';
import { userService } from '../domains/user/services/userService';
import { orderService } from '../domains/order/services/orderService';
import { useToast } from '../shared/hooks/useToast';
import type { Address } from '../domains/user/types';
import type { CreateOrderRequest, PaymentMethod } from '../domains/order/types';

const CHECKOUT_STEPS: Step[] = [
  { id: 'address', label: 'Địa chỉ', description: 'Chọn địa chỉ giao hàng' },
  { id: 'payment', label: 'Thanh toán', description: 'Chọn phương thức' },
  { id: 'review', label: 'Xác nhận', description: 'Kiểm tra đơn hàng' },
];

const PAYMENT_METHODS: { id: PaymentMethod; name: string; icon: string; description: string }[] = [
  {
    id: 'COD',
    name: 'Thanh toán khi nhận hàng (COD)',
    icon: '💵',
    description: 'Thanh toán bằng tiền mặt khi nhận hàng',
  },
  {
    id: 'VNPAY',
    name: 'VNPay',
    icon: '💳',
    description: 'Thanh toán qua ví điện tử VNPay',
  },
  {
    id: 'MOMO',
    name: 'MoMo',
    icon: '📱',
    description: 'Thanh toán qua ví điện tử MoMo',
  },
];

interface NewAddressFormData {
  fullName: string;
  phone: string;
  streetAddress: string;
  ward: string;
  district: string;
  province: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuthStore();
  const { cart, getTotal, clearCart, fetchCart } = useCartStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Address
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Step 2: Payment
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('COD');

  // Step 3: Order note
  const [orderNote, setOrderNote] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewAddressFormData>();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth?redirect=/checkout');
      return;
    }
  }, [isAuthenticated, navigate]);

  // Load addresses and cart
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [addressesData] = await Promise.all([
        userService.getAddresses(),
        fetchCart(),
      ]);

      setAddresses(addressesData);

      // Select default address or first one
      const defaultAddr = addressesData.find((a) => a.isDefault);
      setSelectedAddress(defaultAddr || addressesData[0] || null);
    } catch (error: any) {
      toast.error(error.message || 'Không thể tải dữ liệu');
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if cart is empty
  useEffect(() => {
    if (!isLoading && (!cart || cart.items.length === 0)) {
      toast.warning('Giỏ hàng trống. Hãy thêm sản phẩm trước khi thanh toán.');
      navigate('/cart');
    }
  }, [cart, isLoading, navigate, toast]);

  const handleAddNewAddress = async (data: NewAddressFormData) => {
    try {
      const newAddress = await userService.createAddress({
        ...data,
        isDefault: false,
      });

      setAddresses([...addresses, newAddress]);
      setSelectedAddress(newAddress);
      setShowAddressForm(false);
      reset();
      toast.success('Đã thêm địa chỉ mới');
    } catch (error: any) {
      toast.error(error.message || 'Không thể thêm địa chỉ');
    }
  };

  const handleNext = () => {
    // Validation for each step
    if (currentStep === 0 && !selectedAddress) {
      toast.error('Vui lòng chọn địa chỉ giao hàng');
      return;
    }

    if (currentStep === 1 && !selectedPayment) {
      toast.error('Vui lòng chọn phương thức thanh toán');
      return;
    }

    if (currentStep < CHECKOUT_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !cart) return;

    try {
      setIsSubmitting(true);

      const orderRequest: CreateOrderRequest = {
        addressId: selectedAddress.id,
        paymentMethod: selectedPayment,
        note: orderNote || undefined,
      };

      const order = await orderService.createOrder(orderRequest);

      // Clear cart after successful order
      await clearCart();

      toast.success('Đặt hàng thành công!');

      // Navigate to order success page
      navigate(`/orders/${order.id}/success`);
    } catch (error: any) {
      toast.error(error.message || 'Không thể đặt hàng. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return null; // Will redirect in useEffect
  }

  const total = getTotal();
  const shipping = cart.shipping || 0;
  const discount = cart.discount || 0;
  const finalTotal = total + shipping - discount;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6 animate-slide-down">
          <Link to="/" className="hover:text-primary-600 flex items-center">
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/cart" className="hover:text-primary-600">
            Giỏ hàng
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Thanh toán</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Thanh toán đơn hàng
          </h1>
          <p className="text-gray-600">
            Hoàn tất đơn hàng của bạn trong 3 bước đơn giản.
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-8 animate-fade-in">
          <Stepper
            steps={CHECKOUT_STEPS}
            currentStep={currentStep}
            onStepClick={setCurrentStep}
            allowClickPrevious={true}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Address */}
            {currentStep === 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <MapPin className="w-6 h-6 mr-3 text-primary-600" />
                    Địa chỉ giao hàng
                  </h2>
                  {!showAddressForm && (
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="btn btn-outline py-2 px-4 text-sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Thêm mới
                    </button>
                  )}
                </div>

                {showAddressForm ? (
                  <form
                    onSubmit={handleSubmit(handleAddNewAddress)}
                    className="space-y-4 p-6 bg-gray-50 rounded-xl border border-gray-200 mb-6"
                  >
                    <h3 className="font-semibold text-gray-900 mb-4">Thêm địa chỉ mới</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Họ và tên
                        </label>
                        <input
                          type="text"
                          {...register('fullName', { required: 'Vui lòng nhập họ tên' })}
                          className="input-field"
                          placeholder="Nguyễn Văn A"
                        />
                        {errors.fullName && (
                          <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Số điện thoại
                        </label>
                        <input
                          type="tel"
                          {...register('phone', {
                            required: 'Vui lòng nhập SĐT',
                            pattern: {
                              value: /^[0-9]{10,11}$/,
                              message: 'SĐT không hợp lệ',
                            },
                          })}
                          className="input-field"
                          placeholder="09xxxxxxxx"
                        />
                        {errors.phone && (
                          <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Địa chỉ đường
                      </label>
                      <input
                        type="text"
                        {...register('streetAddress', { required: 'Vui lòng nhập địa chỉ' })}
                        className="input-field"
                        placeholder="Số nhà, tên đường"
                      />
                      {errors.streetAddress && (
                        <p className="mt-1 text-xs text-red-600">{errors.streetAddress.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Tỉnh/TP
                        </label>
                        <input
                          type="text"
                          {...register('province', { required: 'Vui lòng nhập' })}
                          className="input-field"
                          placeholder="TP. HCM"
                        />
                        {errors.province && (
                          <p className="mt-1 text-xs text-red-600">{errors.province.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Quận/Huyện
                        </label>
                        <input
                          type="text"
                          {...register('district', { required: 'Vui lòng nhập' })}
                          className="input-field"
                          placeholder="Quận 1"
                        />
                        {errors.district && (
                          <p className="mt-1 text-xs text-red-600">{errors.district.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Phường/Xã
                        </label>
                        <input
                          type="text"
                          {...register('ward', { required: 'Vui lòng nhập' })}
                          className="input-field"
                          placeholder="Phường 1"
                        />
                        {errors.ward && (
                          <p className="mt-1 text-xs text-red-600">{errors.ward.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddressForm(false);
                          reset();
                        }}
                        className="btn btn-ghost"
                      >
                        Hủy
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Lưu địa chỉ
                      </button>
                    </div>
                  </form>
                ) : null}

                {addresses.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Bạn chưa có địa chỉ nào</p>
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="btn btn-primary"
                    >
                      Thêm địa chỉ đầu tiên
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <button
                        key={address.id}
                        onClick={() => setSelectedAddress(address)}
                        className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                          selectedAddress?.id === address.id
                            ? 'border-primary-600 bg-primary-50 shadow-md'
                            : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-gray-900">{address.fullName}</h3>
                          {address.isDefault && (
                            <span className="badge bg-primary-100 text-primary-700 text-xs">
                              Mặc định
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mb-1">SĐT: {address.phone}</p>
                        <p className="text-sm text-gray-600">
                          {address.streetAddress}, {address.ward}, {address.district},{' '}
                          {address.province}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 animate-fade-in">
                <h2 className="text-xl font-bold text-gray-900 flex items-center mb-6">
                  <CreditCard className="w-6 h-6 mr-3 text-primary-600" />
                  Phương thức thanh toán
                </h2>

                <div className="space-y-4">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                        selectedPayment === method.id
                          ? 'border-primary-600 bg-primary-50 shadow-md'
                          : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-3xl mr-4">{method.icon}</span>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">{method.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                        </div>
                        {selectedPayment === method.id && (
                          <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                {/* Shipping Address */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-primary-600" />
                    Địa chỉ giao hàng
                  </h3>
                  {selectedAddress && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-semibold text-gray-900">{selectedAddress.fullName}</p>
                      <p className="text-sm text-gray-700 mt-1">SĐT: {selectedAddress.phone}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedAddress.streetAddress}, {selectedAddress.ward},{' '}
                        {selectedAddress.district}, {selectedAddress.province}
                      </p>
                    </div>
                  )}
                  <button
                    onClick={() => setCurrentStep(0)}
                    className="text-primary-600 hover:text-primary-700 text-sm mt-3 font-medium"
                  >
                    Thay đổi
                  </button>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-primary-600" />
                    Phương thức thanh toán
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900">
                      {PAYMENT_METHODS.find((m) => m.id === selectedPayment)?.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-primary-600 hover:text-primary-700 text-sm mt-3 font-medium"
                  >
                    Thay đổi
                  </button>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-primary-600" />
                    Sản phẩm ({cart.items.length})
                  </h3>
                  <div className="space-y-4">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0">
                        <img
                          src={item.product.thumbnail}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{item.product.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.variant ? (
                              <>
                                {item.variant.color} / {item.variant.ram} / {item.variant.storage}
                              </>
                            ) : (
                              'Mặc định'
                            )}
                          </p>
                          <p className="text-sm text-gray-700 mt-1">x{item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary-700">
                            {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Note */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <label className="block font-semibold text-gray-900 mb-3">
                    Ghi chú đơn hàng (tùy chọn)
                  </label>
                  <textarea
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    className="input-field resize-none"
                    rows={3}
                    placeholder="Ví dụ: Giao hàng giờ hành chính, gọi trước khi giao..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2 text-primary-600" />
                Tổng quan đơn hàng
              </h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span>Tạm tính:</span>
                  <span className="font-medium">{total.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Phí vận chuyển:</span>
                  <span className="font-medium">
                    {shipping > 0 ? `${shipping.toLocaleString('vi-VN')}đ` : 'Miễn phí'}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-success-600">
                    <span>Giảm giá:</span>
                    <span className="font-medium">-{discount.toLocaleString('vi-VN')}đ</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-gray-900">Tổng cộng:</span>
                <span className="text-2xl font-bold text-primary-700">
                  {finalTotal.toLocaleString('vi-VN')}đ
                </span>
              </div>

              {currentStep === 0 && !selectedAddress && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 flex items-start">
                  <AlertCircle className="w-5 h-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    Vui lòng chọn địa chỉ giao hàng để tiếp tục
                  </p>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="space-y-3">
                {currentStep < 2 ? (
                  <>
                    <button
                      onClick={handleNext}
                      className="btn btn-primary w-full py-3 shadow-lg hover:shadow-xl"
                    >
                      Tiếp tục
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                    {currentStep > 0 && (
                      <button onClick={handleBack} className="btn btn-outline w-full py-3">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Quay lại
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isSubmitting}
                      className="btn btn-primary w-full py-3 text-base shadow-lg hover:shadow-xl disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <Package className="w-5 h-5 mr-2" />
                          Đặt hàng
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleBack}
                      disabled={isSubmitting}
                      className="btn btn-outline w-full py-3"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Quay lại
                    </button>
                  </>
                )}

                <Link
                  to="/cart"
                  className="btn btn-ghost w-full py-3 text-sm"
                >
                  Quay về giỏ hàng
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;


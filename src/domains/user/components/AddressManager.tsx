import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Star,
  X,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { userService } from '../services/userService';
import { useToast } from '../../../shared/hooks/useToast';
import type { Address, CreateAddressRequest } from '../types';

export const AddressManager: React.FC = () => {
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateAddressRequest>();

  // Load addresses
  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getAddresses();
      setAddresses(data);
    } catch (error: any) {
      console.error('Load addresses error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    reset({
      recipientName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      ward: '',
      district: '',
      city: '',
      isDefault: addresses.length === 0, // First address is default
    });
    setShowModal(true);
    setErrorMessage('');
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    reset({
      recipientName: address.recipientName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      ward: address.ward,
      district: address.district,
      city: address.city,
      isDefault: address.isDefault,
    });
    setShowModal(true);
    setErrorMessage('');
  };

  const handleDelete = async (id: string) => {
    try {
      await userService.deleteAddress(id);
      await loadAddresses();
      setDeleteConfirm(null);
      toast.success('Đã xóa địa chỉ thành công');
    } catch (error: any) {
      toast.error(error.message || 'Không thể xóa địa chỉ');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await userService.setDefaultAddress(id);
      await loadAddresses();
      toast.success('Đã đặt địa chỉ mặc định');
    } catch (error: any) {
      toast.error(error.message || 'Không thể đặt địa chỉ mặc định');
    }
  };

  const onSubmit = async (data: CreateAddressRequest) => {
    try {
      setErrorMessage('');
      setIsSaving(true);

      if (editingAddress) {
        await userService.updateAddress(editingAddress.id, data);
        toast.success('Cập nhật địa chỉ thành công');
      } else {
        await userService.createAddress(data);
        toast.success('Thêm địa chỉ mới thành công');
      }

      await loadAddresses();
      setShowModal(false);
      reset();
    } catch (error: any) {
      setErrorMessage(error.message || 'Không thể lưu địa chỉ');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Địa chỉ giao hàng</h2>
          <p className="text-sm text-gray-600">Quản lý địa chỉ nhận hàng của bạn</p>
        </div>
        <button onClick={handleAddNew} className="btn btn-primary">
          <Plus className="w-5 h-5 mr-2" />
          Thêm địa chỉ
        </button>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="text-center py-16">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải...</p>
        </div>
      ) : addresses.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <MapPin className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Chưa có địa chỉ nào
          </h3>
          <p className="text-gray-600 mb-6">
            Thêm địa chỉ giao hàng để checkout nhanh hơn
          </p>
          <button onClick={handleAddNew} className="btn btn-primary">
            <Plus className="w-5 h-5 mr-2" />
            Thêm địa chỉ đầu tiên
          </button>
        </div>
      ) : (
        /* Address List */
        <div className="grid grid-cols-1 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`relative border-2 rounded-xl p-5 transition-all hover:shadow-lg ${
                address.isDefault
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {/* Default Badge */}
              {address.isDefault && (
                <div className="absolute top-3 right-3">
                  <span className="badge bg-primary-600 text-white text-xs flex items-center">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Mặc định
                  </span>
                </div>
              )}

              {/* Content */}
              <div className="pr-20">
                <div className="flex items-start mb-3">
                  <MapPin className="w-5 h-5 text-gray-400 mr-2 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">
                      {address.recipientName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{address.phone}</p>
                    <p className="text-gray-700 leading-relaxed">
                      {address.addressLine1}
                      {address.addressLine2 && `, ${address.addressLine2}`}
                      <br />
                      {address.ward && `${address.ward}, `}
                      {address.district}, {address.city}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="text-sm text-primary-700 hover:text-primary-800 font-medium transition-colors"
                  >
                    Đặt làm mặc định
                  </button>
                )}
                <div className="flex-1"></div>
                <button
                  onClick={() => handleEdit(address)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                  title="Chỉnh sửa"
                >
                  <Edit2 className="w-4 h-4 text-gray-600 group-hover:text-primary-700" />
                </button>
                {!address.isDefault && (
                  <button
                    onClick={() => setDeleteConfirm(address.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
                  </button>
                )}
              </div>

              {/* Delete Confirmation */}
              {deleteConfirm === address.id && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-xl flex items-center justify-center p-4">
                  <div className="text-center">
                    <p className="text-gray-900 font-semibold mb-4">
                      Xác nhận xóa địa chỉ này?
                    </p>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="btn bg-red-600 hover:bg-red-700 text-white"
                      >
                        Xóa
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="btn btn-ghost"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {errorMessage && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-4">
                {/* Recipient Name & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Họ tên người nhận <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('recipientName', {
                        required: 'Vui lòng nhập họ tên',
                        minLength: { value: 3, message: 'Họ tên phải có ít nhất 3 ký tự' },
                      })}
                      className="input-field"
                      placeholder="Nguyễn Văn A"
                    />
                    {errors.recipientName && (
                      <p className="mt-1 text-xs text-red-600">{errors.recipientName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      {...register('phone', {
                        required: 'Vui lòng nhập số điện thoại',
                        pattern: {
                          value: /^[0-9]{10,11}$/,
                          message: 'Số điện thoại không hợp lệ',
                        },
                      })}
                      className="input-field"
                      placeholder="0912345678"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                {/* Address Line 1 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Địa chỉ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('addressLine1', {
                      required: 'Vui lòng nhập địa chỉ',
                      minLength: { value: 10, message: 'Địa chỉ quá ngắn' },
                    })}
                    className="input-field"
                    placeholder="Số nhà, tên đường"
                  />
                  {errors.addressLine1 && (
                    <p className="mt-1 text-xs text-red-600">{errors.addressLine1.message}</p>
                  )}
                </div>

                {/* Address Line 2 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Địa chỉ bổ sung (không bắt buộc)
                  </label>
                  <input
                    type="text"
                    {...register('addressLine2')}
                    className="input-field"
                    placeholder="Toà nhà, khu phố, ..."
                  />
                </div>

                {/* Ward, District, City */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phường/Xã
                    </label>
                    <input
                      type="text"
                      {...register('ward')}
                      className="input-field"
                      placeholder="Phường 1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Quận/Huyện <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('district', {
                        required: 'Vui lòng nhập quận/huyện',
                      })}
                      className="input-field"
                      placeholder="Quận 1"
                    />
                    {errors.district && (
                      <p className="mt-1 text-xs text-red-600">{errors.district.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tỉnh/Thành phố <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('city', {
                        required: 'Vui lòng nhập tỉnh/thành phố',
                      })}
                      className="input-field"
                      placeholder="TP. Hồ Chí Minh"
                    />
                    {errors.city && (
                      <p className="mt-1 text-xs text-red-600">{errors.city.message}</p>
                    )}
                  </div>
                </div>

                {/* Set as Default */}
                {!editingAddress && addresses.length > 0 && (
                  <div>
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        {...register('isDefault')}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 group-hover:text-primary-700">
                        Đặt làm địa chỉ mặc định
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn btn-primary flex-1"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      {editingAddress ? 'Cập nhật' : 'Thêm địa chỉ'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={isSaving}
                  className="btn btn-ghost flex-1"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


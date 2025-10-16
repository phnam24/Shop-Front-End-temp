import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, Calendar, Save, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../auth/store/authStore';
import { userService } from '../services/userService';
import { useToast } from '../../../shared/hooks/useToast';
import type { UpdateProfileRequest } from '../types';

export const ProfileInfo: React.FC = () => {
  const { user, refreshUser } = useAuthStore();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<UpdateProfileRequest>({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: (user as any)?.email || '',
      phone: (user as any)?.phone || '',
      dob: user?.dob || '',
    },
  });

  // Reset form khi user data thay đổi
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: (user as any).email || '',
        phone: (user as any).phone || '',
        dob: user.dob || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: UpdateProfileRequest) => {
    try {
      setErrorMessage('');
      setIsSaving(true);

      await userService.updateProfile(data);
      await refreshUser();

      toast.success('Cập nhật thông tin thành công!');
      setIsEditing(false);
    } catch (error: any) {
      setErrorMessage(error.message || 'Không thể cập nhật thông tin');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
    setErrorMessage('');
  };

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Thông tin cá nhân</h2>
          <p className="text-sm text-gray-600">Quản lý thông tin tài khoản của bạn</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-outline"
          >
            Chỉnh sửa
          </button>
        )}
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-slide-down">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Username (Read-only) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tên đăng nhập
          </label>
          <div className="relative">
            <input
              type="text"
              value={user?.username || ''}
              disabled
              className="input-field bg-gray-100 cursor-not-allowed !pl-12"
            />
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <p className="mt-1 text-xs text-gray-500">Tên đăng nhập không thể thay đổi</p>
        </div>

        {/* First Name & Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
              Họ <span className="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              disabled={!isEditing}
              {...register('firstName', {
                required: 'Vui lòng nhập họ',
                minLength: { value: 2, message: 'Họ phải có ít nhất 2 ký tự' },
              })}
              className={`input-field ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              placeholder="Nguyễn"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
              Tên <span className="text-red-500">*</span>
            </label>
            <input
              id="lastName"
              type="text"
              disabled={!isEditing}
              {...register('lastName', {
                required: 'Vui lòng nhập tên',
                minLength: { value: 2, message: 'Tên phải có ít nhất 2 ký tự' },
              })}
              className={`input-field ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              placeholder="Văn A"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              disabled={!isEditing}
              {...register('email', {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email không hợp lệ',
                },
              })}
              className={`input-field !pl-12 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              placeholder="your.email@example.com"
            />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
            Số điện thoại
          </label>
          <div className="relative">
            <input
              id="phone"
              type="tel"
              disabled={!isEditing}
              {...register('phone', {
                pattern: {
                  value: /^[0-9]{10,11}$/,
                  message: 'Số điện thoại không hợp lệ (10-11 số)',
                },
              })}
              className={`input-field !pl-12 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              placeholder="0912345678"
            />
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="dob" className="block text-sm font-semibold text-gray-700 mb-2">
            Ngày sinh
          </label>
          <div className="relative">
            <input
              id="dob"
              type="date"
              disabled={!isEditing}
              {...register('dob')}
              className={`input-field !pl-12 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              max={new Date().toISOString().split('T')[0]}
            />
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <p className="mt-1 text-xs text-gray-500">Để nhận ưu đãi sinh nhật</p>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSaving || !isDirty}
              className="btn btn-primary flex-1 sm:flex-none"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Lưu thay đổi
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="btn btn-ghost flex-1 sm:flex-none"
            >
              Hủy
            </button>
          </div>
        )}
      </form>

      {/* Account Info */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Thông tin tài khoản</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-600">ID tài khoản</span>
            <span className="text-sm font-mono font-semibold text-gray-900">{user?.id}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-600">Vai trò</span>
            <div className="flex gap-2">
              {user?.roles.map((role) => (
                <span key={role.id} className="badge badge-primary text-xs">
                  {role.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


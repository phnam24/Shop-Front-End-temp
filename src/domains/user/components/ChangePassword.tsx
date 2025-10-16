import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Loader2, CheckCircle2, Shield } from 'lucide-react';
import { useAuthStore } from '../../auth/store/authStore';
import { userService } from '../services/userService';
import { useToast } from '../../../shared/hooks/useToast';
import type { ChangePasswordRequest } from '../types';

interface ChangePasswordFormData extends ChangePasswordRequest {
  confirmPassword: string;
}

export const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const { toast } = useToast();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>();

  const newPassword = watch('newPassword');

  // Calculate password strength
  const calculatePasswordStrength = (password: string): number => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
    return Math.min(strength, 4);
  };

  const passwordStrength = calculatePasswordStrength(newPassword);
  const strengthLabels = ['', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'];
  const strengthColors = ['', 'bg-red-500', 'bg-orange-500', 'bg-success-500', 'bg-success-600'];

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      setErrorMessage('');
      setIsSubmitting(true);

      // Validate passwords
      if (data.currentPassword === data.newPassword) {
        setErrorMessage('Mật khẩu mới phải khác mật khẩu hiện tại');
        return;
      }

      await userService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      toast.success('Đổi mật khẩu thành công! Đang đăng xuất...', 3000);
      reset();

      // Auto logout sau 3 giây
      setTimeout(async () => {
        await logout();
        navigate('/auth');
      }, 3000);
    } catch (error: any) {
      setErrorMessage(error.message || 'Không thể đổi mật khẩu');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Đổi mật khẩu</h2>
        <p className="text-sm text-gray-600">Cập nhật mật khẩu để bảo mật tài khoản</p>
      </div>

      {/* Security Info */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start">
        <Shield className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">Lưu ý bảo mật:</p>
          <ul className="list-disc list-inside space-y-1 text-blue-700">
            <li>Mật khẩu phải có ít nhất 6 ký tự</li>
            <li>Nên bao gồm chữ hoa, chữ thường và số</li>
            <li>Không sử dụng mật khẩu quá đơn giản</li>
            <li>Sau khi đổi mật khẩu, bạn sẽ được đăng xuất</li>
          </ul>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-slide-down">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Current Password */}
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-700 mb-2">
            Mật khẩu hiện tại <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="currentPassword"
              type={showCurrentPassword ? 'text' : 'password'}
              {...register('currentPassword', {
                required: 'Vui lòng nhập mật khẩu hiện tại',
                minLength: {
                  value: 6,
                  message: 'Mật khẩu phải có ít nhất 6 ký tự',
                },
              })}
              className="input-field !pl-12 !pr-12"
              placeholder="Nhập mật khẩu hiện tại"
              disabled={isSubmitting}
            />
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showCurrentPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
            Mật khẩu mới <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              {...register('newPassword', {
                required: 'Vui lòng nhập mật khẩu mới',
                minLength: {
                  value: 6,
                  message: 'Mật khẩu phải có ít nhất 6 ký tự',
                },
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
                  message: 'Mật khẩu phải có ít nhất 1 chữ cái và 1 số',
                },
                validate: (value) =>
                  value !== watch('currentPassword') ||
                  'Mật khẩu mới phải khác mật khẩu hiện tại',
              })}
              className="input-field !pl-12 !pr-12"
              placeholder="Nhập mật khẩu mới"
              disabled={isSubmitting}
            />
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showNewPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
          )}

          {/* Password Strength Indicator */}
          {newPassword && !errors.newPassword && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-600">Độ mạnh mật khẩu:</p>
                <span
                  className={`text-xs font-bold ${
                    passwordStrength === 1
                      ? 'text-red-600'
                      : passwordStrength === 2
                      ? 'text-orange-600'
                      : 'text-success-600'
                  }`}
                >
                  {strengthLabels[passwordStrength]}
                </span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      level <= passwordStrength ? strengthColors[passwordStrength] : 'bg-gray-200'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
            Xác nhận mật khẩu mới <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword', {
                required: 'Vui lòng xác nhận mật khẩu mới',
                validate: (value) => value === newPassword || 'Mật khẩu xác nhận không khớp',
              })}
              className="input-field !pl-12 !pr-12"
              placeholder="Nhập lại mật khẩu mới"
              disabled={isSubmitting}
            />
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
          {!errors.confirmPassword &&
            watch('confirmPassword') &&
            watch('confirmPassword') === newPassword && (
              <p className="mt-1 text-xs text-success-600 flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Mật khẩu khớp
              </p>
            )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary flex-1 sm:flex-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5 mr-2" />
                Đổi mật khẩu
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => reset()}
            disabled={isSubmitting}
            className="btn btn-ghost flex-1 sm:flex-none"
          >
            Đặt lại
          </button>
        </div>
      </form>
    </div>
  );
};


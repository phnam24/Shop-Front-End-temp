import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, UserPlus, Loader2, CheckCircle2, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import type { RegisterFormData } from '../types';

export const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredUsername, setRegisteredUsername] = useState('');
  
  const navigate = useNavigate();
  const { register: registerUser, login } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setErrorMessage('');
      setIsRegistering(true);

      // Chuẩn bị data theo đúng format BE
      const registerData = {
        username: data.username,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        dob: data.dob || undefined,
      };

      // Step 1: Đăng ký user
      const result = await registerUser(registerData);
      
      if (result.success) {
        setRegisteredUsername(result.username);
        setShowSuccessModal(true);
        
        // Step 2: Tự động login sau 1.5 giây
        setTimeout(async () => {
          try {
            await login(data.username, data.password);
            navigate('/');
          } catch (loginError) {
            // Nếu auto login fail, redirect về login page
            navigate('/auth?mode=login');
          }
        }, 1500);
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Đăng ký thất bại');
      setIsRegistering(false);
    }
  };

  return (
    <>
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 animate-scale-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-success-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Đăng ký thành công! 🎉
              </h3>
              <p className="text-gray-600 mb-4">
                Chào mừng <span className="font-semibold text-primary-700">@{registeredUsername}</span> đến với TechStore!
              </p>
              <p className="text-sm text-gray-500">
                Đang tự động đăng nhập...
              </p>
              <div className="mt-4">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-slide-down">
          <p className="font-medium">❌ {errorMessage}</p>
        </div>
      )}

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
            Họ <span className="text-red-500">*</span>
          </label>
          <input
            id="firstName"
            type="text"
            {...register('firstName', {
              required: 'Vui lòng nhập họ',
              minLength: {
                value: 2,
                message: 'Họ phải có ít nhất 2 ký tự',
              },
            })}
            className="input-field"
            placeholder="Nguyễn"
          />
          {errors.firstName && (
            <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
            Tên <span className="text-red-500">*</span>
          </label>
          <input
            id="lastName"
            type="text"
            {...register('lastName', {
              required: 'Vui lòng nhập tên',
              minLength: {
                value: 2,
                message: 'Tên phải có ít nhất 2 ký tự',
              },
            })}
            className="input-field"
            placeholder="Văn A"
          />
          {errors.lastName && (
            <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Date of Birth */}
      <div>
        <label htmlFor="dob" className="block text-sm font-semibold text-gray-700 mb-2">
          Ngày sinh
        </label>
        <input
          id="dob"
          type="date"
          {...register('dob', {
            validate: (value) => {
              if (!value) return true; // Optional field
              
              const selectedDate = new Date(value);
              const today = new Date();
              const age = today.getFullYear() - selectedDate.getFullYear();
              
              if (age < 10) {
                return 'Bạn phải từ 10 tuổi trở lên';
              }
              
              return true;
            },
          })}
          className="input-field"
          max={new Date().toISOString().split('T')[0]}
        />
        {errors.dob && (
          <p className="mt-1 text-xs text-red-600">{errors.dob.message}</p>
        )}
        {!errors.dob && (
          <p className="mt-1 text-xs text-gray-500">Tùy chọn - để nhận ưu đãi sinh nhật</p>
        )}
      </div>

      {/* Username */}
      <div>
        <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
          Tên đăng nhập <span className="text-red-500">*</span>
        </label>
        <input
          id="username"
          type="text"
          {...register('username', {
            required: 'Vui lòng nhập tên đăng nhập',
            minLength: {
              value: 4,
              message: 'Tên đăng nhập phải có ít nhất 4 ký tự',
            },
            maxLength: {
              value: 20,
              message: 'Tên đăng nhập không quá 20 ký tự',
            },
            pattern: {
              value: /^[a-zA-Z0-9_]+$/,
              message: 'Tên đăng nhập chỉ chứa chữ, số và dấu gạch dưới',
            },
          })}
          className="input-field"
          placeholder="username123"
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
        )}
        {!errors.username && watch('username')?.length >= 4 && (
          <p className="mt-1 text-xs text-success-600 flex items-center">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Tên đăng nhập hợp lệ
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
          Mật khẩu <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            {...register('password', {
              required: 'Vui lòng nhập mật khẩu',
              minLength: {
                value: 6,
                message: 'Mật khẩu phải có ít nhất 6 ký tự',
              },
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
                message: 'Mật khẩu phải có ít nhất 1 chữ cái và 1 số',
              },
            })}
            className="input-field pr-12"
            placeholder="Nhập mật khẩu"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
        {!errors.password && password && (
          <div className="mt-2 space-y-1">
            <p className="text-xs font-medium text-gray-600">Độ mạnh mật khẩu:</p>
            <div className="flex gap-1">
              <div className={`h-1 flex-1 rounded ${password.length >= 6 ? 'bg-success-500' : 'bg-gray-300'}`}></div>
              <div className={`h-1 flex-1 rounded ${password.length >= 8 ? 'bg-success-500' : 'bg-gray-300'}`}></div>
              <div className={`h-1 flex-1 rounded ${/[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) ? 'bg-success-500' : 'bg-gray-300'}`}></div>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
          Xác nhận mật khẩu <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('confirmPassword', {
              required: 'Vui lòng xác nhận mật khẩu',
              validate: (value) =>
                value === password || 'Mật khẩu xác nhận không khớp',
            })}
            className="input-field pr-12"
            placeholder="Nhập lại mật khẩu"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
        {!errors.confirmPassword && watch('confirmPassword') && watch('confirmPassword') === password && (
          <p className="mt-1 text-xs text-success-600 flex items-center">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Mật khẩu khớp
          </p>
        )}
      </div>

      {/* Terms */}
      <div className="pt-2">
        <label className="flex items-start cursor-pointer group">
          <input
            type="checkbox"
            {...register('terms', {
              required: 'Bạn phải đồng ý với điều khoản để tiếp tục',
            })}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-1 cursor-pointer"
          />
          <span className="ml-3 text-sm text-gray-600">
            Tôi đồng ý với{' '}
            <Link to="/terms" className="text-primary-700 hover:text-primary-800 font-semibold underline" target="_blank">
              Điều khoản sử dụng
            </Link>{' '}
            và{' '}
            <Link to="/privacy" className="text-primary-700 hover:text-primary-800 font-semibold underline" target="_blank">
              Chính sách bảo mật
            </Link>
            {' '}của TechStore
          </span>
        </label>
        {errors.terms && (
          <p className="mt-2 text-sm text-red-600 ml-7">{errors.terms.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isRegistering}
        className="btn btn-primary w-full py-3 text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isRegistering ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Đang tạo tài khoản...
          </>
        ) : (
          <>
            <UserPlus className="w-5 h-5 mr-2" />
            Đăng ký tài khoản
          </>
        )}
      </button>

      {/* Info Note */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
        <p className="text-xs text-primary-800">
          <span className="font-semibold">💡 Lưu ý:</span> Sau khi đăng ký thành công, bạn sẽ nhận được email xác nhận và có thể bắt đầu mua sắm ngay lập tức.
        </p>
      </div>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500 font-medium">Hoặc</span>
        </div>
      </div>

      {/* Login Link */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Đã có tài khoản?{' '}
          <button
            type="button"
            onClick={() => window.location.href = '/auth?mode=login'}
            className="font-semibold text-primary-700 hover:text-primary-800 transition-colors cursor-pointer"
          >
            Đăng nhập ngay
          </button>
        </p>
      </div>
    </form>
    </>
  );
};
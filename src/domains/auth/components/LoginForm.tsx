import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import type { LoginFormData } from '../types';

export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setErrorMessage('');
      await login(data.username, data.password);
      // Login thành công, redirect
      navigate('/');
    } catch (error: any) {
      setErrorMessage(error.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {errorMessage}
        </div>
      )}

      {/* Username */}
      <div>
        <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
          Tên đăng nhập
        </label>
        <input
          id="username"
          type="text"
          {...register('username', {
            required: 'Vui lòng nhập tên đăng nhập',
            minLength: {
              value: 3,
              message: 'Tên đăng nhập phải có ít nhất 3 ký tự',
            },
          })}
          className="input-field"
          placeholder="Nhập tên đăng nhập"
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
          Mật khẩu
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
      </div>

      {/* Remember & Forgot */}
      <div className="flex items-center justify-between">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-600">Ghi nhớ đăng nhập</span>
        </label>
        <Link
          to="/forgot-password"
          className="text-sm font-medium text-primary-700 hover:text-primary-800 transition-colors"
        >
          Quên mật khẩu?
        </Link>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary w-full py-3 text-base shadow-lg hover:shadow-xl transition-all"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Đang xử lý...
          </>
        ) : (
          <>
            <LogIn className="w-5 h-5 mr-2" />
            Đăng nhập
          </>
        )}
      </button>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500 font-medium">Hoặc</span>
        </div>
      </div>

      {/* Register Link - Remove default link behavior */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Chưa có tài khoản?{' '}
          <button
            type="button"
            onClick={() => window.location.href = '/auth?mode=register'}
            className="font-semibold text-primary-700 hover:text-primary-800 transition-colors cursor-pointer"
          >
            Đăng ký ngay
          </button>
        </p>
      </div>
    </form>
  );
};
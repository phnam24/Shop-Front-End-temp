import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Mail, Loader2, CheckCircle } from 'lucide-react';
import { Zap } from 'lucide-react';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPasswordPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordFormData>();

  const email = watch('email');

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setErrorMessage('');
      setIsSubmitting(true);

      // TODO: Integrate with API endpoint POST /auth/forgot-password
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsSuccess(true);
    } catch (error: any) {
      setErrorMessage(error.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 mb-8 group w-fit">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-900 to-primary-700 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">TechStore</h1>
              <p className="text-xs text-primary-700">Công nghệ tin cậy</p>
            </div>
          </Link>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            {/* Back Button */}
            <Link
              to="/auth"
              className="inline-flex items-center text-sm text-gray-600 hover:text-primary-700 mb-6 group transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Quay lại đăng nhập
            </Link>

            {!isSuccess ? (
              <>
                {/* Title */}
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Quên mật khẩu?
                  </h2>
                  <p className="text-gray-600">
                    Nhập email đăng ký của bạn, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                  {/* Error Message */}
                  {errorMessage && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-slide-down">
                      {errorMessage}
                    </div>
                  )}

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email đăng ký
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        {...register('email', {
                          required: 'Vui lòng nhập email',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Email không hợp lệ',
                          },
                        })}
                        className="input-field pl-12"
                        placeholder="your.email@example.com"
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary w-full py-3 text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <Mail className="w-5 h-5 mr-2" />
                        Gửi link đặt lại mật khẩu
                      </>
                    )}
                  </button>
                </form>

                {/* Info */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">💡 Lưu ý:</span> Link đặt lại mật khẩu sẽ có hiệu lực trong 15 phút. Vui lòng kiểm tra cả thư mục Spam.
                  </p>
                </div>
              </>
            ) : (
              /* Success State */
              <div className="text-center py-8 animate-scale-in">
                <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-success-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Email đã được gửi! 📧
                </h3>
                <p className="text-gray-600 mb-2">
                  Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến:
                </p>
                <p className="text-primary-700 font-semibold mb-6">{email}</p>
                <p className="text-sm text-gray-500 mb-8">
                  Vui lòng kiểm tra email và làm theo hướng dẫn để đặt lại mật khẩu.
                </p>

                {/* Actions */}
                <div className="space-y-3">
                  <Link to="/auth" className="btn btn-primary w-full">
                    Quay lại đăng nhập
                  </Link>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="btn btn-ghost w-full text-sm"
                  >
                    Gửi lại email
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Decorative (Hidden on mobile) */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDEzNGgxMnYxMkgzNnptMjQgMGgxMnYxMkg2MHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="max-w-lg">
            <h3 className="text-5xl font-bold mb-6 leading-tight">
              Đừng lo lắng!
              <br />
              <span className="text-accent-300">Chúng tôi ở đây</span>
            </h3>

            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Quên mật khẩu là chuyện bình thường. Chúng tôi sẽ giúp bạn lấy lại quyền truy cập trong vài phút.
            </p>

            <div className="space-y-4 text-blue-100">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="font-bold">1</span>
                </div>
                <div>
                  <p className="font-semibold mb-1">Nhập email của bạn</p>
                  <p className="text-sm text-blue-200">Email bạn đã dùng để đăng ký tài khoản</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="font-bold">2</span>
                </div>
                <div>
                  <p className="font-semibold mb-1">Kiểm tra email</p>
                  <p className="text-sm text-blue-200">Nhấn vào link trong email chúng tôi gửi</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="font-bold">3</span>
                </div>
                <div>
                  <p className="font-semibold mb-1">Đặt mật khẩu mới</p>
                  <p className="text-sm text-blue-200">Tạo mật khẩu mới và đăng nhập lại</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-accent-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-secondary-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;


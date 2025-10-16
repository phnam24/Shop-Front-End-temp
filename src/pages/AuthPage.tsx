import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Zap, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { LoginForm } from '../domains/auth/components/LoginForm';
import { RegisterForm } from '../domains/auth/components/RegisterForm';
import { useRedirectIfAuthenticated } from '../domains/auth/hooks/useAuth';

type AuthMode = 'login' | 'register';

const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const modeParam = searchParams.get('mode') as AuthMode;
  const [mode, setMode] = useState<AuthMode>(modeParam || 'login');
  
  // Redirect nếu đã đăng nhập
  useRedirectIfAuthenticated();

  // Update mode khi query param thay đổi
  useEffect(() => {
    if (modeParam && (modeParam === 'login' || modeParam === 'register')) {
      setMode(modeParam);
    }
  }, [modeParam]);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side - Form */}
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
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Tab Switcher */}
            <div className="relative bg-gray-100 p-1 m-4 rounded-xl">
              {/* Sliding Background */}
              <div
                className="absolute top-1 bottom-1 w-[calc(50%-0.25rem)] bg-white rounded-lg shadow-md transition-all duration-300 ease-out"
                style={{
                  left: mode === 'login' ? '0.25rem' : 'calc(50% + 0.25rem)',
                }}
              />
              
              {/* Tabs */}
              <div className="relative grid grid-cols-2 gap-1">
                <button
                  onClick={() => setMode('login')}
                  className={`relative py-3 px-4 rounded-lg font-semibold transition-colors duration-300 ${
                    mode === 'login'
                      ? 'text-primary-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => setMode('register')}
                  className={`relative py-3 px-4 rounded-lg font-semibold transition-colors duration-300 ${
                    mode === 'register'
                      ? 'text-primary-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Đăng ký
                </button>
              </div>
            </div>

            {/* Content Area with Animation */}
            <div className="p-6 pt-4">
              {/* Title */}
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {mode === 'login' ? 'Chào mừng trở lại!' : 'Tạo tài khoản mới'}
                </h2>
                <p className="text-gray-600 text-sm">
                  {mode === 'login'
                    ? 'Đăng nhập để tiếp tục mua sắm'
                    : 'Đăng ký để trải nghiệm mua sắm tuyệt vời'}
                </p>
              </div>

              {/* Form with Slide Animation */}
              <div className="relative overflow-hidden">
                <div
                  className="transition-all duration-500 ease-out"
                  style={{
                    transform: mode === 'login' ? 'translateX(0)' : 'translateX(-100%)',
                    opacity: mode === 'login' ? 1 : 0,
                    display: mode === 'login' ? 'block' : 'none',
                  }}
                >
                  <LoginForm />
                </div>

                <div
                  className="transition-all duration-500 ease-out"
                  style={{
                    transform: mode === 'register' ? 'translateX(0)' : 'translateX(100%)',
                    opacity: mode === 'register' ? 1 : 0,
                    display: mode === 'register' ? 'block' : 'none',
                  }}
                >
                  <RegisterForm />
                </div>
              </div>
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-center text-sm text-gray-600">
            <ShieldCheck className="w-4 h-4 mr-2 text-success-600" />
            <span>Thông tin được bảo mật và mã hóa</span>
          </div>
        </div>
      </div>

      {/* Right Side - Hero */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDEzNGgxMnYxMkgzNnptMjQgMGgxMnYxMkg2MHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-accent-400 border border-accent-300 mb-8 w-fit animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-bold">Ưu đãi đặc biệt - Giảm 10%</span>
          </div>
          
          {/* Title */}
          <h3 className="text-5xl font-bold mb-6 leading-tight animate-slide-up">
            Trải nghiệm mua sắm
            <br />
            <span className="text-accent-300">Công nghệ hiện đại</span>
          </h3>
          
          <p className="text-xl text-blue-100 mb-12 leading-relaxed max-w-lg animate-fade-in">
            {mode === 'login'
              ? 'Đăng nhập để tiếp tục mua sắm và truy cập đơn hàng của bạn'
              : 'Đăng ký ngay để nhận ưu đãi 10% cho đơn hàng đầu tiên'}
          </p>

          {/* Features */}
          <div className="space-y-6">
            {[
              {
                icon: ShieldCheck,
                title: 'Bảo mật tuyệt đối',
                desc: 'Thông tin được mã hóa SSL 256-bit',
              },
              {
                icon: Zap,
                title: 'Thanh toán nhanh chóng',
                desc: 'Checkout trong 1 phút với thông tin đã lưu',
              },
              {
                icon: TrendingUp,
                title: 'Ưu đãi độc quyền',
                desc: 'Nhận ngay voucher và điểm thưởng',
              },
            ].map((feature, idx) => (
              <div 
                key={idx} 
                className="flex items-start space-x-4 animate-slide-up"
                style={{animationDelay: `${idx * 0.1}s`}}
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-white/20">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">{feature.title}</h4>
                  <p className="text-blue-100 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-8">
            {[
              { value: '50K+', label: 'Khách hàng' },
              { value: '99%', label: 'Hài lòng' },
              { value: '24/7', label: 'Hỗ trợ' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl font-bold text-accent-300 mb-1">{stat.value}</div>
                <div className="text-sm text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-accent-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-secondary-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
      </div>
    </div>
  );
};

export default AuthPage;
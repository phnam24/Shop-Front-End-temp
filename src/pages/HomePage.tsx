import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Laptop, 
  Smartphone, 
  Zap, 
  ShoppingCart, 
  Sparkles, 
  Shield, 
  Truck, 
  TrendingUp,
  Star,
  Heart,
  Award,
  HeadphonesIcon
} from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDEzNGgxMnYxMkgzNnptMjQgMGgxMnYxMkg2MHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="container-custom relative py-20 lg:py-28">
          <div className="max-w-4xl mx-auto text-center">
            {/* Floating badge */}
            <div className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-accent-400 text-white mb-8 animate-slide-down shadow-lg">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-bold">Khuyến mãi đặc biệt - Giảm đến 50%</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-slide-up leading-tight">
              Công nghệ hàng đầu
              <br />
              <span className="text-accent-300">
                Giá tốt nhất thị trường
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto animate-fade-in leading-relaxed">
              Laptop và điện thoại chính hãng với chính sách bảo hành tốt nhất. 
              Giao hàng nhanh chóng, hỗ trợ trả góp 0%.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
              <Link to="/products" className="btn btn-accent px-8 py-4 text-base shadow-xl">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Mua ngay
              </Link>
              <Link to="/products" className="btn px-8 py-4 text-base bg-white text-primary-900 hover:bg-gray-100">
                Xem sản phẩm
              </Link>
            </div>
          </div>
        </div>
        
        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 -mt-1">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: Award, label: 'Khách hàng', value: '50K+', color: 'from-primary-600 to-primary-700' },
              { icon: Shield, label: 'Bảo hành', value: '24 tháng', color: 'from-secondary-600 to-secondary-700' },
              { icon: Truck, label: 'Miễn phí ship', value: 'Toàn quốc', color: 'from-success-500 to-success-600' },
              { icon: TrendingUp, label: 'Ưu đãi', value: 'Đến 50%', color: 'from-accent-500 to-accent-600' },
            ].map((stat, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-xl p-6 text-center animate-slide-up hover-lift shadow-lg border border-gray-200"
                style={{animationDelay: `${idx * 0.1}s`}}
              >
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-xs md:text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Danh mục sản phẩm
            </h2>
            <p className="text-gray-600 text-base md:text-lg">
              Tìm kiếm sản phẩm phù hợp với nhu cầu của bạn
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Laptop Card */}
            <Link to="/laptops" className="group relative overflow-hidden rounded-2xl animate-slide-up block shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-primary-400">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800"></div>
              <div className="relative p-6 md:p-8 h-full flex flex-col">
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xl border border-white/30">
                    <Laptop className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Laptop</h3>
                  <p className="text-blue-100 text-sm mb-4 font-medium">
                    Hiệu năng mạnh mẽ cho công việc và giải trí
                  </p>
                  <div className="inline-flex items-center px-3 py-1.5 bg-white/25 backdrop-blur-sm rounded-full border border-white/30">
                    <span className="text-white text-sm font-bold">500+ sản phẩm</span>
                  </div>
                </div>
                <button className="btn bg-white text-primary-900 hover:bg-gray-50 mt-auto w-full font-bold shadow-xl">
                  Khám phá ngay →
                </button>
              </div>
            </Link>

            {/* Smartphone Card */}
            <Link to="/smartphones" className="group relative overflow-hidden rounded-2xl animate-slide-up block shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-secondary-400" style={{animationDelay: '0.1s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-secondary-500 to-secondary-700"></div>
              <div className="relative p-6 md:p-8 h-full flex flex-col">
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xl border border-white/30">
                    <Smartphone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Điện thoại</h3>
                  <p className="text-blue-100 text-sm mb-4 font-medium">
                    Camera đỉnh cao, pin trâu, màn hình sắc nét
                  </p>
                  <div className="inline-flex items-center px-3 py-1.5 bg-white/25 backdrop-blur-sm rounded-full border border-white/30">
                    <span className="text-white text-sm font-bold">300+ sản phẩm</span>
                  </div>
                </div>
                <button className="btn bg-white text-secondary-900 hover:bg-gray-50 mt-auto w-full font-bold shadow-xl">
                  Khám phá ngay →
                </button>
              </div>
            </Link>

            {/* Hot Deals Card */}
            <Link to="/deals" className="group relative overflow-hidden rounded-2xl animate-slide-up md:col-span-2 lg:col-span-1 block shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-accent-400" style={{animationDelay: '0.2s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-accent-400 to-accent-600"></div>
              <div className="relative p-6 md:p-8 h-full flex flex-col">
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xl border border-white/30 animate-pulse">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Khuyến mãi HOT</h3>
                  <p className="text-orange-50 text-sm mb-4 font-medium">
                    Deal sốc mỗi ngày, giảm giá cực mạnh
                  </p>
                  <div className="inline-flex items-center px-3 py-1.5 bg-white/25 backdrop-blur-sm rounded-full border border-white/30">
                    <span className="text-white text-sm font-bold">Giảm đến 50%</span>
                  </div>
                </div>
                <button className="btn bg-white text-accent-700 hover:bg-gray-50 mt-auto w-full font-bold shadow-xl">
                  Xem ngay →
                </button>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Sản phẩm nổi bật
              </h2>
              <p className="text-gray-600">
                Các sản phẩm được yêu thích nhất
              </p>
            </div>
            <Link to="/products" className="hidden md:block btn btn-outline hover:bg-primary-50">
              Xem tất cả
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item, idx) => (
              <div key={item} className="group animate-slide-up" style={{animationDelay: `${idx * 0.1}s`}}>
                <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border-2 border-gray-100 hover:border-primary-300 transform hover:-translate-y-2">
                  {/* Image */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-5xl md:text-6xl">
                      {item % 2 === 0 ? '💻' : '📱'}
                    </div>
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="badge bg-red-500 text-white text-xs shadow-lg font-bold">-20%</span>
                      <span className="badge bg-success-500 text-white text-xs shadow-lg font-bold">Freeship</span>
                    </div>
                    <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-red-50">
                      <Heart className="w-4 h-4 text-gray-700 hover:text-red-500" />
                    </button>
                  </div>
                  
                  {/* Info */}
                  <div className="p-4 space-y-2 bg-white">
                    <span className="text-xs text-primary-700 font-bold uppercase tracking-wide">
                      {item % 2 === 0 ? 'Dell' : 'Samsung'}
                    </span>
                    <h3 className="font-bold text-gray-900 line-clamp-2 text-sm md:text-base group-hover:text-primary-700 transition-colors min-h-[3rem]">
                      {item % 2 === 0 
                        ? 'Dell XPS 13 Plus - Intel Core i7' 
                        : 'Samsung Galaxy S24 Ultra 5G'}
                    </h3>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex text-accent-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 font-semibold">(124)</span>
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-xl md:text-2xl font-bold text-primary-900">
                        {item % 2 === 0 ? '32.990.000₫' : '28.990.000₫'}
                      </span>
                      <span className="text-xs text-gray-400 line-through font-medium">
                        {item % 2 === 0 ? '41.990.000₫' : '35.990.000₫'}
                      </span>
                    </div>
                    
                    {/* Action */}
                    <button className="btn btn-accent w-full mt-4 text-sm shadow-lg hover:shadow-xl">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8 md:hidden">
            <Link to="/products" className="btn btn-outline w-full sm:w-auto">
              Xem tất cả sản phẩm
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn TechStore?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất cho khách hàng
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                icon: Shield,
                title: 'Bảo hành chính hãng',
                desc: 'Bảo hành 24 tháng, đổi trả trong 15 ngày',
                color: 'from-primary-600 to-primary-700',
              },
              {
                icon: Truck,
                title: 'Giao hàng nhanh chóng',
                desc: 'Miễn phí vận chuyển đơn hàng trên 5 triệu',
                color: 'from-success-500 to-success-600',
              },
              {
                icon: Sparkles,
                title: 'Sản phẩm chính hãng',
                desc: '100% hàng chính hãng, tem đầy đủ',
                color: 'from-secondary-600 to-secondary-700',
              },
              {
                icon: HeadphonesIcon,
                title: 'Hỗ trợ 24/7',
                desc: 'Tư vấn nhiệt tình, chuyên nghiệp',
                color: 'from-accent-500 to-accent-600',
              },
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="card text-center animate-scale-in hover-lift group"
                style={{animationDelay: `${idx * 0.1}s`}}
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm md:text-base">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="relative overflow-hidden rounded-3xl animate-scale-in shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-700 via-primary-800 to-primary-900"></div>
            <div className="relative p-8 md:p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                Đăng ký nhận tin khuyến mãi
              </h2>
              <p className="text-blue-100 text-sm md:text-base mb-8 max-w-2xl mx-auto">
                Nhận ngay mã giảm giá <span className="font-bold text-accent-300">10%</span> cho đơn hàng đầu tiên và cập nhật về các chương trình ưu đãi mới nhất
              </p>
              <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Nhập email của bạn..."
                  className="flex-1 px-4 md:px-6 py-3 md:py-4 rounded-xl border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:bg-white/20 focus:border-white/50 transition-all text-sm md:text-base"
                />
                <button className="btn bg-accent-400 hover:bg-accent-500 text-white px-6 md:px-8 py-3 md:py-4 whitespace-nowrap font-bold text-sm md:text-base shadow-xl">
                  Đăng ký ngay
                </button>
              </div>
              <p className="text-blue-200 text-xs mt-4">
                * Chúng tôi cam kết bảo mật thông tin của bạn
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
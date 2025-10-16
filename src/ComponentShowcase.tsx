import { Heart, ShoppingCart, Star, TrendingUp, Zap } from 'lucide-react';

function ComponentShowcase() {
  return (
    <div className="min-h-screen py-20">
      <div className="container-custom max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4 gradient-text">
            UI Components Showcase
          </h1>
          <p className="text-white/70 text-lg">
            Tất cả các component với gam màu lạnh hiện đại
          </p>
        </div>

        <div className="space-y-16">
          {/* Buttons Section */}
          <section className="card-glass p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Buttons</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-white/80 text-sm font-medium mb-3">Primary Buttons</h3>
                <div className="space-y-3">
                  <button className="btn btn-primary w-full">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Primary Button
                  </button>
                  <button className="btn btn-secondary w-full">
                    <Star className="w-4 h-4 mr-2" />
                    Secondary Button
                  </button>
                  <button className="btn btn-accent w-full">
                    <Zap className="w-4 h-4 mr-2" />
                    Accent Button
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-white/80 text-sm font-medium mb-3">Other Variants</h3>
                <div className="space-y-3">
                  <button className="btn btn-outline w-full">
                    Outline Button
                  </button>
                  <button className="btn btn-ghost w-full">
                    Ghost Button
                  </button>
                  <button className="btn btn-primary w-full" disabled>
                    Disabled Button
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Input Fields Section */}
          <section className="card-glass p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Input Fields</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="input-field"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Tìm kiếm
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tìm kiếm sản phẩm..."
                      className="input-field pl-10"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400">
                      🔍
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Textarea
                  </label>
                  <textarea
                    placeholder="Nhập nội dung..."
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Cards Section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Regular Card */}
              <div className="card hover-lift">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-dark-900 mb-2">
                  Regular Card
                </h3>
                <p className="text-dark-600 text-sm">
                  Card với background trắng và shadow mềm mại
                </p>
              </div>

              {/* Glass Card */}
              <div className="card-glass hover-lift">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Glass Card
                </h3>
                <p className="text-white/70 text-sm">
                  Card với hiệu ứng glassmorphism
                </p>
              </div>

              {/* Gradient Card */}
              <div className="relative overflow-hidden rounded-xl hover-lift group">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-500 to-accent-700"></div>
                <div className="relative p-6">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Gradient Card
                  </h3>
                  <p className="text-white/80 text-sm">
                    Card với background gradient đầy màu sắc
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Badges Section */}
          <section className="card-glass p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Badges</h2>
            <div className="flex flex-wrap gap-3">
              <span className="badge badge-primary">Primary Badge</span>
              <span className="badge badge-accent">Accent Badge</span>
              <span className="badge badge-success">Success Badge</span>
              <span className="badge bg-red-100 text-red-700">Danger Badge</span>
              <span className="badge bg-yellow-100 text-yellow-700">Warning Badge</span>
              <span className="badge bg-white/20 text-white">Glass Badge</span>
            </div>
          </section>

          {/* Product Card Example */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Product Card Example</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="group">
                  <div className="card hover-lift overflow-hidden">
                    {/* Image */}
                    <div className="relative aspect-square bg-gradient-to-br from-dark-100 to-dark-200 rounded-lg mb-4 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center text-6xl">
                        💻
                      </div>
                      {/* Badges */}
                      <div className="absolute top-3 left-3">
                        <span className="badge bg-red-500 text-white">-20%</span>
                      </div>
                      <button className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                        <Heart className="w-5 h-5 text-dark-600" />
                      </button>
                    </div>
                    
                    {/* Info */}
                    <div className="space-y-2">
                      <span className="text-xs text-dark-500 font-medium">Dell</span>
                      <h3 className="font-bold text-dark-900 line-clamp-2">
                        Dell XPS 13 Plus - Intel Core i7-1360P
                      </h3>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <span className="text-xs text-dark-500">(124 đánh giá)</span>
                      </div>
                      
                      {/* Price */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-primary-600">
                          32.990.000₫
                        </span>
                        <span className="text-sm text-dark-400 line-through">
                          41.990.000₫
                        </span>
                      </div>
                      
                      {/* Action */}
                      <button className="btn btn-primary w-full mt-4">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Thêm vào giỏ
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Animations Demo */}
          <section className="card-glass p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Animations</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 p-6 rounded-xl text-center animate-fade-in">
                <p className="text-white text-sm">Fade In</p>
              </div>
              <div className="bg-white/10 p-6 rounded-xl text-center animate-slide-up">
                <p className="text-white text-sm">Slide Up</p>
              </div>
              <div className="bg-white/10 p-6 rounded-xl text-center animate-scale-in">
                <p className="text-white text-sm">Scale In</p>
              </div>
              <div className="bg-white/10 p-6 rounded-xl text-center animate-float">
                <p className="text-white text-sm">Float</p>
              </div>
            </div>
          </section>

          {/* Gradient Text */}
          <section className="card-glass p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Gradient Text</h2>
            <div className="space-y-4">
              <h1 className="text-6xl font-bold gradient-text">
                Gradient Text Effect
              </h1>
              <p className="text-2xl gradient-text">
                Hiệu ứng chữ gradient đẹp mắt và hiện đại
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ComponentShowcase;

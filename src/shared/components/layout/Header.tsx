import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, Zap, LogOut } from 'lucide-react';
import { useAuthStore } from '../../../domains/auth/store/authStore';
import { useCartStore } from '../../../domains/cart/store/cartStore';
import { MegaMenu } from './MegaMenu';
import { ProductSearch } from '../../../domains/products/components/ProductSearch';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const logout = useAuthStore((state) => state.logout);
  const { getItemCount, fetchCart } = useCartStore();
  const cartItemCount = getItemCount();

  // Fetch cart when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);
  
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'laptop' | 'smartphone' | null>(null);

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const handleCategoryHover = (category: 'laptop' | 'smartphone') => {
    setActiveCategory(category);
    setMegaMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMegaMenuOpen(false);
    setActiveCategory(null);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container-custom">
        {/* Main Header */}
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group animate-slide-down">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-900 to-primary-700 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-400 rounded-full animate-pulse-glow"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">TechStore</h1>
              <p className="text-xs text-primary-700">Công nghệ tin cậy</p>
            </div>
          </Link>
          
          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8 animate-fade-in">
            <ProductSearch 
              onSearch={(query) => navigate(`/products?search=${query}`)}
            />
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-2 md:space-x-4 animate-slide-down">
            {isAuthenticated && user ? (
              <>
                {/* User Dropdown - Desktop */}
                <div className="hidden md:block relative group">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-all"
                  >
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user.username}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white font-bold shadow-lg">
                      {user.firstName.charAt(0).toUpperCase()}
                    </div>
                  </Link>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                      >
                        <User className="w-4 h-4 mr-3" />
                        Tài khoản của tôi
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Mobile User Avatar */}
                <Link
                  to="/profile"
                  className="md:hidden w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white font-bold shadow-lg"
                >
                  {user.firstName.charAt(0).toUpperCase()}
                </Link>
              </>
            ) : (
              <Link
                to="/auth"
                className="hidden md:flex items-center space-x-2 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-all group"
              >
                <User className="w-5 h-5 group-hover:scale-110 transition-transform text-primary-700" />
                <span className="text-sm font-medium">Đăng nhập</span>
              </Link>
            )}
            
            <Link 
              to="/cart"
              className="relative p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all hover:scale-105"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-accent-400 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            <button className="md:hidden p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all">
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
        
        {/* Navigation - Desktop */}
        <nav 
          className="hidden md:flex items-center space-x-8 py-4 border-t border-gray-100"
          onMouseLeave={handleMenuClose}
        >
          <div
            onMouseEnter={() => handleCategoryHover('laptop')}
            className="relative group"
          >
            <Link 
              to="/laptops" 
              className="text-gray-700 hover:text-primary-900 font-medium transition-colors relative flex items-center"
            >
              <span>Laptop</span>
              <span className="absolute -bottom-4 left-0 w-0 h-1 bg-primary-900 transition-all group-hover:w-full rounded-full"></span>
            </Link>
          </div>
          
          <div
            onMouseEnter={() => handleCategoryHover('smartphone')}
            className="relative group"
          >
            <Link 
              to="/smartphones" 
              className="text-gray-700 hover:text-primary-900 font-medium transition-colors relative flex items-center"
            >
              <span>Điện thoại</span>
              <span className="absolute -bottom-4 left-0 w-0 h-1 bg-primary-900 transition-all group-hover:w-full rounded-full"></span>
            </Link>
          </div>
          
          <Link 
            to="/deals" 
            className="relative group"
            onMouseEnter={handleMenuClose}
          >
            <span className="text-accent-600 hover:text-accent-700 font-semibold flex items-center gap-2 transition-colors">
              <Zap className="w-4 h-4" />
              Khuyến mãi HOT
            </span>
            <span className="absolute -bottom-4 left-0 w-0 h-1 bg-accent-500 transition-all group-hover:w-full rounded-full"></span>
          </Link>
        </nav>
        
        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100 transition-all text-sm bg-gray-50 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Mega Menu */}
      <MegaMenu
        isOpen={megaMenuOpen}
        activeCategory={activeCategory}
        onClose={handleMenuClose}
      />
    </header>
  );
};
// src/shared/components/layout/Header.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, Zap, LogOut, Bell, ChevronDown, Laptop, Smartphone } from 'lucide-react';
import { useAuthStore } from '../../../domains/auth/store/authStore';
import { useCartStore } from '../../../domains/cart/store/cartStore';
import { useNotificationStore } from '../../../domains/notification/store/notificationStore';
import { MegaMenu } from './MegaMenu';
import { ProductSearch } from '../../../domains/products/components/ProductSearch';
import { NotificationCenter } from '../NotificationCenter';
import { NotificationPanel } from '../NotificationPanel';
import { clsx } from 'clsx';

export const Header: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuthStore();
    const logout = useAuthStore((state) => state.logout);
    const { getItemCount, fetchCart } = useCartStore();
    const { unreadCount, fetchNotifications } = useNotificationStore();
    const cartItemCount = getItemCount();

    // State quản lý việc hiển thị menu và category nào được kích hoạt từ header
    const [megaMenuTriggerKey, setMegaMenuTriggerKey] = useState<string | null>(null);
    const [isMegaMenuVisible, setIsMegaMenuVisible] = useState(false); // State riêng cho visibility

    const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
    const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

    const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (isAuthenticated) {
        fetchCart();
        fetchNotifications();
        }
    }, [isAuthenticated, fetchCart, fetchNotifications]);

    const handleLogout = async () => {
        await logout();
        navigate('/auth');
    };

    // Khi hover vào link trigger (Danh mục, Laptop...)
    const handleTriggerMouseEnter = (key: string | null) => {
        if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
        leaveTimeoutRef.current = null;
        }
        setMegaMenuTriggerKey(key);
        setIsMegaMenuVisible(true); // Luôn mở khi hover vào trigger
    };

    // Khi chuột rời khỏi khu vực header (bao gồm link trigger và menu)
    const handleHeaderMouseLeave = () => {
        leaveTimeoutRef.current = setTimeout(() => {
        setIsMegaMenuVisible(false);
        // Không cần reset trigger key ngay lập tức để hiệu ứng fade out đẹp hơn
        // setMegaMenuTriggerKey(null);
        }, 200); // Delay đóng
    };

    // Khi chuột vào lại khu vực header
    const handleHeaderMouseEnter = () => {
        if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
        leaveTimeoutRef.current = null;
        }
        // Không tự mở lại menu, chỉ ngăn việc đóng nếu đang chờ đóng
         if (megaMenuTriggerKey) { // Nếu có trigger key đang active thì giữ menu mở
            setIsMegaMenuVisible(true);
        }
    };


    const toggleNotificationCenter = () => {
        setNotificationCenterOpen(prev => !prev);
    }

    const openNotificationPanel = () => {
        setIsNotificationPanelOpen(true);
    }

  return (
    <>
      {/* Gắn sự kiện vào header */}
      <header
        className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm"
        onMouseLeave={handleHeaderMouseLeave}
        onMouseEnter={handleHeaderMouseEnter}
      >
        <div className="container-custom">
          {/* Main Header */}
          <div className="flex items-center justify-between h-20">
            {/* ... Logo, Search, Actions ... */}
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
                {/* Notification Button */}
                <div className="relative">
                <button
                    onClick={toggleNotificationCenter}
                    className="relative p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all hover:scale-105"
                >
                    <Bell className="w-6 h-6 text-gray-700" />
                    {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                    )}
                </button>
                {notificationCenterOpen && (
                    <NotificationCenter
                    onClose={() => setNotificationCenterOpen(false)}
                    onViewAllClick={openNotificationPanel}
                    />
                )}
                </div>

                {/* User Dropdown / Login */}
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

                {/* Cart */}
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

                {/* Mobile Menu Button */}
                <button className="md:hidden p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all">
                <Menu className="w-6 h-6 text-gray-700" />
                </button>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6 py-4 border-t border-gray-100"> {/* Giảm space */}
             {/* Nút Danh mục Sản phẩm */}
             <div
              onMouseEnter={() => handleTriggerMouseEnter('danhMuc')}
              className="relative group py-2" // Tăng vùng hover dọc
            >
              <button
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium",
                  megaMenuTriggerKey === 'danhMuc'
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Menu className="w-5 h-5" />
                <span>Danh mục Sản phẩm</span>
                <ChevronDown className={clsx("w-4 h-4 transition-transform", isMegaMenuVisible && megaMenuTriggerKey === 'danhMuc' && "rotate-180")} />
              </button>
            </div>

            {/* Nút Laptop */}
            <div
              onMouseEnter={() => handleTriggerMouseEnter('laptop')}
              className="relative group py-2"
            >
              <Link
                to="/laptops"
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium",
                  megaMenuTriggerKey === 'laptop'
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Laptop className="w-5 h-5"/>
                <span>Laptop</span>
                 <ChevronDown className={clsx("w-4 h-4 transition-transform", isMegaMenuVisible && megaMenuTriggerKey === 'laptop' && "rotate-180")} />
              </Link>
            </div>

             {/* Nút Điện thoại */}
            <div
              onMouseEnter={() => handleTriggerMouseEnter('dienThoai')}
              className="relative group py-2"
            >
              <Link
                to="/smartphones"
                 className={clsx(
                  "flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium",
                  megaMenuTriggerKey === 'dienThoai'
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                 <Smartphone className="w-5 h-5"/>
                <span>Điện thoại</span>
                 <ChevronDown className={clsx("w-4 h-4 transition-transform", isMegaMenuVisible && megaMenuTriggerKey === 'dienThoai' && "rotate-180")} />
              </Link>
            </div>


            {/* Link Khuyến mãi HOT */}
            <Link
              to="/deals"
              className="relative group py-2 px-4 text-sm font-medium" // Thêm padding
              onMouseEnter={() => handleTriggerMouseEnter(null)} // Close menu when hovering others
            >
              <span className="text-accent-600 hover:text-accent-700 font-semibold flex items-center gap-2 transition-colors">
                <Zap className="w-4 h-4" />
                Khuyến mãi HOT
              </span>
              {/* Optional underline */}
               {/* <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-500 transition-all group-hover:w-full rounded-full"></span> */}
            </Link>
          </nav>

          {/* Mobile Search */}
          {/* ... mobile search code ... */}
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

        {/* Mega Menu Component - Render conditionally based on visibility state */}
        <MegaMenu
          isOpen={isMegaMenuVisible}
          activeTriggerKey={megaMenuTriggerKey} // Truyền key trigger
          onClose={handleHeaderMouseLeave} // Vẫn dùng hàm leave của header
          setActiveTriggerKey={setMegaMenuTriggerKey} // Cho phép menu cập nhật lại trigger key nếu cần
        />
      </header>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={isNotificationPanelOpen}
        onClose={() => setIsNotificationPanelOpen(false)}
      />
    </>
  );
};
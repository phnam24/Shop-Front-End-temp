import React, { useState } from 'react';
import { User, MapPin, Package, Lock, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../domains/auth/store/authStore';
import { ProfileInfo } from '../domains/user/components/ProfileInfo';
import { AddressManager } from '../domains/user/components/AddressManager';
import { ChangePassword } from '../domains/user/components/ChangePassword';

type Tab = 'profile' | 'addresses' | 'orders' | 'password';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const { user } = useAuthStore();

  const tabs = [
    {
      id: 'profile' as Tab,
      label: 'Thông tin cá nhân',
      icon: User,
      description: 'Quản lý thông tin tài khoản',
    },
    {
      id: 'addresses' as Tab,
      label: 'Địa chỉ',
      icon: MapPin,
      description: 'Quản lý địa chỉ giao hàng',
    },
    {
      id: 'orders' as Tab,
      label: 'Đơn hàng',
      icon: Package,
      description: 'Theo dõi đơn hàng của bạn',
    },
    {
      id: 'password' as Tab,
      label: 'Đổi mật khẩu',
      icon: Lock,
      description: 'Cập nhật mật khẩu bảo mật',
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileInfo />;
      case 'addresses':
        return <AddressManager />;
      case 'orders':
        return (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Đơn hàng</h3>
            <p className="text-gray-600">
              Tính năng đang được phát triển...
            </p>
          </div>
        );
      case 'password':
        return <ChangePassword />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6 animate-slide-down">
          <a href="/" className="hover:text-primary-600">Trang chủ</a>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Tài khoản</span>
        </nav>

        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Tài khoản của tôi
          </h1>
          <p className="text-gray-600">
            Xin chào, <span className="font-semibold text-primary-700">{user?.firstName} {user?.lastName}</span>! 👋
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
              {/* User Info */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-primary-50 to-white">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    {user?.firstName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 truncate">
                      {user?.firstName} {user?.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">@{user?.username}</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all mb-1 ${
                        isActive
                          ? 'bg-primary-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-sm">{tab.label}</div>
                        {!isActive && (
                          <div className="text-xs text-gray-500">{tab.description}</div>
                        )}
                      </div>
                      <ChevronRight className={`w-5 h-5 flex-shrink-0 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Mobile Tab Selector */}
          <div className="lg:hidden">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-6">
              <div className="grid grid-cols-2 gap-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex flex-col items-center space-y-2 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-primary-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-xs font-semibold text-center">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 animate-fade-in">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;


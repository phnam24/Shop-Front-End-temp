import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Zap, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">TechStore</h3>
                <p className="text-xs text-primary-400">Công nghệ tin cậy</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              Hệ thống bán lẻ laptop và điện thoại chính hãng uy tín hàng đầu Việt Nam. 
              Cam kết chất lượng, giá tốt, phục vụ tận tâm.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-400 hover:text-white transition-colors group cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-primary-900/50 flex items-center justify-center mr-3 group-hover:bg-primary-800 transition-colors">
                  <MapPin className="w-5 h-5 text-primary-400" />
                </div>
                <span className="text-sm">123 Đường ABC, Quận 1, TP.HCM</span>
              </div>
              <div className="flex items-center text-gray-400 hover:text-white transition-colors group cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-primary-900/50 flex items-center justify-center mr-3 group-hover:bg-primary-800 transition-colors">
                  <Phone className="w-5 h-5 text-primary-400" />
                </div>
                <span className="text-sm">1900 xxxx</span>
              </div>
              <div className="flex items-center text-gray-400 hover:text-white transition-colors group cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-primary-900/50 flex items-center justify-center mr-3 group-hover:bg-primary-800 transition-colors">
                  <Mail className="w-5 h-5 text-primary-400" />
                </div>
                <span className="text-sm">support@techstore.vn</span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              {[
                { name: 'Facebook', icon: Facebook, color: 'hover:bg-blue-600' },
                { name: 'Instagram', icon: Instagram, color: 'hover:bg-pink-600' },
                { name: 'Twitter', icon: Twitter, color: 'hover:bg-sky-500' },
                { name: 'YouTube', icon: Youtube, color: 'hover:bg-red-600' },
              ].map((social) => (
                <button
                  key={social.name}
                  className={`w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-1 ${social.color}`}
                  title={social.name}
                >
                  <social.icon className="w-5 h-5 text-white" />
                </button>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Liên kết nhanh</h4>
            <ul className="space-y-3">
              {[
                { label: 'Về chúng tôi', path: '/about' },
                { label: 'Chính sách bảo hành', path: '/warranty' },
                { label: 'Chính sách vận chuyển', path: '/shipping' },
                { label: 'Chính sách đổi trả', path: '/return' },
              ].map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-600 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Hỗ trợ khách hàng</h4>
            <ul className="space-y-3">
              {[
                { label: 'Câu hỏi thường gặp', path: '/faq' },
                { label: 'Hướng dẫn thanh toán', path: '/payment-guide' },
                { label: 'Tra cứu đơn hàng', path: '/order-tracking' },
                { label: 'Liên hệ', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-600 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Payment Methods */}
        <div className="py-6 border-t border-gray-800 mb-6">
          <h4 className="text-white font-semibold mb-4 text-center">Phương thức thanh toán</h4>
          <div className="flex flex-wrap justify-center gap-4">
            {['VISA', 'Mastercard', 'JCB', 'Momo', 'ZaloPay', 'VNPay'].map((method) => (
              <div
                key={method}
                className="px-4 py-2 bg-gray-800 rounded-lg text-gray-400 text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                {method}
              </div>
            ))}
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2025 TechStore. All rights reserved.
            </p>
            <div className="flex gap-6">
              {[
                { label: 'Điều khoản sử dụng', path: '/terms' },
                { label: 'Chính sách bảo mật', path: '/privacy' },
              ].map((term) => (
                <Link 
                  key={term.path}
                  to={term.path} 
                  className="text-gray-500 hover:text-primary-400 text-sm transition-colors"
                >
                  {term.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
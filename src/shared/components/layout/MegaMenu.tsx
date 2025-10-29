// src/shared/components/layout/MegaMenu.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Laptop, Smartphone, HardDrive, Monitor, Mouse, Keyboard, Menu } from 'lucide-react';
import { clsx } from 'clsx';

// --- Định nghĩa Types Rõ Ràng ---
interface MenuLink {
  label: string;
  href: string;
}

// Interface chung cho các thuộc tính tùy chọn
interface MenuGroupBase {
  heading: string;
  href?: string; // Heading có thể là link
  isTitle?: boolean; // Đánh dấu heading chính của cột/nhóm
  marginTop?: boolean; // Đánh dấu nếu cần margin top
}

// Interface cho nhóm chỉ có heading (có thể là link)
interface MenuHeadingOnly extends MenuGroupBase {
  children?: undefined; // Không có children
}

// Interface cho nhóm có heading và danh sách link con
interface MenuGroupWithChildren extends MenuGroupBase {
  children: MenuLink[];
}

// Interface cho nhóm chỉ có danh sách link con (heading rỗng hoặc không cần)
interface MenuLinksOnly {
    heading?: string; // Heading có thể có hoặc không
    children: MenuLink[];
    href?: undefined; // Không có link cho cả nhóm
    isTitle?: undefined; // Không phải tiêu đề chính
    marginTop?: boolean;
}


// Union Type cho một item trong cột
type MegaMenuGroupItem = MenuHeadingOnly | MenuGroupWithChildren | MenuLinksOnly;

// Định nghĩa cấu trúc cho dữ liệu menu chính
interface MegaMenuCategoryData {
    key: string;
    icon?: React.ElementType;
    title: string;
    columns: MegaMenuGroupItem[][]; // Mảng 2 chiều các group items
}
// --- Kết thúc Định nghĩa Types ---


// --- Dữ liệu Mock (Ép kiểu và cấu trúc lại nếu cần) ---
// Dữ liệu này cần tuân thủ các interface đã định nghĩa
const megaMenuData: Record<string, MegaMenuCategoryData> = {
  danhMuc: {
    key: 'danhMuc',
    icon: Menu,
    title: 'Danh mục Sản phẩm',
    columns: [
      // Column 1
      [
        { heading: 'Laptop', href: '/laptops', children: [
            { label: 'Laptop Apple (Macbook)', href: '/laptops?brand=1' },
            { label: 'Laptop Dell', href: '/laptops?brand=2' },
            { label: 'Laptop HP', href: '/laptops?brand=3' },
            { label: 'Laptop Lenovo', href: '/laptops?brand=4' },
            { label: 'Laptop ASUS', href: '/laptops?brand=5' },
            { label: 'Laptop Acer', href: '/laptops?brand=6' },
            { label: 'Laptop MSI', href: '/laptops?brand=7' },
        ]},
        { heading: 'Điện thoại', href: '/smartphones', children: [
            { label: 'iPhone', href: '/smartphones?brand=apple' },
            { label: 'Samsung', href: '/smartphones?brand=samsung' },
            { label: 'Xiaomi', href: '/smartphones?brand=xiaomi' },
            { label: 'OPPO', href: '/smartphones?brand=oppo' },
        ]},
      ],
      // Column 2
       [
        { heading: 'PC - Linh kiện', href: '/pc-components', children: [
            { label: 'CPU - Bộ vi xử lý', href: '/components/cpu' },
            { label: 'Mainboard - Bo mạch chủ', href: '/components/mainboard' },
            { label: 'RAM - Bộ nhớ trong', href: '/components/ram' },
            { label: 'SSD - Ổ cứng thể rắn', href: '/components/ssd' },
            { label: 'HDD - Ổ cứng cơ', href: '/components/hdd' },
            { label: 'VGA - Card màn hình', href: '/components/vga' },
            { label: 'PSU - Nguồn máy tính', href: '/components/psu' },
            { label: 'Case - Vỏ máy tính', href: '/components/case' },
        ]},
      ],
      // Column 3
      [
         { heading: 'Màn hình', href: '/monitors', children: [
            { label: 'Màn hình Dell', href: '/monitors?brand=dell' },
            { label: 'Màn hình Samsung', href: '/monitors?brand=samsung' },
            { label: 'Màn hình LG', href: '/monitors?brand=lg' },
            { label: 'Màn hình ViewSonic', href: '/monitors?brand=viewsonic' },
            { label: 'Màn hình Gaming', href: '/monitors/gaming' },
        ]},
        { heading: 'Gaming Gear', href: '/gaming-gear', children: [
            { label: 'Bàn phím cơ', href: '/gear/keyboards' },
            { label: 'Chuột gaming', href: '/gear/mice' },
            { label: 'Tai nghe gaming', href: '/gear/headsets' },
            { label: 'Lót chuột', href: '/gear/mousepads' },
        ], marginTop: true }, // marginTop ở đây ok vì MenuGroupWithChildren có prop này
      ]
    ]
  },
  laptop: {
    key: 'laptop',
    icon: Laptop,
    title: 'Laptop',
    columns: [
      // Column 1: Thương hiệu
      [
        { heading: 'Thương hiệu Laptop', isTitle: true, href: '/laptops' }, // MenuHeadingOnly
        // Dùng MenuLinksOnly để chứa list link
        { children: [
            { label: 'Laptop Apple (Macbook)', href: '/laptops?brand=1' },
            { label: 'Laptop Dell', href: '/laptops?brand=2' },
            { label: 'Laptop HP', href: '/laptops?brand=3' },
            { label: 'Laptop Lenovo', href: '/laptops?brand=4' },
            { label: 'Laptop ASUS', href: '/laptops?brand=5' },
            { label: 'Laptop Acer', href: '/laptops?brand=6' },
            { label: 'Laptop MSI', href: '/laptops?brand=7' },
            { label: 'Laptop LG Gram', href: '/laptops?brand=8' },
            { label: 'Laptop Gigabyte', href: '/laptops?brand=9' },
        ]}
      ],
      // Column 2: Nhu cầu
      [
         { heading: 'Chọn Laptop theo nhu cầu', isTitle: true }, // MenuHeadingOnly
         { children: [
             { label: 'Laptop Gaming', href: '/laptops/gaming' },
             { label: 'Laptop AI', href: '/laptops/ai' },
             { label: 'Laptop Đồ họa - Kỹ thuật', href: '/laptops/do-hoa' },
             { label: 'Laptop Sinh viên - Văn phòng', href: '/laptops/sinh-vien-van-phong' },
             { label: 'Laptop Mỏng nhẹ', href: '/laptops/mong-nhe' },
             { label: 'Laptop Doanh nhân', href: '/laptops/doanh-nhan' },
             { label: 'Laptop 2-in-1', href: '/laptops/2-in-1' },
         ]}
      ],
      // Column 3: Khoảng giá & Linh kiện
       [
         { heading: 'Chọn Laptop theo giá', isTitle: true }, // MenuHeadingOnly
         { children: [
             { label: 'Dưới 15 triệu', href: '/laptops?price=0-15' },
             { label: 'Từ 15 - 25 triệu', href: '/laptops?price=15-25' },
             { label: 'Từ 25 - 35 triệu', href: '/laptops?price=25-35' },
             { label: 'Trên 35 triệu', href: '/laptops?price=35-' },
         ]},
         { heading: 'Phụ kiện Laptop', isTitle: true, marginTop: true }, // MenuHeadingOnly
         { children: [
             { label: 'RAM Laptop', href: '/accessories/ram' },
             { label: 'SSD Laptop', href: '/accessories/ssd' },
             { label: 'Balo, túi chống sốc', href: '/accessories/bags' },
             { label: 'Đế tản nhiệt', href: '/accessories/cooling-pads' },
         ]}
      ],
    ]
  },
   pcLinhKien: { key: 'pcLinhKien', icon: HardDrive, title: 'PC - Linh kiện', columns: [[]]}, // Placeholder
   manHinh: { key: 'manHinh', icon: Monitor, title: 'Màn hình', columns: [[]]}, // Placeholder
   banPhim: { key: 'banPhim', icon: Keyboard, title: 'Bàn phím', columns: [[]]}, // Placeholder
   chuot: { key: 'chuot', icon: Mouse, title: 'Chuột', columns: [[]]}, // Placeholder
   dienThoai: {
      key: 'dienThoai',
      icon: Smartphone,
      title: 'Điện thoại',
      columns: [
        [
            { heading: 'Thương hiệu Điện thoại', isTitle: true, href: '/smartphones' },
            { children: [ // Dùng MenuLinksOnly
                { label: 'iPhone', href: '/smartphones?brand=apple' },
                { label: 'Samsung', href: '/smartphones?brand=samsung' },
                { label: 'Xiaomi', href: '/smartphones?brand=xiaomi' },
                { label: 'OPPO', href: '/smartphones?brand=oppo' },
                { label: 'Vivo', href: '/smartphones?brand=vivo' },
            ]}
        ],
        [
            { heading: 'Chọn Điện thoại theo tính năng', isTitle: true },
             { children: [ // Dùng MenuLinksOnly
                { label: 'Điện thoại 5G', href: '/smartphones/5g' },
                { label: 'Điện thoại Gaming', href: '/smartphones/gaming' },
                { label: 'Chụp ảnh đẹp', href: '/smartphones/camera' },
                { label: 'Pin trâu', href: '/smartphones/battery' },
             ]}
        ],
        [
            { heading: 'Phụ kiện Điện thoại', isTitle: true },
             { children: [ // Dùng MenuLinksOnly
                { label: 'Ốp lưng', href: '/accessories/cases' },
                { label: 'Sạc, cáp', href: '/accessories/chargers' },
                { label: 'Tai nghe', href: '/accessories/earphones' },
                { label: 'Sạc dự phòng', href: '/accessories/powerbanks' },
            ]}
        ]
      ]
    },
};
// --- Kết thúc dữ liệu Mock ---

interface MegaMenuProps {
  isOpen: boolean;
  activeTriggerKey: string | null;
  onClose: () => void;
  setActiveTriggerKey: (key: string | null) => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({
  isOpen,
  activeTriggerKey,
  onClose,
  setActiveTriggerKey
}) => {
  // --- Logic State (useEffect, handleInternalNavHover, currentMenuData) giữ nguyên ---
    const [activeInternalKey, setActiveInternalKey] = useState<string | null>(activeTriggerKey || 'danhMuc');
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        if (isOpen && activeTriggerKey && activeTriggerKey !== activeInternalKey) {
            setIsTransitioning(true);
            const timer = setTimeout(() => {
                setActiveInternalKey(activeTriggerKey);
                setIsTransitioning(false);
            }, 100);
            return () => clearTimeout(timer);
        } else if (isOpen && !activeTriggerKey && activeInternalKey !== 'danhMuc') {
            setIsTransitioning(true);
            const timer = setTimeout(() => {
                setActiveInternalKey('danhMuc');
                setIsTransitioning(false);
            }, 100);
            return () => clearTimeout(timer);
        } else if (isOpen && activeTriggerKey) {
             // Đảm bảo internal key được cập nhật ngay cả khi không có transition
            if (activeInternalKey !== activeTriggerKey) {
                 setActiveInternalKey(activeTriggerKey);
            }
             setIsTransitioning(false); // Đảm bảo tắt transition nếu hover lại cùng mục
        } else if (!isOpen) {
             // Reset về danh mục khi đóng hẳn để lần mở sau đúng
            if (activeInternalKey !== 'danhMuc') {
                 const timer = setTimeout(() => setActiveInternalKey('danhMuc'), 300); // Đợi animation đóng
                 return () => clearTimeout(timer);
            }
        }
    }, [isOpen, activeTriggerKey, activeInternalKey]); // Thêm activeInternalKey vào dependency


    const handleInternalNavHover = (key: string) => {
        if (key !== activeInternalKey) {
            setIsTransitioning(true);
            // Không cần timeout ở đây nữa, useEffect sẽ xử lý
             setActiveInternalKey(key);
             // setActiveTriggerKey(key); // Cập nhật trigger key nếu muốn highlight header thay đổi theo
        }
    };

    // Lấy dữ liệu an toàn hơn
    const currentMenuData = (activeInternalKey && megaMenuData[activeInternalKey]) || megaMenuData.danhMuc;
  // --- Kết thúc Logic State ---


  // --- Render ---
  return (
    <div
      className={clsx(
        "absolute top-full left-0 right-0 z-40",
        "transition-all duration-300 ease-out",
        isOpen
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-4 pointer-events-none"
      )}
    >
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-b-lg border border-t-0 border-gray-200">
        <div className="flex">
          {/* Left Sidebar Navigation */}
          <div className="w-64 border-r border-gray-200 py-4 px-2 flex-shrink-0">
             {/* --- Sidebar code giữ nguyên --- */}
             <ul>
              {Object.values(megaMenuData).map((item) => {
                const Icon = item.icon || Laptop;
                const isActive = activeInternalKey === item.key;
                return (
                  <li key={item.key}>
                    <button
                      onMouseEnter={() => handleInternalNavHover(item.key)}
                      onClick={onClose}
                      className={clsx(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150",
                        isActive
                          ? "bg-primary-50 text-primary-700"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      <Icon className={clsx("w-5 h-5", isActive ? "text-primary-600" : "text-gray-400")} />
                      <span>{item.title}</span>
                      <ChevronRight className={clsx("w-4 h-4 ml-auto", isActive ? "text-primary-600" : "text-gray-400")} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right Content Area */}
          <div className={clsx(
            "flex-1 p-6 transition-opacity duration-150 ease-in-out",
            isTransitioning ? 'opacity-0' : 'opacity-100'
           )}>
            <div className="grid grid-cols-3 gap-x-8">
              {(currentMenuData.columns || []).map((column, colIndex) => (
                <div key={colIndex} className="space-y-5">
                  {/* --- SỬ DỤNG TYPE GUARDS HOẶC KIỂM TRA --- */}
                  {column.map((group, groupIndex) => (
                    <div key={groupIndex} className={clsx(group.marginTop && "mt-8 pt-5 border-t border-gray-100")}>
                      {/* Render Heading (nếu có) */}
                      {group.heading && (
                        group.href ? (
                          <Link to={group.href} onClick={onClose} className={clsx(
                            "block text-sm font-bold mb-2.5 hover:text-primary-700 transition-colors",
                            group.isTitle ? "text-gray-800" : "text-primary-600"
                          )}>
                            {group.heading} {group.isTitle ? '' : <ChevronRight className="w-3 h-3 inline-block ml-1"/>}
                          </Link>
                        ) : (
                          <h4 className={clsx("text-sm font-bold mb-2.5", group.isTitle ? "text-gray-800" : "text-primary-600")}>
                            {group.heading}
                          </h4>
                        )
                      )}
                      {/* Render Children (nếu có) */}
                      {/* Kiểm tra 'children' tồn tại và là mảng */}
                      {Array.isArray(group.children) && group.children.length > 0 && (
                        <ul className="space-y-1.5">
                          {group.children.map((link, linkIndex) => (
                            <li key={linkIndex}>
                              <Link
                                to={link.href}
                                onClick={onClose}
                                className="block text-sm text-gray-600 hover:text-primary-600 hover:underline transition-colors py-0.5"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                  {/* --- KẾT THÚC SỬ DỤNG TYPE GUARDS --- */}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
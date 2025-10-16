import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Share2, 
  ShoppingCart, 
  Truck, 
  Shield, 
  RotateCcw,
  Home,
  ChevronRight,
  Minus,
  Plus,
  Star,
  Zap
} from 'lucide-react';
import { ProductCard } from '../domains/products/components/ProductCard';
import { ProductGallery } from '../domains/products/components/ProductGallery';
import { ProductVariants } from '../domains/products/components/ProductVariants';
import { ProductReviews } from '../domains/reviews/components/ProductReviews';
import { ReviewForm } from '../domains/reviews/components/ReviewForm';
import { mockDataService } from '../domains/products/services/mockDataService';
import type { Product, ProductVariant } from '../domains/products/types';

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
  }, [slug]);

  const loadProduct = async () => {
    setIsLoading(true);
    try {
      const data = await mockDataService.getProductBySlug(slug!);
      setProduct(data);
      
      // Set default variant
      if (data.variants && data.variants.length > 0) {
        setSelectedVariant(data.variants[0]);
      }

      // Load related products
      const related = await mockDataService.getProducts({
        categoryId: data.categoryId,
        pageSize: 4,
      });
      setRelatedProducts(related.items.filter(p => p.id !== data.id).slice(0, 4));
    } catch (error) {
      console.error('Load product error:', error);
      navigate('/products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (selectedVariant?.stock || 99)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant || selectedVariant.stock === 0) return;
    
    console.log('Add to cart:', {
      product,
      variant: selectedVariant,
      quantity,
    });
    
    alert(`Đã thêm ${quantity}x ${product?.name} vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const currentPrice = selectedVariant?.priceSale || selectedVariant?.priceList || product.minPrice || 0;
  const originalPrice = selectedVariant?.priceList || product.maxPrice || 0;
  const discountPercent = selectedVariant?.priceSale 
    ? Math.round(((selectedVariant.priceList - selectedVariant.priceSale) / selectedVariant.priceList) * 100)
    : 0;

  const images = product.images && product.images.length > 0 ? product.images : [product.avatar || '/placeholder.png'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6 animate-slide-down">
          <Link to="/" className="hover:text-primary-600 flex items-center">
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/products" className="hover:text-primary-600">
            Sản phẩm
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </nav>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Image Gallery */}
          <div className="animate-slide-up">
            {/* Main Image */}
            <div className="bg-white rounded-2xl p-6 mb-4 shadow-lg border border-gray-200">
              <div className="aspect-square relative overflow-hidden rounded-xl bg-gray-50">
                <img
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
                {discountPercent > 0 && (
                  <div className="absolute top-4 left-4">
                    <span className="badge bg-red-500 text-white font-bold text-sm px-3 py-1.5 shadow-lg">
                      -{discountPercent}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index
                      ? 'border-primary-600 shadow-lg'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 sticky top-24">
              {/* Brand */}
              <div className="mb-2">
                <span className="text-sm font-bold text-primary-700 uppercase tracking-wide">
                  {product.brand?.name}
                </span>
              </div>

              {/* Product Name */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="flex text-accent-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating || 0) ? 'fill-current' : ''
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {product.rating?.toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{product.reviewCount}</span> đánh giá
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-primary-900">
                    {formatPrice(currentPrice)}
                  </span>
                  {discountPercent > 0 && (
                    <span className="text-xl text-gray-400 line-through">
                      {formatPrice(originalPrice)}
                    </span>
                  )}
                </div>
                {discountPercent > 0 && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-lg">
                    <span className="text-sm font-semibold text-red-600">
                      Tiết kiệm {formatPrice(originalPrice - currentPrice)}
                    </span>
                  </div>
                )}
              </div>

              {/* Variant Selector - Color */}
              {product.variants && product.variants.length > 1 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Màu sắc: <span className="text-primary-700">{selectedVariant?.color}</span>
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {[...new Set(product.variants.map(v => v.color))].map((color) => {
                      const variant = product.variants!.find(v => v.color === color);
                      const isSelected = selectedVariant?.color === color;
                      return (
                        <button
                          key={color}
                          onClick={() => variant && handleVariantSelect(variant)}
                          className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                            isSelected
                              ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-lg'
                              : 'border-gray-300 hover:border-primary-300 text-gray-700'
                          }`}
                        >
                          {color}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Variant Selector - RAM */}
              {selectedVariant && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Cấu hình
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-600 mb-1">RAM</div>
                      <div className="font-bold text-gray-900">{selectedVariant.ramGb}GB</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-600 mb-1">SSD</div>
                      <div className="font-bold text-gray-900">{selectedVariant.storageGb}GB</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-600 mb-1">Còn lại</div>
                      <div className="font-bold text-gray-900">{selectedVariant.stock}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Số lượng</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="px-6 py-2 font-bold text-lg">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= (selectedVariant?.stock || 99)}
                      className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">
                    {selectedVariant?.stock || 0} sản phẩm có sẵn
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || selectedVariant.stock === 0}
                  className="flex-1 btn btn-accent py-4 text-base shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Thêm vào giỏ
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!selectedVariant || selectedVariant.stock === 0}
                  className="flex-1 btn btn-primary py-4 text-base shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Mua ngay
                </button>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3">
                <button className="flex-1 btn btn-outline py-3 text-sm">
                  <Heart className="w-4 h-4 mr-2" />
                  Yêu thích
                </button>
                <button className="flex-1 btn btn-outline py-3 text-sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Chia sẻ
                </button>
              </div>

              {/* Features */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                {[
                  { icon: Truck, text: 'Miễn phí vận chuyển toàn quốc' },
                  { icon: Shield, text: 'Bảo hành chính hãng 24 tháng' },
                  { icon: RotateCcw, text: 'Đổi trả trong 15 ngày' },
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center text-sm text-gray-700">
                    <feature.icon className="w-5 h-5 text-primary-600 mr-3" />
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-12">
          {/* Tab Headers */}
          <div className="border-b border-gray-200">
            <div className="flex">
              {[
                { key: 'description' as const, label: 'Mô tả sản phẩm' },
                { key: 'specs' as const, label: 'Thông số kỹ thuật' },
                { key: 'reviews' as const, label: `Đánh giá (${product.reviewCount})` },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-8 py-4 font-semibold transition-all relative ${
                    activeTab === tab.key
                      ? 'text-primary-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: product.description || product.shortDescription || '<p>Đang cập nhật...</p>' }} />
              </div>
            )}

            {activeTab === 'specs' && selectedVariant && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'CPU', value: selectedVariant.cpuModel },
                  { label: 'GPU', value: selectedVariant.gpuModel },
                  { label: 'RAM', value: `${selectedVariant.ramGb}GB` },
                  { label: 'Ổ cứng', value: `${selectedVariant.storageGb}GB SSD` },
                  { label: 'Hệ điều hành', value: selectedVariant.os },
                  { label: 'Trọng lượng', value: `${(selectedVariant.weightG || 0) / 1000}kg` },
                ].map((spec, idx) => (
                  <div key={idx} className="flex justify-between py-3 border-b border-gray-200">
                    <span className="font-semibold text-gray-900">{spec.label}</span>
                    <span className="text-gray-700">{spec.value || 'N/A'}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {showReviewForm ? (
                  <ReviewForm
                    productId={product.id}
                    productName={product.name}
                    onSuccess={() => {
                      setShowReviewForm(false);
                      // Trigger reviews reload via key change or callback
                    }}
                    onCancel={() => setShowReviewForm(false)}
                  />
                ) : (
                  <ProductReviews
                    productId={product.id}
                    onWriteReview={() => setShowReviewForm(true)}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm tương tự</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  onAddToCart={() => console.log('Add to cart:', relatedProduct)}
                  onAddToWishlist={() => console.log('Add to wishlist:', relatedProduct)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
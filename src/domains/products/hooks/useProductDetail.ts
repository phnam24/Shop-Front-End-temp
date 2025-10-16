import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockDataService } from '../services/mockDataService';
import type { Product, ProductVariant } from '../types';

export const useProductDetail = (slug: string | undefined) => {
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
  }, [slug]);

  const loadProduct = async () => {
    if (!slug) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await mockDataService.getProductBySlug(slug);
      setProduct(data);
      
      // Set default variant
      if (data.variants && data.variants.length > 0) {
        setSelectedVariant(data.variants[0]);
      }

      // Load related products
      const related = await mockDataService.getProducts({
        categoryId: data.categoryId,
        pageSize: 5,
      });
      
      setRelatedProducts(
        related.items.filter(p => p.id !== data.id).slice(0, 4)
      );
    } catch (err: any) {
      console.error('Load product error:', err);
      setError(err.message || 'Không thể tải sản phẩm');
      // Redirect to products page after 2s
      setTimeout(() => navigate('/products'), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setQuantity(1); // Reset quantity when changing variant
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    const maxQuantity = selectedVariant?.stock || 99;
    
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const setQuantityDirect = (value: number) => {
    const maxQuantity = selectedVariant?.stock || 99;
    
    if (value >= 1 && value <= maxQuantity) {
      setQuantity(value);
    }
  };

  // Price calculations
  const currentPrice = selectedVariant?.priceSale || selectedVariant?.priceList || product?.minPrice || 0;
  const originalPrice = selectedVariant?.priceList || product?.maxPrice || 0;
  const discountPercent = selectedVariant?.priceSale 
    ? Math.round(((selectedVariant.priceList - selectedVariant.priceSale) / selectedVariant.priceList) * 100)
    : 0;

  return {
    product,
    isLoading,
    error,
    selectedVariant,
    quantity,
    relatedProducts,
    currentPrice,
    originalPrice,
    discountPercent,
    handleVariantSelect,
    handleQuantityChange,
    setQuantityDirect,
  };
};


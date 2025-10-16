import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  discount?: number;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ 
  images, 
  productName,
  discount 
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-200 group">
          <div className="aspect-square relative overflow-hidden rounded-xl bg-gray-50">
            <img
              src={images[selectedIndex]}
              alt={`${productName} ${selectedIndex + 1}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            
            {/* Discount Badge */}
            {discount && discount > 0 && (
              <div className="absolute top-4 left-4">
                <span className="badge bg-red-500 text-white font-bold text-sm px-3 py-1.5 shadow-lg animate-pulse">
                  -{discount}%
                </span>
              </div>
            )}

            {/* Zoom Button */}
            <button
              onClick={() => setIsZoomed(true)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110"
              title="Phóng to"
            >
              <ZoomIn className="w-5 h-5 text-gray-700" />
            </button>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6 text-gray-700" />
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm font-medium">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  selectedIndex === index
                    ? 'border-primary-600 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-primary-300 hover:scale-105'
                }`}
              >
                <img
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in">
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform z-10"
          >
            <X className="w-6 h-6 text-gray-900" />
          </button>

          <div className="relative w-full h-full flex items-center justify-center p-8">
            <img
              src={images[selectedIndex]}
              alt={`${productName} zoomed`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Navigation in Zoom Mode */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <ChevronLeft className="w-8 h-8 text-gray-900" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <ChevronRight className="w-8 h-8 text-gray-900" />
                </button>
              </>
            )}

            {/* Thumbnail Strip in Zoom */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/60 backdrop-blur-sm p-2 rounded-lg">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                    selectedIndex === index
                      ? 'border-white scale-110'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
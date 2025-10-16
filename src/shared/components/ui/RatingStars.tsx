import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number; // 0-5, can be decimal (e.g., 4.5)
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  showNumber = false,
  interactive = false,
  onRatingChange,
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const getStarFill = (index: number) => {
    const value = hoverRating || rating;
    const starValue = index + 1;

    if (value >= starValue) {
      return 'full'; // Fully filled
    } else if (value >= starValue - 0.5) {
      return 'half'; // Half filled
    } else {
      return 'empty'; // Empty
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: maxRating }).map((_, index) => {
          const fill = getStarFill(index);

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleClick(index + 1)}
              onMouseEnter={() => handleMouseEnter(index + 1)}
              onMouseLeave={handleMouseLeave}
              disabled={!interactive}
              className={`relative ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
            >
              {fill === 'full' ? (
                <Star
                  className={`${sizeClasses[size]} fill-accent-400 text-accent-400`}
                />
              ) : fill === 'half' ? (
                <div className="relative">
                  <Star
                    className={`${sizeClasses[size]} fill-gray-300 text-gray-300`}
                  />
                  <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                    <Star
                      className={`${sizeClasses[size]} fill-accent-400 text-accent-400`}
                    />
                  </div>
                </div>
              ) : (
                <Star
                  className={`${sizeClasses[size]} ${interactive ? 'text-gray-300 hover:text-accent-400' : 'text-gray-300'}`}
                />
              )}
            </button>
          );
        })}
      </div>

      {showNumber && (
        <span className="text-sm font-semibold text-gray-700 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};


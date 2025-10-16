import React from 'react';
import { clsx } from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  glass?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  glass = false,
  padding = 'md',
  className,
  ...props
}) => {
  const baseClass = glass ? 'card-glass' : 'card';
  
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  return (
    <div
      className={clsx(
        baseClass,
        hoverable && 'hover-lift',
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
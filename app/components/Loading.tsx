'use client';
import { ReactNode } from 'react';

interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Loading({ message = 'Loading...', size = 'md' }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`animate-spin rounded-full border-2 border-green-600 border-t-transparent ${sizeClasses[size]} mb-4`}></div>
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  );
}

interface LoadingPageProps {
  message?: string;
}

export function LoadingPage({ message = 'Loading page...' }: LoadingPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loading message={message} size="lg" />
    </div>
  );
}

interface LoadingButtonProps {
  loading: boolean;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function LoadingButton({ loading, children, className = '', disabled }: LoadingButtonProps) {
  return (
    <button
      className={`relative ${className}`}
      disabled={loading || disabled}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full w-4 h-4 border-2 border-white border-t-transparent"></div>
        </div>
      )}
      <span className={loading ? 'invisible' : ''}>{children}</span>
    </button>
  );
}
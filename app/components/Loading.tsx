'use client';
import { ReactNode } from 'react';

interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Loading({ message = 'Loading...', size = 'md' }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative mb-6">
        <div className={`spinner ${sizeClasses[size]}`}></div>
        <div className={`absolute inset-0 animate-ping rounded-full bg-green-400 opacity-20 ${sizeClasses[size]}`}></div>
      </div>
      <p className="text-gray-700 text-base font-medium animate-pulse">{message}</p>
    </div>
  );
}

interface LoadingPageProps {
  message?: string;
}

export function LoadingPage({ message = 'Loading page...' }: LoadingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-6 animate-bounce">🌱</div>
        <Loading message={message} size="lg" />
      </div>
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
      className={`relative ${className} ${loading ? 'opacity-80 cursor-wait' : ''}`}
      disabled={loading || disabled}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-lg">
          <div className="spinner w-5 h-5 border-white"></div>
        </div>
      )}
      <span className={loading ? 'invisible' : ''}>{children}</span>
    </button>
  );
}
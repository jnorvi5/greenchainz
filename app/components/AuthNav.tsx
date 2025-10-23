'use client';
import { useAuth } from '../auth/context';
import Link from 'next/link';

export function AuthNav() {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="spinner w-5 h-5"></div>
        <span className="text-sm font-medium">Loading...</span>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/register-supplier"
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg whitespace-nowrap"
        >
          📋 Register as Supplier
        </Link>
        <Link
          href="/admin"
          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg whitespace-nowrap"
        >
          ⚙️ Admin
        </Link>
        <span className="text-sm font-medium bg-white bg-opacity-20 px-3 py-2 rounded-lg backdrop-blur-sm hidden md:inline-block">
          👋 {user.email?.split('@')[0]}
        </span>
        <button
          onClick={signOut}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg whitespace-nowrap"
        >
          🚪 Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Link
        href="/auth"
        className="bg-white text-green-600 hover:bg-green-50 px-5 py-2 rounded-lg text-sm font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg whitespace-nowrap"
      >
        🔐 Sign In
      </Link>
    </div>
  );
}
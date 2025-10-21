'use client';
import { useAuth } from '../auth/context';
import Link from 'next/link';

export function AuthNav() {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return <div className="text-sm">Loading...</div>;
  }

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          href="/register-supplier"
          className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm"
        >
          Register as Supplier
        </Link>
        <Link
          href="/admin"
          className="bg-purple-600 hover:bg-purple-500 px-3 py-1 rounded text-sm"
        >
          Admin
        </Link>
        <span className="text-sm">Welcome, {user.email}</span>
        <button
          onClick={signOut}
          className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-sm"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex space-x-2">
      <Link
        href="/auth"
        className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-sm"
      >
        Sign In
      </Link>
    </div>
  );
}
'use client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function AuthPage() {
  const redirectUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/` 
    : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000/';
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-green-800">
          Welcome to GreenChainz
        </h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="light"
          providers={['google', 'github']}
          redirectTo={redirectUrl}
        />
      </div>
    </div>
  );
}
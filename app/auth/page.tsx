'use client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function AuthPage() {
  const [redirectUrl, setRedirectUrl] = useState('/');

  useEffect(() => {
    setRedirectUrl(window.location.origin + '/');
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-10 glass-effect bounce-in hover-lift">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">🌱</div>
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Welcome to GreenChainz
          </h1>
          <p className="text-gray-600">Sign in to access sustainable suppliers</p>
        </div>
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
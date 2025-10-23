'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import { analytics } from '@/lib/analytics';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const prevUser = user;
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Track auth events
      if (event === 'SIGNED_IN' && session?.user) {
        analytics.identify(session.user.id, {
          email: session.user.email,
        });
        
        // Differentiate between sign-up and sign-in based on user metadata
        const isNewUser = session.user.created_at === session.user.updated_at || !prevUser;
        if (isNewUser) {
          analytics.track('user_signed_up', {
            userId: session.user.id,
            method: session.user.app_metadata.provider || 'email',
          });
        } else {
          analytics.track('user_signed_in', {
            userId: session.user.id,
            method: session.user.app_metadata.provider || 'email',
          });
        }
      } else if (event === 'SIGNED_OUT') {
        analytics.reset();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
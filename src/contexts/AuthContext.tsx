import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConnected } from '../lib/supabaseClient';

interface Profile {
  id: string;
  role: string;
  full_name?: string;
  is_admin?: boolean;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  loginAsAdmin: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // FIX: If Supabase isn't connected, stop loading and show the app in a logged-out state.
    if (!isSupabaseConnected || !supabase) {
      setLoading(false);
      return;
    }

    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          // Silently handle errors - don't show toast notifications
          console.warn("Error getting session:", error.message || 'Unknown error');
          setLoading(false);
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            const { data: userProfile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            if (!profileError && userProfile) {
              setProfile(userProfile);
            }
          } catch (profileErr: any) {
            // Silently handle profile fetch errors - don't show toasts
            console.warn("Could not fetch user profile:", profileErr?.message || 'Unknown error');
          }
        }
      } catch (e: any) {
        // Silently handle all network errors - don't show toast notifications
        // Only log to console for debugging
        const errorMessage = e?.message || e?.toString() || 'Unknown error';
        if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError') || errorMessage.includes('Network request failed')) {
          console.warn('Supabase connection issue: Network may be unreachable or Supabase URL is incorrect.');
        } else {
          console.warn("Error getting session:", errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };
    
    getSession();

    let authListener: { subscription: { unsubscribe: () => void } } | null = null;
    
    try {
      const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
        try {
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) {
            try {
              const { data: userProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              setProfile(userProfile);
            } catch (profileErr: any) {
              // Silently handle profile errors
              console.warn("Could not fetch user profile in auth listener:", profileErr?.message || 'Unknown error');
            }
          } else {
            setProfile(null);
          }
        } catch (err: any) {
          // Silently handle errors - don't show toast notifications
          console.warn("Error in auth state change handler:", err?.message || 'Unknown error');
        }
      });
      authListener = data;
    } catch (err: any) {
      // Silently handle listener setup errors
      console.warn("Could not set up auth listener:", err?.message || 'Unknown error');
    }

    return () => {
      if (authListener) {
        try {
          authListener.subscription.unsubscribe();
        } catch (e) {
          // Ignore unsubscribe errors
        }
      }
    };
  }, []);

  const logout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    if (!supabase) return;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    if (error) throw error;
  };

  const updatePassword = async (password: string) => {
    if (!supabase) return;
    const { error } = await supabase.auth.updateUser({
      password: password
    });
    if (error) throw error;
  };

  const loginAsAdmin = async (email: string, password: string) => {
    // Hardcoded admin credentials
    if (email === "nitishk38938@gmail.com" && password === "Dreamjob@123Admin") {
      // Set admin status directly without Supabase authentication
      setIsAdmin(true);
      
      // Create a mock profile for the admin
      const adminProfile: Profile = {
        id: 'admin-user',
        role: 'admin',
        full_name: 'Admin User',
        is_admin: true
      };
      
      setProfile(adminProfile);
      return;
    } else {
      // If credentials don't match, throw error
      throw new Error('Invalid admin credentials');
    }
  };


  // Update isAdmin state when profile changes
  useEffect(() => {
    if (profile?.is_admin) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [profile]);

  const value = {
    session,
    user,
    profile,
    loading,
    isAdmin,
    logout,
    resetPassword,
    updatePassword,
    loginAsAdmin,
  };

  return <AuthContext.Provider value={value}>{!loading ? children : null}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

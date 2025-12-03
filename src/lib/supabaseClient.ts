import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
// Optional service role key for admin operations (bypassing RLS)
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

let supabase: SupabaseClient | null = null;
let isSupabaseConnected = false;

// Function to get admin client (bypasses RLS)
export const getAdminClient = () => {
  if (supabaseUrl && supabaseServiceKey && supabaseServiceKey !== 'YOUR_SUPABASE_SERVICE_ROLE_KEY') {
    try {
      return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          persistSession: false
        }
      });
    } catch (error) {
      console.error("Error initializing Supabase admin client", error);
      return null;
    }
  }
  return null;
};

// Initialize Supabase client with better error handling
if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY') {
  try {
    // Validate URL format before creating client
    try {
      new URL(supabaseUrl);
      
      // Create client if URL validation passed
      supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
      isSupabaseConnected = true;
      console.log('✅ Supabase client initialized successfully');
      console.log('Supabase URL:', supabaseUrl);
    } catch (urlError) {
      console.error("❌ Invalid Supabase URL format:", supabaseUrl);
      supabase = null;
      isSupabaseConnected = false;
    }
  } catch (error) {
    console.error("❌ Error initializing Supabase client:", error);
    supabase = null;
    isSupabaseConnected = false;
  }
} else {
  console.warn('⚠️ Supabase credentials are not configured in the .env file.');
  console.warn('📝 Setup Instructions:');
  console.warn('   Your Project ID: tajcecinwsnxqzjldbvp');
  console.warn('   1. Go to https://supabase.com/dashboard/project/tajcecinwsnxqzjldbvp/settings/api');
  console.warn('   2. Copy anon public key');
  console.warn('   3. Create/Update .env file in project root:');
  console.warn('      VITE_SUPABASE_URL=https://tajcecinwsnxqzjldbvp.supabase.co');
  console.warn('      VITE_SUPABASE_ANON_KEY=your-anon-key-here');
  console.warn('   4. Restart development server');
  supabase = null;
  isSupabaseConnected = false;
}

export { supabase, isSupabaseConnected };

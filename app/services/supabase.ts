import { createClient } from '@supabase/supabase-js';

// Use environment variables for Supabase credentials
// For NativeScript, we can use a more direct approach
const SUPABASE_URL = 'https://otfikfaeorpypaayhqzz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90ZmlrZmFlb3JweXBhYXlocXp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MTYxNjIsImV4cCI6MjA1NjM5MjE2Mn0.CuONAAGsrZRPK7YHi9hVOcVnv_6MtWCXJJkPy8oBY6o';

// Create a custom fetch implementation that works in NativeScript
const customFetch = (url: RequestInfo | URL, options?: RequestInit) => {
  return fetch(url, {
    ...options,
    // Add any NativeScript-specific headers or configurations here if needed
  });
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  },
  global: {
    fetch: customFetch
  }
});

export function initializeSupabase() {
  console.log('Supabase initialized');
  
  // Check if we have credentials
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn('⚠️ Supabase credentials not set. Please check your environment variables.');
  }
  
  // Set up auth state change listener
  supabase.auth.onAuthStateChange((event: string, session: any) => {
    console.log(`Supabase auth event: ${event}`);
    
    if (event === 'SIGNED_IN') {
      console.log('User signed in:', session?.user?.email);
    } else if (event === 'SIGNED_OUT') {
      console.log('User signed out');
    }
  });
}
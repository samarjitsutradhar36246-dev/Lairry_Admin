import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://oohnrahlyessleyhkfcg.supabase.co";
const supabaseAnonKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vaG5yYWhseWVzc2xleWhrZmNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxNTc3MzIsImV4cCI6MjA4MjczMzczMn0.BYB3-N9Fn5GYg3CwVsOlDGZgZqKioritzFPSH9e1lKo";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true, // allow persistence
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
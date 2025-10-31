import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client (uses service role key)
export function getServerSupabase() {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Types for database tables
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Assessment {
  id: string;
  user_id?: string;
  income: number;
  savings: number;
  monthly_debt: number;
  credit_score_range?: string;
  target_price: number;
  confidence?: number;
  job_stability?: string;
  life_stability?: string;
  location?: string;
  timeline?: string;
  total_score?: number;
  financial_score?: number;
  emotional_score?: number;
  timing_score?: number;
  decision?: 'YES' | 'NO' | 'NOT YET';
  message?: string;
  recommendations?: any;
  created_at: string;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  score?: number;
  source?: string;
  created_at: string;
}

export interface Event {
  id: string;
  user_id?: string;
  event_type: string;
  properties?: any;
  created_at: string;
}

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined;

export const supabase = createClient(
  supabaseUrl ?? "http://localhost:54321",
  supabaseAnonKey ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vdC1jb25maWd1cmVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYwMDAwMDAsImV4cCI6MjAzMTU3NjAwMH0.not-a-real-key",
);

/** Whether Supabase env vars are configured — used to show a "not configured" state. */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl) && Boolean(supabaseAnonKey);
}

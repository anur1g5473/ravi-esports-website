/* ============================================
   SUPABASE CONFIGURATION
   RAVI ESPORTS Website
   ============================================ */

// Supabase Credentials
const SUPABASE_URL = 'https://cvnnqjkaoonibkocdool.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2bm5xamthb29uaWJrb2Nkb29sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxMzQyMTQsImV4cCI6MjA4MzcxMDIxNH0.OdWSpPacWI8_QrETRENbBbvG_XbMIl1LwLRopl_tQxU';

// Initialize Supabase Client using CDN global
const { createClient } = supabase;
window.supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('✅ Supabase connected successfully!');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// For mock mode, we don't need real Supabase credentials
const isMockMode = !supabaseUrl || !supabaseServiceKey;

if (isMockMode) {
  console.log('⚠️  Running in MOCK MODE - Supabase not configured');
}

// Create Supabase client with service role key for admin operations
const supabase = isMockMode ? null : createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Create public client for user operations
const supabasePublic = isMockMode ? null : createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = {
  supabase,
  supabasePublic
};

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface GetStoresFilters {
  postalCode?: string | null;
  categoryId?: string | null;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get filters from request body
    const filters = await req.json() as GetStoresFilters;
    console.log("Received filters:", filters);

    // Build the query
    let query = supabaseClient
      .from('stores')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (filters.postalCode) {
      query = query.contains('accepted_postal_codes', [filters.postalCode]);
    }

    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }

    // Execute the query
    const { data, error } = await query;

    if (error) throw error;

    // Return the stores
    return new Response(
      JSON.stringify({ data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in get-stores:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400
      }
    )
  }
}); 
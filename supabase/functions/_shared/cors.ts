// Invoked only via supabase-js's functions.invoke() from the site itself,
// but browsers still preflight cross-origin POSTs, so OPTIONS needs a reply.
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

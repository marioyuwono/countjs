import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Server-only. Uses the service role key to bypass RLS for administrative
// tasks (inviting a new employee's auth account). Never import this from
// a Client Component, and never send this key to the browser.
export function createAdminClient() {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL!
	return createSupabaseClient(
		url,
		process.env.SUPABASE_SECRET!,
		{
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
		}
	);
}

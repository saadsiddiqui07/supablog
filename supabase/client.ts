import { createClient } from "@supabase/supabase-js";

const supabase_key: string = process.env.NEXT_PUBLIC_SUPABASE_KEY as string;
const supabase_url: string = process.env.NEXT_PUBLIC_SUPABASE_URL as string;

export const supabase = createClient(supabase_url, supabase_key);

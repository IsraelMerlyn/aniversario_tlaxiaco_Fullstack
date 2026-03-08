import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

console.log("SUPABASE URL:", import.meta.env.VITE_SUPABASE_URL);
console.log(
    "PUBLIC URL TEST:",
    supabase.storage
        .from("registros-img")
        .getPublicUrl("archivo-prueba.jpg").data.publicUrl
);
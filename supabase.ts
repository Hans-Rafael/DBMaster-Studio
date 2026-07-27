import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || ''; // Service role key para operaciones de admin

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️  Supabase no está configurado. Configura SUPABASE_URL y SUPABASE_SERVICE_KEY en .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Interfaces TypeScript para las tablas
export interface Admin {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
  last_login: string | null;
}

export interface User {
  id: string;
  username: string;
  password_hash: string;
  email: string | null;
  role: 'student' | 'restricted' | 'banned';
  session_expires_at: string | null;
  created_at: string;
  last_login: string | null;
  created_by: string | null;
}

export interface TempPassword {
  id: string;
  password_hash: string;
  user_id: string | null;
  expires_at: string;
  created_at: string;
  used: boolean;
}
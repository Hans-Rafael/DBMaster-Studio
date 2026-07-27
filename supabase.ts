import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno primero
dotenv.config();

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || ''; // Service role key para operaciones de admin

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️  Supabase no está configurado. Configura SUPABASE_URL y SUPABASE_SERVICE_KEY en .env');
}

// Configuración de Supabase sin WebSocket
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'dbmaster-studio'
    }
  }
}) as any;

// Hack para desactivar WebSocket en Node.js 18
if (typeof process !== 'undefined' && process.versions && process.versions.node) {
  // @ts-ignore - Hack para desactivar WebSocket
  supabase.realtime = null;
}

// Interfaces TypeScript para las tablas
export interface Admin {
  id: string;
  email: string;
  password_hash: string;
  recovery_email: string | null;
  created_at: string;
  last_login: string | null;
}

export interface User {
  id: string;
  username: string;
  password: string; // Contraseña en texto plano para mostrar en panel
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
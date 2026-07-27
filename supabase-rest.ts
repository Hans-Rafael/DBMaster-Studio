import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️  Supabase no está configurado. Configura SUPABASE_URL y SUPABASE_SERVICE_KEY en .env');
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

// Helper para hacer peticiones a Supabase REST API
async function supabaseRequest<T>(
  table: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  options: {
    data?: any;
    filters?: Record<string, any>;
    select?: string;
    orderBy?: { column: string; ascending?: boolean };
  } = {}
): Promise<{ data: T | null; error: string | null }> {
  try {
    const url = new URL(`${supabaseUrl}/rest/v1/${table}`);
    
    // Agregar select
    if (options.select) {
      url.searchParams.append('select', options.select);
    }
    
    // Agregar filtros
    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }
    
    // Agregar orderBy
    if (options.orderBy) {
      url.searchParams.append('order', `${options.orderBy.column}${options.orderBy.ascending ? '.asc' : '.desc'}`);
    }
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
    };
    
    if (method === 'POST' || method === 'PATCH') {
      headers['Prefer'] = 'return=representation';
    }
    
    const response = await fetch(url.toString(), {
      method,
      headers,
      body: options.data ? JSON.stringify(options.data) : undefined,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return { data: null, error: errorText };
    }
    
    let data: T;
    if (method === 'DELETE') {
      data = null as T;
    } else {
      data = await response.json();
      // Para POST/PATCH, Supabase devuelve un array con el objeto creado/actualizado
      if (Array.isArray(data) && data.length === 1) {
        data = data[0] as T;
      }
    }
    
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Exportar funciones específicas para cada tabla
export const supabaseAdmin = {
  select: (filters?: Record<string, any>) => supabaseRequest<Admin[]>('admins', 'GET', { filters }),
  insert: (data: Partial<Admin>) => supabaseRequest<Admin>('admins', 'POST', { data }),
  update: (id: string, data: Partial<Admin>) => supabaseRequest<Admin>('admins', 'PATCH', { filters: { id: `eq.${id}` }, data }),
  delete: (id: string) => supabaseRequest<null>('admins', 'DELETE', { filters: { id: `eq.${id}` } }),
};

export const supabaseUsers = {
  select: (filters?: Record<string, any>, orderBy?: { column: string; ascending?: boolean }) => 
    supabaseRequest<User[]>('users', 'GET', { filters, orderBy }),
  insert: (data: Partial<User>) => supabaseRequest<User>('users', 'POST', { data }),
  update: (id: string, data: Partial<User>) => supabaseRequest<User>('users', 'PATCH', { filters: { id: `eq.${id}` }, data }),
  delete: (id: string) => supabaseRequest<null>('users', 'DELETE', { filters: { id: `eq.${id}` } }),
};

export const supabaseTempPasswords = {
  select: (filters?: Record<string, any>, orderBy?: { column: string; ascending?: boolean }) => 
    supabaseRequest<TempPassword[]>('temp_passwords', 'GET', { filters, orderBy }),
  insert: (data: Partial<TempPassword>) => supabaseRequest<TempPassword>('temp_passwords', 'POST', { data }),
  update: (id: string, data: Partial<TempPassword>) => supabaseRequest<TempPassword>('temp_passwords', 'PATCH', { filters: { id: `eq.${id}` }, data }),
  delete: (id: string) => supabaseRequest<null>('temp_passwords', 'DELETE', { filters: { id: `eq.${id}` } }),
};
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase, Admin, User, TempPassword } from './supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const PASSWORD_EXPIRY_DAYS = 7;

// ===== ADMIN AUTHENTICATION =====

// Login de administrador
export async function adminLogin(email: string, password: string): Promise<{ token: string; admin: Admin } | null> {
  try {
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !admin) {
      return null;
    }

    const isValid = await bcrypt.compare(password, admin.password_hash);
    if (!isValid) {
      return null;
    }

    // Actualizar last_login
    await supabase
      .from('admins')
      .update({ last_login: new Date().toISOString() })
      .eq('id', admin.id);

    // Generar token JWT para admin
    const token = jwt.sign(
      { adminId: admin.id, email: admin.email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { token, admin };
  } catch (error) {
    console.error('Error en adminLogin:', error);
    return null;
  }
}

// Verificar token de admin
export function verifyAdminToken(token: string): any {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.role === 'admin' ? decoded : null;
  } catch (error) {
    return null;
  }
}

// Crear nuevo administrador
export async function createAdmin(email: string, password: string): Promise<Admin | null> {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    
    const { data: admin, error } = await supabase
      .from('admins')
      .insert([{ email, password_hash: passwordHash }])
      .select()
      .single();

    if (error) return null;
    return admin;
  } catch (error) {
    console.error('Error en createAdmin:', error);
    return null;
  }
}

// ===== USER MANAGEMENT =====

// Crear nuevo usuario
export async function createUser(
  username: string, 
  password: string, 
  email: string | null = null,
  createdBy: string
): Promise<User | null> {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const sessionExpiresAt = new Date();
    sessionExpiresAt.setDate(sessionExpiresAt.getDate() + PASSWORD_EXPIRY_DAYS);
    
    const { data: user, error } = await supabase
      .from('users')
      .insert([{
        username,
        password_hash: passwordHash,
        email,
        role: 'student',
        session_expires_at: sessionExpiresAt.toISOString(),
        created_by: createdBy
      }])
      .select()
      .single();

    if (error) return null;
    return user;
  } catch (error) {
    console.error('Error en createUser:', error);
    return null;
  }
}

// Obtener todos los usuarios
export async function getAllUsers(): Promise<User[]> {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return [];
    return users || [];
  } catch (error) {
    console.error('Error en getAllUsers:', error);
    return [];
  }
}

// Obtener usuario por ID
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) return null;
    return user;
  } catch (error) {
    console.error('Error en getUserById:', error);
    return null;
  }
}

// Extender tiempo de sesión de usuario
export async function extendUserSession(userId: string, days: number = 7): Promise<User | null> {
  try {
    const sessionExpiresAt = new Date();
    sessionExpiresAt.setDate(sessionExpiresAt.getDate() + days);
    
    const { data: user, error } = await supabase
      .from('users')
      .update({ session_expires_at: sessionExpiresAt.toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) return null;
    return user;
  } catch (error) {
    console.error('Error en extendUserSession:', error);
    return null;
  }
}

// Restringir permisos de usuario
export async function updateUserRole(userId: string, role: 'student' | 'restricted' | 'banned'): Promise<User | null> {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId)
      .select()
      .single();

    if (error) return null;
    return user;
  } catch (error) {
    console.error('Error en updateUserRole:', error);
    return null;
  }
}

// Eliminar usuario
export async function deleteUser(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    return !error;
  } catch (error) {
    console.error('Error en deleteUser:', error);
    return false;
  }
}

// ===== TEMP PASSWORD MANAGEMENT (con Supabase) =====

// Generar contraseña temporal
function generateTempPassword(): string {
  const words = [
    'nube', 'sol', 'luna', 'mar', 'rio', 'monte', 'flor', 'arbol',
    'azul', 'rojo', 'verde', 'negro', 'blanco', 'dorado', 'plata',
    'estrella', 'fuego', 'tierra', 'aire', 'luz', 'sombra',
    'tigre', 'leon', 'lobo', 'aguila', 'delfin', 'ballena',
    'gato', 'perro', 'caballo', 'pajaro', 'mariposa',
    'futbol', 'basket', 'tenis', 'golf', 'natacion',
    'libro', 'lapiz', 'papel', 'mesa', 'silla', 'casa',
    'camino', 'puente', 'parque', 'ciudad', 'campo',
    'musica', 'danza', 'arte', 'pintura', 'foto',
    'cafe', 'te', 'leche', 'pan', 'queso', 'fruta',
    'manzana', 'naranja', 'limon', 'uva', 'mango',
    'oceano', 'cielo', 'playa', 'arena', 'montana',
    'corazon', 'mente', 'alma', 'vida', 'sueno'
  ];
  
  const word1 = words[Math.floor(Math.random() * words.length)];
  const word2 = words[Math.floor(Math.random() * words.length)];
  const number = Math.floor(Math.random() * 90) + 10;
  
  return `${word1}${word2}${number}`;
}

// Crear contraseña temporal en Supabase
export async function createTempPasswordInDb(userId?: string): Promise<{ id: string; password: string; expiresAt: Date } | null> {
  try {
    const password = generateTempPassword();
    const passwordHash = await bcrypt.hash(password, 10);
    const id = Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + PASSWORD_EXPIRY_DAYS);

    const { error } = await supabase
      .from('temp_passwords')
      .insert([{
        id,
        password_hash: passwordHash,
        user_id: userId || null,
        expires_at: expiresAt.toISOString(),
        used: false
      }]);

    if (error) return null;
    return { id, password, expiresAt };
  } catch (error) {
    console.error('Error en createTempPasswordInDb:', error);
    return null;
  }
}

// Obtener contraseñas activas
export async function getActivePasswordsFromDb(): Promise<TempPassword[]> {
  try {
    const { data: passwords, error } = await supabase
      .from('temp_passwords')
      .select('*')
      .gt('expires_at', new Date().toISOString())
      .eq('used', false)
      .order('created_at', { ascending: false });

    if (error) return [];
    return passwords || [];
  } catch (error) {
    console.error('Error en getActivePasswordsFromDb:', error);
    return [];
  }
}

// Eliminar contraseña temporal
export async function deletePasswordFromDb(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('temp_passwords')
      .delete()
      .eq('id', id);

    return !error;
  } catch (error) {
    console.error('Error en deletePasswordFromDb:', error);
    return false;
  }
}
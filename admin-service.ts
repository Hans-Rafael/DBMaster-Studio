import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { sendPasswordRecoveryEmail } from './email-service';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const PASSWORD_EXPIRY_DAYS = 7;

// Rutas de archivos JSON
const DATA_DIR = path.join(process.cwd(), 'admin-data');
const ADMINS_FILE = path.join(DATA_DIR, 'admins.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const TEMP_PASSWORDS_FILE = path.join(DATA_DIR, 'temp-passwords.json');

// Asegurar que el directorio exista
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Interfaces
interface Admin {
  id: string;
  email: string;
  password_hash: string;
  recovery_email: string | null;
  created_at: string;
  last_login: string | null;
}

interface User {
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

interface TempPassword {
  id: string;
  password_hash: string;
  user_id: string | null;
  expires_at: string;
  created_at: string;
  used: boolean;
}

// Funciones de persistencia
function readData<T>(filePath: string, defaultValue: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
    return defaultValue;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return defaultValue;
  }
}

function writeData<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
}

// ===== ADMIN AUTHENTICATION =====

// Login de administrador
export async function adminLogin(email: string, password: string): Promise<{ token: string; admin: Admin } | null> {
  try {
    const admins = readData<Admin[]>(ADMINS_FILE, []);
    const admin = admins.find(a => a.email === email);

    if (!admin) {
      return null;
    }

    const isValid = await bcrypt.compare(password, admin.password_hash);
    if (!isValid) {
      return null;
    }

    // Actualizar last_login
    admin.last_login = new Date().toISOString();
    writeData(ADMINS_FILE, admins);

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

// Login de administrador con contraseña temporal
export async function adminLoginWithTempPassword(email: string, tempPassword: string): Promise<{ token: string; admin: Admin } | null> {
  try {
    const admins = readData<Admin[]>(ADMINS_FILE, []);
    const admin = admins.find(a => a.email === email);

    if (!admin) {
      return null;
    }

    // Buscar contraseña temporal para este admin
    const tempPasswords = readData<TempPassword[]>(TEMP_PASSWORDS_FILE, []);
    const validTempPassword = tempPasswords.find(p => 
      p.user_id === admin.id && 
      !p.used && 
      new Date(p.expires_at) > new Date()
    );

    if (!validTempPassword) {
      return null;
    }

    // Verificar la contraseña temporal
    const isValid = await bcrypt.compare(tempPassword, validTempPassword.password_hash);
    if (!isValid) {
      return null;
    }

    // Marcar contraseña temporal como usada
    validTempPassword.used = true;
    writeData(TEMP_PASSWORDS_FILE, tempPasswords);

    // Actualizar contraseña del administrador con la temporal
    const tempPasswordHash = await bcrypt.hash(tempPassword, 10);
    admin.password_hash = tempPasswordHash;
    admin.last_login = new Date().toISOString();
    writeData(ADMINS_FILE, admins);

    // Generar token JWT para admin
    const token = jwt.sign(
      { adminId: admin.id, email: admin.email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { token, admin };
  } catch (error) {
    console.error('Error en adminLoginWithTempPassword:', error);
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
export async function createAdmin(email: string, password: string, recoveryEmail?: string): Promise<Admin | null> {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const admins = readData<Admin[]>(ADMINS_FILE, []);
    
    // Verificar si ya existe
    if (admins.find(a => a.email === email)) {
      return null;
    }

    const newAdmin: Admin = {
      id: Math.random().toString(36).substring(2, 15),
      email,
      password_hash: passwordHash,
      recovery_email: recoveryEmail || null,
      created_at: new Date().toISOString(),
      last_login: null
    };

    admins.push(newAdmin);
    writeData(ADMINS_FILE, admins);

    return newAdmin;
  } catch (error) {
    console.error('Error en createAdmin:', error);
    return null;
  }
}

// Cambiar contraseña de administrador
export async function changeAdminPassword(adminId: string, currentPassword: string, newPassword: string): Promise<boolean> {
  try {
    const admins = readData<Admin[]>(ADMINS_FILE, []);
    const adminIndex = admins.findIndex(a => a.id === adminId);
    
    if (adminIndex === -1) {
      return false;
    }

    // Verificar contraseña actual
    const isValid = await bcrypt.compare(currentPassword, admins[adminIndex].password_hash);
    if (!isValid) {
      return false;
    }

    // Actualizar contraseña
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    admins[adminIndex].password_hash = newPasswordHash;
    writeData(ADMINS_FILE, admins);

    return true;
  } catch (error) {
    console.error('Error en changeAdminPassword:', error);
    return false;
  }
}

// Recuperar contraseña de administrador (generar nueva temporal y enviar por correo)
export async function recoverAdminPassword(email: string): Promise<{ tempPassword: string; expiresAt: Date; emailSent: boolean } | null> {
  try {
    const admins = readData<Admin[]>(ADMINS_FILE, []);
    const admin = admins.find(a => a.email === email);
    
    if (!admin) {
      return null;
    }

    // Generar contraseña temporal
    const tempPassword = generateTempPassword();
    const tempPasswordHash = await bcrypt.hash(tempPassword, 10);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hora de validez

    // Guardar contraseña temporal en el archivo de contraseñas temporales
    const tempPasswords = readData<TempPassword[]>(TEMP_PASSWORDS_FILE, []);
    
    const newTempPassword: TempPassword = {
      id: Math.random().toString(36).substring(2, 15),
      password_hash: tempPasswordHash,
      user_id: admin.id, // Usar el ID del admin como user_id
      expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString(),
      used: false
    };

    tempPasswords.push(newTempPassword);
    writeData(TEMP_PASSWORDS_FILE, tempPasswords);

    // Enviar correo con la contraseña temporal
    const emailSent = await sendPasswordRecoveryEmail(email, tempPassword, expiresAt);

    return { tempPassword, expiresAt, emailSent };
  } catch (error) {
    console.error('Error en recoverAdminPassword:', error);
    return null;
  }
}

// Obtener información del administrador actual
export async function getAdminInfo(adminId: string): Promise<Admin | null> {
  try {
    const admins = readData<Admin[]>(ADMINS_FILE, []);
    return admins.find(a => a.id === adminId) || null;
  } catch (error) {
    console.error('Error en getAdminInfo:', error);
    return null;
  }
}

// Actualizar email de recuperación
export async function updateAdminRecoveryEmail(adminId: string, recoveryEmail: string): Promise<boolean> {
  try {
    const admins = readData<Admin[]>(ADMINS_FILE, []);
    const adminIndex = admins.findIndex(a => a.id === adminId);
    
    if (adminIndex === -1) {
      return false;
    }

    admins[adminIndex].recovery_email = recoveryEmail;
    writeData(ADMINS_FILE, admins);

    return true;
  } catch (error) {
    console.error('Error en updateAdminRecoveryEmail:', error);
    return false;
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
    
    const users = readData<User[]>(USERS_FILE, []);
    
    // Verificar si ya existe
    if (users.find(u => u.username === username)) {
      return null;
    }

    const newUser: User = {
      id: Math.random().toString(36).substring(2, 15),
      username,
      password, // Contraseña en texto plano para mostrar en panel
      password_hash: passwordHash,
      email,
      role: 'student',
      session_expires_at: sessionExpiresAt.toISOString(),
      created_at: new Date().toISOString(),
      last_login: null,
      created_by: createdBy
    };

    users.push(newUser);
    writeData(USERS_FILE, users);

    return newUser;
  } catch (error) {
    console.error('Error en createUser:', error);
    return null;
  }
}

// Obtener todos los usuarios
export async function getAllUsers(): Promise<User[]> {
  try {
    const users = readData<User[]>(USERS_FILE, []);
    return users.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } catch (error) {
    console.error('Error en getAllUsers:', error);
    return [];
  }
}

// Obtener usuario por ID
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const users = readData<User[]>(USERS_FILE, []);
    return users.find(u => u.id === userId) || null;
  } catch (error) {
    console.error('Error en getUserById:', error);
    return null;
  }
}

// Extender tiempo de sesión de usuario
export async function extendUserSession(userId: string, days: number = 7): Promise<User | null> {
  try {
    const users = readData<User[]>(USERS_FILE, []);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return null;
    }

    const sessionExpiresAt = new Date();
    sessionExpiresAt.setDate(sessionExpiresAt.getDate() + days);
    
    users[userIndex].session_expires_at = sessionExpiresAt.toISOString();
    writeData(USERS_FILE, users);

    return users[userIndex];
  } catch (error) {
    console.error('Error en extendUserSession:', error);
    return null;
  }
}

// Restringir permisos de usuario
export async function updateUserRole(userId: string, role: 'student' | 'restricted' | 'banned'): Promise<User | null> {
  try {
    const users = readData<User[]>(USERS_FILE, []);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return null;
    }

    users[userIndex].role = role;
    writeData(USERS_FILE, users);

    return users[userIndex];
  } catch (error) {
    console.error('Error en updateUserRole:', error);
    return null;
  }
}

// Eliminar usuario
export async function deleteUser(userId: string): Promise<boolean> {
  try {
    const users = readData<User[]>(USERS_FILE, []);
    const filteredUsers = users.filter(u => u.id !== userId);
    
    if (filteredUsers.length === users.length) {
      return false; // No se encontró el usuario
    }

    writeData(USERS_FILE, filteredUsers);
    return true;
  } catch (error) {
    console.error('Error en deleteUser:', error);
    return false;
  }
}

// ===== TEMP PASSWORD MANAGEMENT =====

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

// Generar nueva contraseña para usuario (actualiza su contraseña actual)
export async function generateUserPassword(userId: string): Promise<{ password: string } | null> {
  try {
    const password = generateTempPassword();
    const passwordHash = await bcrypt.hash(password, 10);
    
    const users = readData<User[]>(USERS_FILE, []);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return null;
    }

    // Actualizar contraseña del usuario directamente
    users[userIndex].password = password; // Contraseña en texto plano para mostrar
    users[userIndex].password_hash = passwordHash; // Hash para autenticación
    writeData(USERS_FILE, users);

    return { password };
  } catch (error) {
    console.error('Error en generateUserPassword:', error);
    return null;
  }
}
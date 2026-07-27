import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

// Interfaces
interface TempPassword {
  id: string;
  passwordHash: string;
  expiresAt: Date;
  createdAt: Date;
  used: boolean;
}

interface User {
  id: string;
  username: string;
  password: string;
  password_hash: string;
  email: string | null;
  role: 'student' | 'restricted' | 'banned';
  session_expires_at: string | null;
  created_at: string;
  last_login: string | null;
  created_by: string | null;
}

// Almacenamiento en memoria para contraseñas temporales
const tempPasswords: Map<string, TempPassword> = new Map();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const PASSWORD_EXPIRY_DAYS = 7;

// Rutas de archivos JSON
const DATA_DIR = path.join(process.cwd(), 'admin-data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

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

// Generar una contraseña temporal fácil de recordar
export function generateTempPassword(): string {
  // Palabras comunes y fáciles de recordar
  const words = [
    'nube', 'sol', 'luna', 'mar', 'rio', 'monte', 'flor', 'arbol',
    'azul', 'rojo', 'verde', 'negro', 'blanco', 'dorado', 'plata',
    'estrella', 'fuego', 'tierra', 'aire', 'luz', 'sombra',
    'tigr3', 'leon', 'lobo', 'aguila', 'delfin', 'ballena',
    'gato', 'perro', 'caballo', 'pajaro', 'mariposa',
    'futbol', 'basket', 'tenis', 'golf', 'natacion',
    'libro', 'lapiz', 'papel', 'mesa', 'silla', 'casa',
    'camino', 'puente', 'parque', 'ciudad', 'campo',
    'musica', 'danza', 'arte', 'pintura', 'foto',
    'cafe', 'te', 'leche', 'pan', 'queso', 'fruta',
    'manzana', 'naranja', 'limon', 'uva', 'mango',
    'ocean0', 'cielo', 'playa', 'arena', 'montana',
    'corazon', 'mente', 'alma', 'vida', 'sueño'
  ];
  
  // Seleccionar 2 palabras aleatorias
  const word1 = words[Math.floor(Math.random() * words.length)];
  const word2 = words[Math.floor(Math.random() * words.length)];
  
  // Agregar un número aleatorio de 2 dígitos
  const number = Math.floor(Math.random() * 90) + 10;
  
  // Formar contraseña: palabra1 + palabra2 + número
  return `${word1}${word2}${number}`;
}

// Crear y almacenar una contraseña temporal
export async function createTempPassword(): Promise<{ id: string; password: string; expiresAt: Date }> {
  const password = generateTempPassword();
  const passwordHash = await bcrypt.hash(password, 10);
  const id = Math.random().toString(36).substring(2, 15);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + PASSWORD_EXPIRY_DAYS);

  const tempPassword: TempPassword = {
    id,
    passwordHash,
    expiresAt,
    createdAt: new Date(),
    used: false
  };

  tempPasswords.set(id, tempPassword);
  
  // Limpiar contraseñas expiradas
  cleanExpiredPasswords();

  return { id, password, expiresAt };
}

// Verificar una contraseña temporal
export async function verifyTempPassword(password: string): Promise<string | null> {
  cleanExpiredPasswords();

  // Primero intentar contraseñas temporales independientes
  for (const [id, tempPassword] of tempPasswords.entries()) {
    if (tempPassword.used || tempPassword.expiresAt < new Date()) {
      continue;
    }

    const isValid = await bcrypt.compare(password, tempPassword.passwordHash);
    if (isValid) {
      // Marcar como usada
      tempPassword.used = true;
      tempPasswords.set(id, tempPassword);
      
      // Generar token JWT
      const token = jwt.sign(
        { passwordId: id, createdAt: new Date() },
        JWT_SECRET,
        { expiresIn: `${PASSWORD_EXPIRY_DAYS}d` }
      );
      
      return token;
    }
  }

  // Verificar contra usuarios creados
  const users = readData<User[]>(USERS_FILE, []);
  const now = new Date();

  for (const user of users) {
    // Verificar que el usuario esté activo y su sesión no haya expirado
    if (user.role === 'banned') continue;
    
    if (user.session_expires_at && new Date(user.session_expires_at) < now) {
      continue;
    }

    // Verificar contra la contraseña actual del usuario
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (isValid) {
      // Actualizar last_login
      user.last_login = new Date().toISOString();
      
      // Guardar usuarios actualizados
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = user;
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
      }
      
      // Generar token JWT con información del usuario
      const token = jwt.sign(
        { 
          userId: user.id, 
          username: user.username, 
          role: user.role,
          createdAt: new Date()
        },
        JWT_SECRET,
        { expiresIn: `${PASSWORD_EXPIRY_DAYS}d` }
      );
      
      return token;
    }
  }

  // Verificar contra administrador (para que el admin pueda usar su contraseña normal en login normal)
  try {
    const admins = readData<any[]>(path.join(DATA_DIR, 'admins.json'), []);
    const admin = admins.find(a => a.email === 'admin@dbmaster.studio');
    
    if (admin) {
      const isValid = await bcrypt.compare(password, admin.password_hash);
      if (isValid) {
        // Actualizar last_login
        admin.last_login = new Date().toISOString();
        const adminIndex = admins.findIndex(a => a.id === admin.id);
        if (adminIndex !== -1) {
          admins[adminIndex] = admin;
          fs.writeFileSync(path.join(DATA_DIR, 'admins.json'), JSON.stringify(admins, null, 2), 'utf-8');
        }
        
        // Generar token JWT especial para admin que usa login normal, pero SIN isAdmin: true
        // para que no sea redirigido al panel de administración
        const token = jwt.sign(
          { 
            adminId: admin.id, 
            email: admin.email, 
            role: 'admin',
            isAdmin: false, // No marcar como admin para permitir acceso normal
            isUsingNormalLogin: true, // Marcar que está usando login normal
            createdAt: new Date()
          },
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        return token;
      }
    }
  } catch (error) {
    console.error('Error al verificar admin en login normal:', error);
  }

  return null;
}

// Verificar token JWT
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Limpiar contraseñas expiradas
function cleanExpiredPasswords(): void {
  const now = new Date();
  for (const [id, tempPassword] of tempPasswords.entries()) {
    if (tempPassword.expiresAt < now || tempPassword.used) {
      tempPasswords.delete(id);
    }
  }
}

// Obtener lista de contraseñas activas (para admin)
export function getActivePasswords(): Array<{ id: string; expiresAt: Date; createdAt: Date; used: boolean }> {
  cleanExpiredPasswords();
  return Array.from(tempPasswords.values()).map(p => ({
    id: p.id,
    expiresAt: p.expiresAt,
    createdAt: p.createdAt,
    used: p.used
  }));
}

// Eliminar una contraseña específica
export function deletePassword(id: string): boolean {
  return tempPasswords.delete(id);
}
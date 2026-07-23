import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Interfaces
interface TempPassword {
  id: string;
  passwordHash: string;
  expiresAt: Date;
  createdAt: Date;
  used: boolean;
}

// Almacenamiento en memoria (en producción usar base de datos)
const tempPasswords: Map<string, TempPassword> = new Map();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const PASSWORD_EXPIRY_DAYS = 7;

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
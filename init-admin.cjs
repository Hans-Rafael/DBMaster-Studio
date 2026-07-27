const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'admin-data');
const ADMINS_FILE = path.join(DATA_DIR, 'admins.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Asegurar que el directorio exista
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Credenciales por defecto
const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@dbmaster.studio';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin2024Secure';
const DEFAULT_RECOVERY_EMAIL = process.env.RECOVERY_EMAIL || 'hansvekoni@gmail.com';

function initializeAdmin() {
  console.log('🔧 Inicializando administrador...');
  
  let admins = [];
  if (fs.existsSync(ADMINS_FILE)) {
    try {
      admins = JSON.parse(fs.readFileSync(ADMINS_FILE, 'utf-8'));
    } catch (error) {
      console.log('⚠️  Error al leer archivo de admins, creando nuevo...');
    }
  }
  
  // Verificar si ya existe el administrador
  const existingAdmin = admins.find(a => a.email === DEFAULT_ADMIN_EMAIL);
  
  if (existingAdmin) {
    console.log('✅ Administrador ya existe:', DEFAULT_ADMIN_EMAIL);
    return;
  }
  
  // Crear nuevo administrador
  bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10, (err, hash) => {
    if (err) {
      console.error('❌ Error al crear hash:', err);
      return;
    }
    
    const newAdmin = {
      id: Math.random().toString(36).substring(2, 15),
      email: DEFAULT_ADMIN_EMAIL,
      password_hash: hash,
      recovery_email: DEFAULT_RECOVERY_EMAIL,
      created_at: new Date().toISOString(),
      last_login: null
    };
    
    admins.push(newAdmin);
    fs.writeFileSync(ADMINS_FILE, JSON.stringify(admins, null, 2), 'utf-8');
    
    console.log('✅ Administrador creado exitosamente!');
    console.log('📧 Email:', DEFAULT_ADMIN_EMAIL);
    console.log('🔐 Contraseña:', DEFAULT_ADMIN_PASSWORD);
    console.log('📧 Recuperación:', DEFAULT_RECOVERY_EMAIL);
  });
}

function initializeUsers() {
  console.log('🔧 Inicializando usuarios...');
  
  if (!fs.existsSync(USERS_FILE)) {
    // Crear archivo vacío
    fs.writeFileSync(USERS_FILE, '[]', 'utf-8');
    console.log('✅ Archivo de usuarios creado');
  } else {
    console.log('✅ Archivo de usuarios ya existe');
  }
}

// Ejecutar inicialización
initializeAdmin();
initializeUsers();

console.log('🚀 Sistema inicializado correctamente');
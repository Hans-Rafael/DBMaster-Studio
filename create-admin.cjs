// Script para crear el primer administrador (sistema de archivos JSON)
// Uso: node create-admin.cjs <email> <password>

const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'admin-data');
const ADMINS_FILE = path.join(DATA_DIR, 'admins.json');

const email = process.argv[2];
const password = process.argv[3];
const recoveryEmail = process.argv[4];

if (!email || !password) {
  console.error('❌ Error: Debes proporcionar email y contraseña');
  console.log('Uso: node create-admin.cjs <email> <password> [recovery-email]');
  console.log('Ejemplo: node create-admin.cjs admin@dbmaster.studio miContraseñaSegura123 tu-email@ejemplo.com');
  process.exit(1);
}

async function createAdmin() {
  try {
    console.log('🔐 Creando administrador...');
    
    // Asegurar que el directorio exista
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    
    // Leer administradores existentes
    let admins = [];
    if (fs.existsSync(ADMINS_FILE)) {
      const data = fs.readFileSync(ADMINS_FILE, 'utf-8');
      admins = JSON.parse(data);
    }
    
    // Verificar si ya existe
    if (admins.find(a => a.email === email)) {
      console.error('❌ Error: Ya existe un administrador con ese email');
      process.exit(1);
    }
    
    // Generar hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Crear nuevo administrador
    const newAdmin = {
      id: Math.random().toString(36).substring(2, 15),
      email,
      password_hash: passwordHash,
      recovery_email: recoveryEmail || null,
      created_at: new Date().toISOString(),
      last_login: null
    };
    
    admins.push(newAdmin);
    
    // Guardar en archivo
    fs.writeFileSync(ADMINS_FILE, JSON.stringify(admins, null, 2), 'utf-8');
    
    console.log('✅ Administrador creado exitosamente!');
    console.log('📧 Email:', newAdmin.email);
    console.log('🆔 ID:', newAdmin.id);
    console.log('📅 Creado:', newAdmin.created_at);
    console.log('\n🌐 Ahora puedes usar estas credenciales para acceder al panel de administración web.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
const bcrypt = require('bcryptjs');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Configura SUPABASE_URL y SUPABASE_SERVICE_KEY en .env');
  process.exit(1);
}

const email = process.argv[2];
const password = process.argv[3];
const recoveryEmail = process.argv[4];

if (!email || !password) {
  console.error('❌ Error: Debes proporcionar email y contraseña');
  console.log('Uso: node create-admin-supabase.cjs <email> <password> [recovery-email]');
  console.log('Ejemplo: node create-admin-supabase.cjs admin@dbmaster.studio Admin2024Secure tu-email@ejemplo.com');
  process.exit(1);
}

async function createAdmin() {
  try {
    console.log('🔐 Creando administrador en Supabase...');
    
    // Generar hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Usar REST API de Supabase directamente
    const response = await fetch(`${supabaseUrl}/rest/v1/admins`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        email,
        password_hash: passwordHash
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Error al crear administrador:', error);
      process.exit(1);
    }

    const admin = (await response.json())[0];

    console.log('✅ Administrador creado exitosamente en Supabase!');
    console.log('📧 Email:', admin.email);
    console.log('🆔 ID:', admin.id);
    console.log('📅 Creado:', admin.created_at);
    console.log('🌐 Ahora puedes usar estas credenciales para acceder al panel de administración web.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
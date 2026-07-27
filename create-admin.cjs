// Script para crear el primer administrador en Supabase
// Uso: node create-admin.cjs <email> <password>

const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL y SUPABASE_SERVICE_KEY deben estar configurados en .env');
  process.exit(1);
}

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('❌ Error: Debes proporcionar email y contraseña');
  console.log('Uso: node create-admin.cjs <email> <password>');
  console.log('Ejemplo: node create-admin.cjs admin@dbmaster.studio miContraseñaSegura123');
  process.exit(1);
}

async function createAdmin() {
  try {
    console.log('🔐 Creando administrador...');
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Generar hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Insertar administrador
    const { data, error } = await supabase
      .from('admins')
      .insert([{ 
        email, 
        password_hash: passwordHash 
      }])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error al crear administrador:', error.message);
      process.exit(1);
    }
    
    console.log('✅ Administrador creado exitosamente!');
    console.log('📧 Email:', data.email);
    console.log('🆔 ID:', data.id);
    console.log('📅 Creado:', data.created_at);
    console.log('\n🌐 Ahora puedes usar estas credenciales para acceder al panel de administración web.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
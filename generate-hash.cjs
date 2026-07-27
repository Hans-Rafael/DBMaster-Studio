// Script simplificado para generar hash de contraseña
// Uso: node generate-hash.cjs <password>

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('❌ Error: Debes proporcionar una contraseña');
  console.log('Uso: node generate-hash.cjs <password>');
  console.log('Ejemplo: node generate-hash.cjs admin123');
  process.exit(1);
}

async function generateHash() {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    console.log('✅ Hash generado exitosamente!');
    console.log('📝 Hash:', passwordHash);
    console.log('\n📋 Copia este hash y úsalo en el SQL INSERT:');
    console.log(`INSERT INTO admins (email, password_hash) VALUES ('tu-email', '${passwordHash}');`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

generateHash();
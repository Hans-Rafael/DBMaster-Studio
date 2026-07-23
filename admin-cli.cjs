#!/usr/bin/env node

/**
 * Script de administración para DBMaster Studio
 * Uso: node admin-cli.js [comando] [opciones]
 * 
 * Comandos:
 *   generate - Generar una nueva contraseña temporal
 *   list     - Listar todas las contraseñas activas
 *   delete   - Eliminar una contraseña específica
 *   help     - Mostrar ayuda
 */

const https = require('https');

// Configuración
const SERVER_URL = 'https://dbmaster-studio.onrender.com';
const ADMIN_KEY = '852654';

// Colores para terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, SERVER_URL);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Key': ADMIN_KEY,
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(data);
          } else {
            reject(new Error(`Error ${res.statusCode}: ${data.error || body}`));
          }
        } catch (e) {
          reject(new Error(`Error parsing response: ${body}`));
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function generatePassword() {
  try {
    log('🔐 Generando nueva contraseña temporal...', 'cyan');
    const result = await makeRequest('POST', '/api/admin/passwords', {});
    
    log('✅ Contraseña generada exitosamente!', 'green');
    log('');
    log('📝 CONTRASEÑA:', 'yellow');
    log(`   ${result.password}`, 'green');
    log('');
    log('🆔 ID:', 'cyan');
    log(`   ${result.id}`);
    log('');
    log('⏰ Expira:', 'cyan');
    log(`   ${new Date(result.expiresAt).toLocaleString('es-ES')}`);
    log('');
    log('⏳ Duración: 7 días', 'cyan');
    log('');
    log('🌐 URL:', 'cyan');
    log(`   ${SERVER_URL}`);
    log('');
    log('💡 Esta contraseña es de un solo uso.', 'yellow');
    
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

async function listPasswords() {
  try {
    log('📋 Obteniendo contraseñas activas...', 'cyan');
    const result = await makeRequest('GET', '/api/admin/passwords');
    
    if (!result.passwords || result.passwords.length === 0) {
      log('📭 No hay contraseñas activas.', 'yellow');
      return;
    }
    
    log(`✅ ${result.passwords.length} contraseña(s) activa(s):`, 'green');
    log('');
    
    result.passwords.forEach((pwd, index) => {
      log(`${index + 1}. Contraseña: ${pwd.password}`, 'green');
      log(`   ID: ${pwd.id}`);
      log(`   Expira: ${new Date(pwd.expiresAt).toLocaleString('es-ES')}`);
      log(`   Creada: ${new Date(pwd.createdAt).toLocaleString('es-ES')}`);
      log('');
    });
    
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

async function deletePassword(passwordId) {
  if (!passwordId) {
    log('❌ Error: Debes proporcionar el ID de la contraseña a eliminar.', 'red');
    log('   Uso: node admin-cli.js delete [id]', 'yellow');
    process.exit(1);
  }
  
  try {
    log(`🗑️  Eliminando contraseña ${passwordId}...`, 'cyan');
    await makeRequest('DELETE', `/api/admin/passwords/${passwordId}`);
    log('✅ Contraseña eliminada exitosamente!', 'green');
    
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

function showHelp() {
  log('🔧 DBMaster Studio - Herramienta de Administración', 'cyan');
  log('');
  log('Uso con npm:', 'yellow');
  log('  npm run admin:generate    Generar una nueva contraseña temporal', 'green');
  log('  npm run admin:list        Listar todas las contraseñas activas', 'green');
  log('  npm run admin:delete [id] Eliminar una contraseña específica', 'green');
  log('  npm run admin:help        Mostrar esta ayuda', 'green');
  log('');
  log('Uso directo:', 'yellow');
  log('  node admin-cli.cjs generate', 'green');
  log('  node admin-cli.cjs list', 'green');
  log('  node admin-cli.cjs delete [id]', 'green');
  log('  node admin-cli.cjs help', 'green');
  log('');
  log('Configuración:', 'cyan');
  log(`  Servidor: ${SERVER_URL}`, 'yellow');
  log(`  Admin Key: ${ADMIN_KEY}`, 'yellow');
}

// Main
const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
  case 'generate':
    generatePassword();
    break;
  case 'list':
    listPasswords();
    break;
  case 'delete':
    deletePassword(arg);
    break;
  case 'help':
  default:
    showHelp();
    break;
}
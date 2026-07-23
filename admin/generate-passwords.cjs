#!/usr/bin/env node

/**
 * Script de administrador para generar contraseñas temporales
 * Uso: node admin/generate-passwords.cjs [comando] [admin-key]
 * 
 * Comandos:
 *   generate [admin-key] - Genera una nueva contraseña temporal
 *   list [admin-key]    - Lista todas las contraseñas activas
 *   delete [admin-key] [id] - Elimina una contraseña específica
 */

const http = require('http');

const SERVER_URL = 'http://localhost:3000';
const ADMIN_KEY = process.env.ADMIN_KEY || 'admin-secret-key-change-in-production';

function makeRequest(method, path, data = null, adminKey = ADMIN_KEY) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, SERVER_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || 3000,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Key': adminKey
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve(body);
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

async function main() {
  const command = process.argv[2];
  const adminKey = process.argv[3] || ADMIN_KEY;
  const passwordId = process.argv[4];

  try {
    switch (command) {
      case 'generate':
        const result = await makeRequest('POST', '/api/admin/passwords', null, adminKey);
        console.log('✅ Contraseña temporal generada exitosamente:');
        console.log(`📝 Contraseña: ${result.password}`);
        console.log(`🆔 ID: ${result.id}`);
        console.log(`⏰ Expira: ${new Date(result.expiresAt).toLocaleString()}`);
        console.log(`⏳ Duración: 7 días`);
        break;

      case 'list':
        const passwords = await makeRequest('GET', '/api/admin/passwords', null, adminKey);
        console.log('📋 Contraseñas activas:');
        if (passwords.length === 0) {
          console.log('   No hay contraseñas activas');
        } else {
          passwords.forEach(p => {
            console.log(`   🆔 ${p.id}`);
            console.log(`   ⏰ Expira: ${new Date(p.expiresAt).toLocaleString()}`);
            console.log(`   📅 Creada: ${new Date(p.createdAt).toLocaleString()}`);
            console.log(`   ✅ Usada: ${p.used ? 'Sí' : 'No'}`);
            console.log('   ---');
          });
        }
        break;

      case 'delete':
        if (!passwordId) {
          console.error('❌ Error: Se requiere el ID de la contraseña a eliminar');
          console.log('Uso: node admin/generate-passwords.js delete [admin-key] [password-id]');
          process.exit(1);
        }
        const deleteResult = await makeRequest('DELETE', `/api/admin/passwords/${passwordId}`, null, adminKey);
        if (deleteResult.success) {
          console.log('✅ Contraseña eliminada exitosamente');
        } else {
          console.log('❌ No se pudo eliminar la contraseña');
        }
        break;

      default:
        console.log('🔐 DBMaster Studio - Generador de Contraseñas Temporales');
        console.log('');
        console.log('Uso:');
        console.log('  node admin/generate-passwords.js generate [admin-key]');
        console.log('  node admin/generate-passwords.js list [admin-key]');
        console.log('  node admin/generate-passwords.js delete [admin-key] [password-id]');
        console.log('');
        console.log('Ejemplos:');
        console.log('  node admin/generate-passwords.js generate');
        console.log('  node admin/generate-passwords.js list');
        console.log('  node admin/generate-passwords.js delete abc123');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
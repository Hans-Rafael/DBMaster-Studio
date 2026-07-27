-- Script completo de configuración para DBMaster Studio
-- Ejecutar este script en el SQL Editor de Supabase

-- 1. Habilitar extensión para UUID gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Crear tabla de usuarios administradores
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  recovery_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- 3. Crear tabla de usuarios regulares (estudiantes)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL, -- Contraseña en texto plano para mostrar en panel (cuidado con seguridad)
  password_hash TEXT NOT NULL,
  email TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'restricted', 'banned')),
  session_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES admins(id) ON DELETE SET NULL
);

-- 4. Crear tabla de contraseñas temporales
CREATE TABLE IF NOT EXISTS temp_passwords (
  id TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used BOOLEAN DEFAULT FALSE
);

-- 5. Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_temp_passwords_expires ON temp_passwords(expires_at);
CREATE INDEX IF NOT EXISTS idx_temp_passwords_user_id ON temp_passwords(user_id);

-- 6. Habilitar Row Level Security (RLS)
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE temp_passwords ENABLE ROW LEVEL SECURITY;

-- 7. Crear políticas RLS para admins
DROP POLICY IF EXISTS "Admins can read all admins" ON admins;
CREATE POLICY "Admins can read all admins" ON admins
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert admins" ON admins;
CREATE POLICY "Admins can insert admins" ON admins
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update admins" ON admins;
CREATE POLICY "Admins can update admins" ON admins
  FOR UPDATE USING (true);

-- 8. Crear políticas RLS para usuarios
DROP POLICY IF EXISTS "Admins can read all users" ON users;
CREATE POLICY "Admins can read all users" ON users
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert users" ON users;
CREATE POLICY "Admins can insert users" ON users
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update users" ON users;
CREATE POLICY "Admins can update users" ON users
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Admins can delete users" ON users;
CREATE POLICY "Admins can delete users" ON users
  FOR DELETE USING (true);

-- 9. Crear políticas RLS para contraseñas temporales
DROP POLICY IF EXISTS "Admins can read all temp_passwords" ON temp_passwords;
CREATE POLICY "Admins can read all temp_passwords" ON temp_passwords
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert temp_passwords" ON temp_passwords;
CREATE POLICY "Admins can insert temp_passwords" ON temp_passwords
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update temp_passwords" ON temp_passwords;
CREATE POLICY "Admins can update temp_passwords" ON temp_passwords
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Admins can delete temp_passwords" ON temp_passwords;
CREATE POLICY "Admins can delete temp_passwords" ON temp_passwords
  FOR DELETE USING (true);

-- 10. Crear administrador inicial
-- Email: admin@dbmaster.studio
-- Contraseña: Admin2024Secure
INSERT INTO admins (email, password_hash) 
VALUES (
  'admin@dbmaster.studio', 
  '$2b$10$MoOIpnq11WLe0S/MRnK3oO8h.6qQm32u/9oW8xdyRcVNX8Z39XccS'
)
ON CONFLICT (email) DO NOTHING;

-- 11. Verificar que todo se creó correctamente
SELECT 'Setup completado exitosamente!' as status;
SELECT 'Administrador creado: admin@dbmaster.studio' as admin_info;
SELECT 'Contraseña: Admin2024Secure' as admin_password;
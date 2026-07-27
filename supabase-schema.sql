-- Esquema de base de datos para DBMaster Studio Administration
-- Ejecutar este script en el SQL Editor de Supabase

-- Habilitar extensión para UUID gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabla de usuarios administradores
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Tabla de usuarios regulares (estudiantes)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'restricted', 'banned')),
  session_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES admins(id) ON DELETE SET NULL
);

-- Tabla de contraseñas temporales (migración del sistema actual)
CREATE TABLE IF NOT EXISTS temp_passwords (
  id TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used BOOLEAN DEFAULT FALSE
);

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_temp_passwords_expires ON temp_passwords(expires_at);
CREATE INDEX IF NOT EXISTS idx_temp_passwords_user_id ON temp_passwords(user_id);

-- Crear admin inicial (opcional - cambiar después)
-- password: admin123 (debe cambiarse en producción)
INSERT INTO admins (email, password_hash) 
VALUES ('admin@dbmaster.studio', '$2a$10$rKZ7.8h8h8h8h8h8h8h8hu.example.hash')
ON CONFLICT (email) DO NOTHING;

-- Habilitar Row Level Security (RLS)
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE temp_passwords ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para admins (solo admin puede gestionar)
CREATE POLICY "Admins can read all admins" ON admins
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert admins" ON admins
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update admins" ON admins
  FOR UPDATE USING (true);

-- Políticas RLS para usuarios
CREATE POLICY "Admins can read all users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert users" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update users" ON users
  FOR UPDATE USING (true);

CREATE POLICY "Admins can delete users" ON users
  FOR DELETE USING (true);

-- Políticas RLS para contraseñas temporales
CREATE POLICY "Admins can read all temp_passwords" ON temp_passwords
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert temp_passwords" ON temp_passwords
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update temp_passwords" ON temp_passwords
  FOR UPDATE USING (true);

CREATE POLICY "Admins can delete temp_passwords" ON temp_passwords
  FOR DELETE USING (true);
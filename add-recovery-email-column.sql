-- Agregar columna recovery_email a la tabla admins
ALTER TABLE admins ADD COLUMN IF NOT EXISTS recovery_email TEXT;
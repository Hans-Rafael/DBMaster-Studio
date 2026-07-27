import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface EmailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
}

function getEmailConfig(): EmailConfig | null {
  const host = process.env.EMAIL_HOST;
  const port = parseInt(process.env.EMAIL_PORT || '587');
  const user = process.env.EMAIL_USER;
  const password = process.env.EMAIL_PASSWORD;
  const from = process.env.EMAIL_FROM || 'DBMaster Studio <noreply@dbmaster.studio>';

  if (!host || !user || !password) {
    console.warn('⚠️  Configuración de correo incompleta. Correo no será enviado.');
    return null;
  }

  return { host, port, user, password, from };
}

// Crear transporter una sola vez y reutilizarlo (best practice)
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  const config = getEmailConfig();
  if (!config) return null;

  // Si ya existe un transporter, reutilizarlo
  if (transporter) return transporter;

  // Crear nuevo transporter con defaults
  transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.user,
      pass: config.password,
    },
    // Defaults para todos los correos
    defaults: {
      from: config.from,
    },
  });

  return transporter;
}

// Verificar conexión al inicio (opcional pero recomendado)
export async function verifyEmailConnection(): Promise<boolean> {
  const transport = getTransporter();
  if (!transport) return false;

  try {
    await transport.verify();
    console.log('✅ Servidor de correo verificado y listo');
    return true;
  } catch (err) {
    console.error('❌ Error al verificar conexión SMTP:', err);
    return false;
  }
}

export async function sendPasswordRecoveryEmail(
  toEmail: string,
  tempPassword: string,
  expiresAt: Date
): Promise<boolean> {
  const config = getEmailConfig();
  if (!config) {
    console.log('⚠️  Correo no configurado, retornando contraseña temporal:', tempPassword);
    return false;
  }

  const transport = getTransporter();
  if (!transport) return false;

  try {
    const info = await transport.sendMail({
      to: toEmail,
      subject: 'Recuperación de Contraseña - DBMaster Studio',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🔐 DBMaster Studio</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Recuperación de Contraseña</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Hemos recibido una solicitud para recuperar tu contraseña de administrador.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border: 2px solid #667eea; margin: 20px 0;">
              <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">Tu contraseña temporal es:</p>
              <p style="color: #667eea; font-size: 24px; font-weight: bold; margin: 0; text-align: center; letter-spacing: 2px;">
                ${tempPassword}
              </p>
            </div>
            
            <p style="color: #666; font-size: 14px; margin: 20px 0 10px 0;">
              ⏰ Esta contraseña expira: <strong>${expiresAt.toLocaleString('es-ES')}</strong>
            </p>
            
            <p style="color: #666; font-size: 14px; margin: 10px 0;">
              ⚠️ Por seguridad, cambia tu contraseña después de iniciar sesión.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                Si no solicitaste esta recuperación, ignora este correo.
              </p>
              <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">
                © 2024 DBMaster Studio. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
        Recuperación de Contraseña - DBMaster Studio
        
        Hemos recibido una solicitud para recuperar tu contraseña de administrador.
        
        Tu contraseña temporal es: ${tempPassword}
        
        Esta contraseña expira: ${expiresAt.toLocaleString('es-ES')}
        
        Por seguridad, cambia tu contraseña después de iniciar sesión.
        
        Si no solicitaste esta recuperación, ignora este correo.
        
        © 2024 DBMaster Studio. Todos los derechos reservados.
      `,
    });

    console.log('✅ Correo enviado:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar correo:', error);
    return false;
  }
}

export async function sendUserCreationEmail(
  toEmail: string,
  username: string,
  password: string,
  expiresAt: Date
): Promise<boolean> {
  const config = getEmailConfig();
  if (!config) {
    console.log('⚠️  Correo no configurado, no se enviará correo de creación de usuario');
    return false;
  }

  const transport = getTransporter();
  if (!transport) return false;

  try {
    const info = await transport.sendMail({
      to: toEmail,
      subject: 'Cuenta Creada - DBMaster Studio',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🎉 DBMaster Studio</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Cuenta Creada Exitosamente</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Se ha creado una cuenta para ti en DBMaster Studio.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border: 2px solid #667eea; margin: 20px 0;">
              <p style="color: #666; margin: 0 0 5px 0; font-size: 14px;">Usuario:</p>
              <p style="color: #333; font-size: 18px; font-weight: bold; margin: 0 0 15px 0;">${username}</p>
              
              <p style="color: #666; margin: 0 0 5px 0; font-size: 14px;">Contraseña:</p>
              <p style="color: #667eea; font-size: 24px; font-weight: bold; margin: 0; text-align: center; letter-spacing: 2px;">
                ${password}
              </p>
            </div>
            
            <p style="color: #666; font-size: 14px; margin: 20px 0 10px 0;">
              ⏰ Esta contraseña expira: <strong>${expiresAt.toLocaleString('es-ES')}</strong>
            </p>
            
            <p style="color: #666; font-size: 14px; margin: 10px 0;">
              Para comenzar, inicia sesión con estas credenciales.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                © 2024 DBMaster Studio. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
        Cuenta Creada - DBMaster Studio
        
        Se ha creado una cuenta para ti en DBMaster Studio.
        
        Usuario: ${username}
        Contraseña: ${password}
        
        Esta contraseña expira: ${expiresAt.toLocaleString('es-ES')}
        
        Para comenzar, inicia sesión con estas credenciales.
        
        © 2024 DBMaster Studio. Todos los derechos reservados.
      `,
    });

    console.log('✅ Correo de creación enviado:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar correo de creación:', error);
    return false;
  }
}
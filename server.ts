import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import cookieParser from "cookie-parser";
import { 
  createTempPassword, 
  verifyTempPassword, 
  verifyToken, 
  getActivePasswords, 
  deletePassword 
} from "./auth";
import {
  adminLogin,
  adminLoginWithTempPassword,
  verifyAdminToken,
  createAdmin,
  createUser,
  getAllUsers,
  getUserById,
  extendUserSession,
  updateUserRole,
  deleteUser,
  generateUserPassword,
  changeAdminPassword,
  recoverAdminPassword,
  getAdminInfo,
  updateAdminRecoveryEmail
} from "./admin-service";
import { verifyEmailConnection } from "./email-service";

dotenv.config();

// Verificar conexión SMTP al inicio (no crítico para el funcionamiento)
verifyEmailConnection().then(success => {
  if (success) {
    console.log('📧 Sistema de correo SMTP configurado y verificado');
  } else {
    console.log('⚠️  Sistema de correo no configurado o con problemas de conectividad');
    console.log('⚠️  El resto del sistema funcionará normalmente sin correo');
  }
}).catch(error => {
  console.log('⚠️  Error al verificar conexión SMTP:', error.message);
  console.log('⚠️  El resto del sistema funcionará normalmente sin correo');
});

// Verificar variables de entorno críticas
console.log('🔧 Verificando variables de entorno...');
console.log('📧 ADMIN_EMAIL:', process.env.ADMIN_EMAIL ? '✅ Configurado' : '❌ No configurado');
console.log('🔐 ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD ? '✅ Configurado' : '❌ No configurado');
console.log('🔑 JWT_SECRET:', process.env.JWT_SECRET ? '✅ Configurado' : '❌ No configurado');
console.log('🔧 NODE_ENV:', process.env.NODE_ENV || 'development');

const app = express();
const PORT = 3000;
const ADMIN_KEY = process.env.ADMIN_KEY || 'admin-secret-key-change-in-production';

app.use(express.json());
app.use(cookieParser());

// Middleware de autenticación
const requireAuth = (req: any, res: any, next: any) => {
  const token = req.cookies.auth_token;
  
  if (!token) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }

  req.user = decoded;
  next();
};

// Middleware de autenticación para admin (antiguo, por compatibilidad)
const requireAdmin = (req: any, res: any, next: any) => {
  const adminKey = req.headers['x-admin-key'];
  
  if (adminKey !== ADMIN_KEY) {
    return res.status(403).json({ error: 'No autorizado como admin' });
  }

  next();
};

// Middleware de autenticación para admin (nuevo, con JWT)
const requireAdminAuth = (req: any, res: any, next: any) => {
  const token = req.cookies.admin_token || req.headers['authorization']?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No autorizado - Token requerido' });
  }

  const decoded = verifyAdminToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }

  req.admin = decoded;
  next();
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    adminConfigured: !!process.env.ADMIN_EMAIL && !!process.env.ADMIN_PASSWORD,
    jwtConfigured: !!process.env.JWT_SECRET,
    emailConfigured: !!process.env.EMAIL_USER && !!process.env.EMAIL_PASSWORD
  };
  res.json(health);
});

// Rutas de autenticación
app.post('/api/auth/login', async (req, res) => {
  try {
    const { password } = req.body;
    
    console.log('🔍 Login normal recibido:', password ? '***' : 'vacía');
    
    if (!password) {
      return res.status(400).json({ error: 'Se requiere contraseña' });
    }

    const token = await verifyTempPassword(password);
    
    if (!token) {
      console.log('❌ Login normal falló: contraseña inválida');
      return res.status(401).json({ error: 'Contraseña inválida o expirada' });
    }

    console.log('✅ Login normal exitoso');

    // Verificar si el token pertenece a un administrador
    const decoded = verifyToken(token);
    
    if (decoded && decoded.isAdmin) {
      // Si es administrador, devolver información especial para redirigir al panel
      res.cookie('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
      });
      
      return res.json({ 
        success: true, 
        isAdmin: true,
        message: 'Login exitoso como administrador',
        redirect: '/admin'
      });
    }

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
    });

    res.json({ success: true, message: 'Login exitoso' });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.json({ success: true, message: 'Logout exitoso' });
});

app.get('/api/auth/check', (req, res) => {
  const token = req.cookies.auth_token;
  const decoded = token ? verifyToken(token) : null;
  res.json({ authenticated: !!decoded });
});

// Rutas de admin para gestión de contraseñas
app.post('/api/admin/passwords', requireAdmin, async (req, res) => {
  try {
    const result = await createTempPassword();
    res.json({
      id: result.id,
      password: result.password,
      expiresAt: result.expiresAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al generar contraseña' });
  }
});

app.get('/api/admin/passwords', requireAdmin, (req, res) => {
  res.json(getActivePasswords());
});

app.delete('/api/admin/passwords/:id', requireAdmin, (req, res) => {
  const deleted = deletePassword(req.params.id);
  res.json({ success: deleted });
});

// ===== NUEVAS RUTAS DE ADMINISTRACIÓN WEB =====

// Login de administrador
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    // Intentar login con contraseña normal primero
    let result = await adminLogin(email, password);
    
    // Si falla, intentar con contraseña temporal
    if (!result) {
      result = await adminLoginWithTempPassword(email, password);
    }
    
    if (!result) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    res.cookie('admin_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
    });

    res.json({ 
      success: true, 
      message: 'Login exitoso',
      admin: {
        id: result.admin.id,
        email: result.admin.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Logout de administrador
app.post('/api/admin/logout', (req, res) => {
  res.clearCookie('admin_token');
  res.json({ success: true, message: 'Logout exitoso' });
});

// Verificar autenticación de admin
app.get('/api/admin/check', (req, res) => {
  const token = req.cookies.admin_token || req.headers['authorization']?.replace('Bearer ', '');
  const decoded = token ? verifyAdminToken(token) : null;
  res.json({ authenticated: !!decoded, admin: decoded });
});

// ===== GESTIÓN DE USUARIOS =====

// Crear nuevo usuario
app.post('/api/admin/users', requireAdminAuth, async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username y contraseña requeridos' });
    }

    const user = await createUser(username, password, email, req.admin.adminId);
    
    if (!user) {
      return res.status(500).json({ error: 'Error al crear usuario' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Obtener todos los usuarios
app.get('/api/admin/users', requireAdminAuth, async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Obtener usuario por ID
app.get('/api/admin/users/:id', requireAdminAuth, async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Extender tiempo de sesión de usuario
app.post('/api/admin/users/:id/extend-session', requireAdminAuth, async (req, res) => {
  try {
    const { days } = req.body;
    const daysToAdd = days || 7;
    
    const user = await extendUserSession(req.params.id, daysToAdd);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Actualizar rol de usuario (restringir permisos)
app.put('/api/admin/users/:id/role', requireAdminAuth, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['student', 'restricted', 'banned'].includes(role)) {
      return res.status(400).json({ error: 'Rol inválido' });
    }

    const user = await updateUserRole(req.params.id, role);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Eliminar usuario
app.delete('/api/admin/users/:id', requireAdminAuth, async (req, res) => {
  try {
    const deleted = await deleteUser(req.params.id);
    res.json({ success: deleted });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// ===== GESTIÓN DE CONTRASEÑAS DE USUARIOS =====

// Generar nueva contraseña para usuario
app.post('/api/admin/users/:id/generate-password', requireAdminAuth, async (req, res) => {
  try {
    const result = await generateUserPassword(req.params.id);
    
    if (!result) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ success: true, password: result.password });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// ===== GESTIÓN DE CUENTA DE ADMINISTRADOR =====

// Obtener información del administrador actual
app.get('/api/admin/profile', requireAdminAuth, async (req, res) => {
  try {
    const admin = await getAdminInfo(req.admin.adminId);
    if (!admin) {
      return res.status(404).json({ error: 'Administrador no encontrado' });
    }
    
    // No enviar el hash de la contraseña
    const { password_hash, ...adminSafe } = admin;
    res.json({ admin: adminSafe });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Cambiar contraseña de administrador
app.post('/api/admin/change-password', requireAdminAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Contraseña actual y nueva requeridas' });
    }

    const success = await changeAdminPassword(req.admin.adminId, currentPassword, newPassword);
    
    if (!success) {
      return res.status(400).json({ error: 'Contraseña actual incorrecta' });
    }

    res.json({ success: true, message: 'Contraseña cambiada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Actualizar email de recuperación
app.put('/api/admin/recovery-email', requireAdminAuth, async (req, res) => {
  try {
    const { recoveryEmail } = req.body;
    
    if (!recoveryEmail) {
      return res.status(400).json({ error: 'Email de recuperación requerido' });
    }

    const success = await updateAdminRecoveryEmail(req.admin.adminId, recoveryEmail);
    
    if (!success) {
      return res.status(404).json({ error: 'Administrador no encontrado' });
    }

    res.json({ success: true, message: 'Email de recuperación actualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Recuperar contraseña (público, sin autenticación)
app.post('/api/admin/recover-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email requerido' });
    }

    const result = await recoverAdminPassword(email);
    
    if (!result) {
      return res.status(404).json({ error: 'Email no encontrado' });
    }

    // Si el correo se envió exitosamente, no mostramos la contraseña
    if (result.emailSent) {
      res.json({ 
        success: true, 
        message: 'Contraseña temporal enviada a tu correo electrónico',
        emailSent: true
      });
    } else {
      // Si el correo no se pudo enviar, mostramos la contraseña para desarrollo
      res.json({ 
        success: true, 
        message: 'Contraseña temporal generada (correo no configurado)',
        tempPassword: result.tempPassword,
        expiresAt: result.expiresAt,
        emailSent: false
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Health
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", aiConfigured: !!apiKey });
});

// AI Tutor Chat / Assistant API
app.post("/api/gemini/tutor", requireAuth, async (req, res) => {
  try {
    if (!aiClient) {
      return res.status(500).json({
        error: "GEMINI_API_KEY no está configurada en las variables de entorno."
      });
    }

    const { prompt, context, systemInstruction } = req.body;

    const systemPrompt = systemInstruction || `Eres un tutor experto y pedagógico en Bases de Datos Relacionales (especialmente PostgreSQL), MongoDB y GraphQL.
Responde de forma clara, didáctica y estructurada en español.
Utiliza bloques de código SQL, JavaScript (MongoDB) o GraphQL formateados con explicaciones paso a paso.
Cuando expliques consultas de PostgreSQL, resalta buenas prácticas, diferencias entre DDL/DML, uso de índices, transacciones y PL/pgSQL cuando corresponda.`;

    const contents = context 
      ? `[Contexto de la lección o ejercicio: ${context}]\n\nPregunta del estudiante: ${prompt}`
      : prompt;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error("Error en /api/gemini/tutor:", err);
    res.status(500).json({ error: err.message || "Error al procesar la solicitud con la IA." });
  }
});

// AI Query Explainer API
app.post("/api/gemini/explain-query", requireAuth, async (req, res) => {
  try {
    if (!aiClient) {
      return res.status(500).json({
        error: "GEMINI_API_KEY no está configurada."
      });
    }

    const { query, dbType } = req.body;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Analiza y explica en detalle esta consulta de ${dbType || 'PostgreSQL'}:\n\n\`\`\`sql\n${query}\n\`\`\`\n\nPor favor proporciona:
1. Resumen de lo que hace la consulta.
2. Desglose cláusula por cláusula.
3. Evaluación de rendimiento e índices recomendados.
4. Equivalencia conceptual o consejo práctico.`,
      config: {
        systemInstruction: "Eres un Administrador de Bases de Datos Senior (DBA) y tutor experto en tuning de PostgreSQL, MongoDB y GraphQL.",
      },
    });

    res.json({ explanation: response.text });
  } catch (err: any) {
    console.error("Error en /api/gemini/explain-query:", err);
    res.status(500).json({ error: err.message || "Error al explicar la consulta." });
  }
});

// AI Exercise Evaluator API
app.post("/api/gemini/evaluate", requireAuth, async (req, res) => {
  try {
    if (!aiClient) {
      return res.status(500).json({
        error: "GEMINI_API_KEY no está configurada."
      });
    }

    const { userCode, expectedObjective, dbType } = req.body;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Evalúa la siguiente solución entregada por un estudiante para un ejercicio de ${dbType || 'PostgreSQL'}:

Objetivo del ejercicio: ${expectedObjective}

Código escrito por el estudiante:
\`\`\`
${userCode}
\`\`\`

Proporciona:
1. ¿Es correcta la solución o cumple con el objetivo? (sí / no / parcialmente)
2. Retroalimentación detallada y explicativa.
3. Puntos de mejora o código optimizado sugerido.`,
      config: {
        systemInstruction: "Eres un evaluador técnico paciente y constructivo para cursos de bases de datos.",
      }
    });

    res.json({ evaluation: response.text });
  } catch (err: any) {
    console.error("Error en /api/gemini/evaluate:", err);
    res.status(500).json({ error: err.message || "Error al evaluar el ejercicio." });
  }
});

// Vite / Production Static Handling
async function setupServer() {
  const isProduction = process.env.NODE_ENV === "production";
  const distPath = path.join(process.cwd(), "dist");
  
  console.log('🔧 Configuración del servidor:');
  console.log('📦 Entorno:', isProduction ? 'production' : 'development');
  console.log('📁 Dist path:', distPath);
  console.log('📁 Dist existe:', fs.existsSync(distPath));
  
  if (isProduction && fs.existsSync(distPath)) {
    console.log('🚀 Sirviendo archivos estáticos desde dist/');
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    console.log('🛠️  Usando Vite dev server');
    if (isProduction && !fs.existsSync(distPath)) {
      console.warn('⚠️  NODE_ENV=production pero dist/ no existe, usando Vite dev server');
    }
    
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor DBMaster Studio escuchando en http://0.0.0.0:${PORT}`);
  });
}

setupServer();

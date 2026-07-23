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

dotenv.config();

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

// Middleware de autenticación para admin
const requireAdmin = (req: any, res: any, next: any) => {
  const adminKey = req.headers['x-admin-key'];
  
  if (adminKey !== ADMIN_KEY) {
    return res.status(403).json({ error: 'No autorizado como admin' });
  }

  next();
};

// Rutas de autenticación
app.post('/api/auth/login', async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Se requiere contraseña' });
    }

    const token = await verifyTempPassword(password);
    
    if (!token) {
      return res.status(401).json({ error: 'Contraseña inválida o expirada' });
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
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "src/dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor DBMaster Studio escuchando en http://0.0.0.0:${PORT}`);
  });
}

setupServer();

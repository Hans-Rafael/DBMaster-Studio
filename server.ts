import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

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
app.post("/api/gemini/tutor", async (req, res) => {
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
app.post("/api/gemini/explain-query", async (req, res) => {
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
app.post("/api/gemini/evaluate", async (req, res) => {
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
    const distPath = path.join(process.cwd(), "dist");
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

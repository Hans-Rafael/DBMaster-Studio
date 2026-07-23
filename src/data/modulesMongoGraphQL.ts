import { Module } from '../types/database';

export const MONGO_GRAPHQL_MODULES: Module[] = [
  {
    id: 'm-mongo',
    number: 9,
    engine: 'mongodb',
    title: 'Módulo NoSQL: MongoDB para Desarrolladores SQL',
    shortDescription: 'Documentos BSON, colecciones, consultas find(), pipeline de agregación aggregate(), índices y comparación directa entre SQL y NoSQL.',
    badge: 'NoSQL MongoDB',
    iconName: 'Leaf',
    estimatedMinutes: 45,
    topics: [
      {
        id: 'm-mongo-t1',
        title: '1. Modelado de Documentos BSON vs Tablas Relacionales',
        subtitle: 'De Filas/Tablas a Documentos/Colecciones',
        description: 'Mapeo conceptual entre el mundo relacional (SQL) y el almacenamiento orientado a documentos en MongoDB.',
        summaryPoints: [
          'Tabla -> Colección (Collection).',
          'Fila -> Documento BSON (Binary JSON).',
          'Columna -> Campo (Field).',
          'JOIN -> Documentos Embebidos (Embedded Documents) o $lookup.'
        ],
        theoryMarkdown: `
### Comparativa Directa: PostgreSQL (SQL) vs MongoDB (NoSQL)

| Concepto SQL | Concepto MongoDB |
| :--- | :--- |
| **Base de Datos** | Base de Datos |
| **Tabla** | Colección (*Collection*) |
| **Fila / Registro** | Documento BSON |
| **Columna** | Campo (*Field*) |
| **Clave Primaria (PK)** | Campo \`_id\` (ObjectId) |
| **JOIN** | Documentos Embebidos o \`$lookup\` |
        `,
        codeExamples: [
          {
            title: 'Ejemplo de Documento BSON de Empleado con Departamento Embebido',
            language: 'javascript',
            code: `{
  "_id": ObjectId("65b28a1f8c9d2f0012345678"),
  "nombre": "Carlos",
  "apellido": "Gómez",
  "email": "carlos.gomez@empresa.com",
  "salario": 4500.00,
  "departamento": {
    "nombre": "Tecnología",
    "ubicacion": "Piso 4 - Madrid"
  },
  "habilidades": ["PostgreSQL", "MongoDB", "GraphQL"]
}`,
            explanation: 'Documento autocontenido que elimina la necesidad de realizar un JOIN para consultar la ubicación del departamento.'
          }
        ],
        keyTakeaways: [
          'En MongoDB la regla general es: Datos que se consultan juntos, se almacenan juntos.',
          'BSON soporta tipos de datos avanzados como fechas nativas, enteros de 64 bits y ObjectIds.'
        ]
      },
      {
        id: 'm-mongo-t2',
        title: '2. Consultas con find() y Operadores de Filtro',
        subtitle: 'Consultas equivalentes al SELECT ... WHERE',
        description: 'Sintaxis de búsqueda en MongoDB con db.coleccion.find() y operadores $eq, $gt, $in, $or y $regex.',
        summaryPoints: [
          'db.coleccion.find(filtro, proyeccion) busca documentos.',
          'Operadores de comparación: $gt, $gte, $lt, $lte, $ne, $in.',
          'Operadores lógicos: $and, $or, $nor, $not.',
          'Proyección: { nombre: 1, salario: 1, _id: 0 } selecciona qué campos devolver.'
        ],
        theoryMarkdown: `
### Consultas con find() en MongoDB

Sintaxis básica de consulta:
\`\`\`javascript
db.empleados.find(
  { salario: { $gte: 3000 }, "departamento.nombre": "Tecnología" },
  { nombre: 1, apellido: 1, salario: 1, _id: 0 }
).sort({ salario: -1 }).limit(5)
\`\`\`
        `,
        codeExamples: [
          {
            title: 'Consulta MongoDB con Filtro y Proyección',
            language: 'javascript',
            code: `// Equivalente a: SELECT nombre, salario FROM empleados WHERE salario >= 3000 ORDER BY salario DESC
db.empleados.find(
  { salario: { $gte: 3000 } },
  { nombre: 1, cargo: 1, salario: 1 }
).sort({ salario: -1 });`,
            explanation: 'Filtra empleados con salario mayor o igual a 3000 y ordena los resultados.'
          }
        ],
        keyTakeaways: [
          'sort({ campo: 1 }) ordena de forma ascendente; sort({ campo: -1 }) ordena de forma descendente.',
          'MongoDB permite consultar dentro de subdocumentos usando la notación de puntos ("departamento.nombre").'
        ]
      },
      {
        id: 'm-mongo-t3',
        title: '3. Pipeline de Agregación (aggregate)',
        subtitle: 'Equivalente NoSQL a GROUP BY, JOIN y HAVING',
        description: 'Construcción de pipelines multietapa con $match, $group, $project, $sort y $lookup.',
        summaryPoints: [
          '$match: Filtra documentos (como WHERE).',
          '$group: Agrupa documentos por una clave y calcula métricas ($sum, $avg) (como GROUP BY).',
          '$lookup: Realiza cruces relacionales entre colecciones (como JOIN).',
          '$project: Modifica la forma y campos del documento final.'
        ],
        theoryMarkdown: `
### Framework de Agregación de MongoDB

Un **Pipeline de Agregación** consiste en una serie de etapas donde la salida de cada etapa sirve como entrada para la siguiente.
        `,
        codeExamples: [
          {
            title: 'Pipeline de Agregación por Departamento',
            language: 'javascript',
            code: `db.empleados.aggregate([
  // Etapa 1: Filtrar empleados activos ($match = WHERE)
  { $match: { activo: true } },

  // Etapa 2: Agrupar por departamento ($group = GROUP BY)
  { 
    $group: {
      _id: "$departamento_id",
      total_empleados: { $sum: 1 },
      salario_promedio: { $avg: "$salario" }
    }
  },

  // Etapa 3: Ordenar por promedio descendente ($sort = ORDER BY)
  { $sort: { salario_promedio: -1 } }
]);`,
            explanation: 'Calcula métricas agrupadas por departamento en un pipeline analítico transparente.'
          }
        ],
        keyTakeaways: [
          'Las etapas del pipeline se procesan en el orden exacto en que son declaradas.',
          'Colocar $match al principio del pipeline aprovecha los índices existentes.'
        ]
      }
    ]
  },
  {
    id: 'm-graphql',
    number: 10,
    engine: 'graphql',
    title: 'Módulo API: GraphQL para Consulta de Bases de Datos',
    shortDescription: 'Schemas, Types, Queries, Mutations, Resolvers, integración con PostgreSQL/MongoDB y prevención del problema N+1.',
    badge: 'API GraphQL',
    iconName: 'Share2',
    estimatedMinutes: 40,
    topics: [
      {
        id: 'm-graphql-t1',
        title: '1. Fundamentos de GraphQL vs REST/SQL',
        subtitle: 'Declaratividad y Eliminación del Over-fetching',
        description: 'Por qué GraphQL es la capa API preferida para exponer bases de datos relacionales y de documentos hacia clientes modernos.',
        summaryPoints: [
          'GraphQL es un lenguaje de consulta para APIs y un motor de ejecución para resolver las consultas.',
          'Evita el Over-fetching: El cliente solicita ÚNICAMENTE los campos exactos que necesita.',
          'Evita el Under-fetching: Obtiene múltiples recursos relacionados en una sola petición HTTP.',
          'Utiliza un Schema estrictamente tipado (SDL - Schema Definition Language).'
        ],
        theoryMarkdown: `
### GraphQL vs REST vs SQL

| Característica | REST | SQL Directo | GraphQL |
| :--- | :--- | :--- | :--- |
| **Endpoints** | Múltiples (\`/api/empleados\`, \`/api/deptos\`) | Conexión directa a BD | Endpoint único (\`/graphql\`) |
| **Flexibilidad de Campos** | Fija (definida por el backend) | Total en el servidor | Total desde el cliente |
| **Tipado** | Opcional | Estricto (DDL) | Estricto (Schema SDL) |
        `,
        codeExamples: [
          {
            title: 'Ejemplo de Consulta GraphQL Declarativa',
            language: 'graphql',
            code: `# Solicitar solo el nombre, cargo y el departamento del empleado
query ObtenerNomina {
  empleados {
    id
    nombre
    cargo
    salario
    departamento {
      nombre
      ubicacion
    }
  }
}`,
            explanation: 'El cliente declara exactamente la estructura JSON que espera recibir de respuesta.'
          }
        ],
        keyTakeaways: [
          'GraphQL no reemplaza a tu base de datos SQL/NoSQL; actúa como una capa intermedia elegante.',
          'Un solo endpoint POST /graphql resuelve todas las operaciones de consulta y modificación.'
        ]
      },
      {
        id: 'm-graphql-t2',
        title: '2. Schemas, Queries, Mutations y Resolvers',
        subtitle: 'Definición de Tipos e Integración con el Motor de BD',
        description: 'Cómo escribir esquemas SDL y conectar Resolvers con consultas SQL de PostgreSQL o llamadas a MongoDB.',
        summaryPoints: [
          'type Query define las consultas de lectura.',
          'type Mutation define las modificaciones de datos (Insert, Update, Delete).',
          'Los Resolvers son las funciones del servidor que ejecutan la consulta SQL/Mongo correspondiente.'
        ],
        theoryMarkdown: `
### Arquitectura de un Servidor GraphQL con PostgreSQL

1. **Schema SDL:** Define el contrato de datos.
2. **Resolver:** Función JavaScript/Node.js que se conecta a PostgreSQL usando \`psycopg2\` o \`pg\` para resolver la petición.
        `,
        codeExamples: [
          {
            title: 'Ejemplo de Resolver Node.js/PostgreSQL para GraphQL',
            language: 'javascript',
            code: `const resolvers = {
  Query: {
    // Resolver conectado a PostgreSQL
    empleados: async (_, args, context) => {
      const result = await db.query('SELECT * FROM empleados WHERE activo = true');
      return result.rows;
    }
  },
  Empleado: {
    // Resolver anidado para la relación departamento
    departamento: async (parent) => {
      const result = await db.query('SELECT * FROM departamentos WHERE id = $1', [parent.departamento_id]);
      return result.rows[0];
    }
  }
};`,
            explanation: 'Conecta las peticiones GraphQL directamente con sentencias SQL eficientes.'
          }
        ],
        keyTakeaways: [
          'Los resolvers anidados resuelven las relaciones bajo demanda del cliente.',
          'Utiliza DataLoader para agrupar consultas SQL y evitar el problema del N+1 SELECT.'
        ]
      }
    ]
  }
];

export const ALL_COURSE_MODULES = [...MONGO_GRAPHQL_MODULES.slice(0, 0), ...MONGO_GRAPHQL_MODULES];

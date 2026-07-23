# DBMaster Studio

Plataforma educativa interactiva para aprender bases de datos relacionales y NoSQL con teoría, práctica y asistencia de IA.

## 🎯 Características Principales

DBMaster Studio es una aplicación web completa diseñada para el aprendizaje práctico de bases de datos, combinando:

- **Teoría estructurada**: Módulos educativos sobre PostgreSQL, MongoDB y GraphQL
- **Práctica interactiva**: Playground para escribir y ejecutar consultas SQL/NoSQL
- **Tutor IA**: Asistente pedagógico impulsado por Gemini AI para resolver dudas
- **Evaluación automática**: Quizzes y ejercicios con corrección por IA
- **Progreso personalizado**: Seguimiento del aprendizaje del usuario
- **Sistema de autenticación**: Contraseñas temporales para acceso controlado

## 🔐 Sistema de Autenticación

DBMaster Studio utiliza un sistema de contraseñas temporales para controlar el acceso a la plataforma:

- **Contraseñas temporales**: Válidas por 7 días
- **Formato fácil de recordar**: `palabra1 + palabra2 + número` (ej: `nubesol23`)
- **Uso único**: Cada contraseña puede usarse una sola vez
- **Administración simple**: Comandos npm para gestión

### Comandos de Administración

```bash
# Generar una nueva contraseña temporal
npm run admin:generate

# Listar todas las contraseñas activas
npm run admin:list

# Eliminar una contraseña específica
npm run admin:delete [id]

# Mostrar ayuda
npm run admin:help
```

Para más detalles, consulta [ADMIN_GUIDE.md](ADMIN_GUIDE.md).

## 📚 Contenido Educativo

### PostgreSQL (8 Módulos)
- Fundamentos de bases de datos relacionales y principios ACID
- Consultas SQL básicas y avanzadas (SELECT, WHERE, ORDER BY, etc.)
- JOINS y relaciones entre tablas
- Índices y optimización de consultas
- Transacciones y control de concurrencia
- Funciones y procedimientos almacenados (PL/pgSQL)
- Diseño de esquemas y normalización
- Administración y seguridad

### MongoDB (Módulos NoSQL)
- Modelado de documentos BSON vs tablas relacionales
- Consultas con `find()` y operadores
- Pipeline de agregación con `aggregate()`
- Índices en MongoDB
- Comparación directa SQL vs NoSQL

### GraphQL
- Fundamentos de GraphQL y esquemas
- Queries, Mutations y Subscriptions
- Comparación con REST y SQL
- Práctica con resolvers y tipado fuerte

## 🛠️ Tecnologías

- **Frontend**: React 19, TypeScript, TailwindCSS
- **Backend**: Express.js, Vite
- **IA**: Google Gemini AI (gemini-3.6-flash)
- **Gestión de estado**: React Hooks + localStorage
- **Iconos**: Lucide React

## 📋 Requisitos Previos

- Node.js >= 18.19.1 (recomendado Node.js >= 20)
- npm >= 9.2.0
- Google Gemini API Key

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd DBMaster-Studio-main
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Copia el archivo de ejemplo y configura tu API key:

```bash
cp .env.example .env
```

Edita el archivo `.env` y configura:
```env
GEMINI_API_KEY="tu_api_key_aqui"
APP_URL="http://localhost:3000"
```
### 4. Ejecutar en modo desarrollo
```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:3000**

## 🎮 Uso de la Aplicación

### Navegación Principal
- **Estudio**: Accede a los módulos teóricos de PostgreSQL, MongoDB y GraphQL
- **Playground**: Escribe y ejecuta consultas SQL/NoSQL en tiempo real
- **Quizzes**: Evalúa tus conocimientos con tests interactivos
- **Ejercicios**: Resuelve ejercicios prácticos con corrección automática
- **Visual JOIN**: Ayudante visual para entender joins complejos
- **Python Connectors**: Aprende a conectar bases de datos desde Python

### Tutor IA
El Tutor IA está disponible en cualquier momento para:
- Explicar conceptos teóricos
- Analizar y corregir tus consultas
- Proporcionar ejemplos adicionales
- Resolver dudas específicas sobre SQL, MongoDB o GraphQL

### Progreso del Usuario
La aplicación guarda automáticamente tu progreso en:
- Lecciones completadas
- Ejercicios resueltos
- Puntuaciones de quizzes
- Historial de consultas en el playground

## 🏗️ Estructura del Proyecto

```
DBMaster-Studio-main/
├── src/
│   ├── components/          # Componentes React
│   │   ├── AiTutorModal.tsx     # Modal del tutor IA
│   │   ├── ExerciseRunner.tsx   # Ejecutor de ejercicios
│   │   ├── LessonViewer.tsx     # Visor de lecciones
│   │   ├── ModuleList.tsx       # Lista de módulos
│   │   ├── Playground.tsx       # Editor de consultas
│   │   └── ...
│   ├── data/               # Datos educativos
│   │   ├── modulesPostgreSQL.ts    # Módulos de PostgreSQL
│   │   ├── modulesMongoGraphQL.ts  # Módulos de MongoDB/GraphQL
│   │   ├── quizzesData.ts          # Datos de quizzes
│   │   └── exercisesData.ts        # Ejercicios prácticos
│   ├── types/              # Definiciones TypeScript
│   └── main.tsx            # Punto de entrada
├── server.ts              # Servidor Express con APIs de Gemini
├── vite.config.ts         # Configuración de Vite
├── tailwind.config.js     # Configuración de TailwindCSS
└── package.json           # Dependencias del proyecto
```

## 🔧 Scripts Disponibles

```bash
npm run dev              # Inicia servidor de desarrollo
npm run build            # Construye para producción
npm start                # Ejecuta versión de producción
npm run preview          # Previsualiza build de producción
npm run lint             # Verifica tipos de TypeScript
npm run clean            # Limpia archivos de build

# Comandos de administración
npm run admin:generate   # Generar nueva contraseña temporal
npm run admin:list       # Listar contraseñas activas
npm run admin:delete     # Eliminar contraseña específica
npm run admin:help       # Mostrar ayuda de administración
```

## 🌐 Despliegue en Producción

La aplicación está desplegada en **Render**: https://dbmaster-studio.onrender.com

### Configuración de Despliegue

- **Runtime**: Node.js
- **Build Command**: `npm install; npm run build`
- **Start Command**: `npm start`
- **Root Directory**: `src`
- **Publish Directory**: `dist`

### Variables de Entorno

- `NODE_ENV`: `production`
- `PORT`: `3000`
- `JWT_SECRET`: Clave secreta para tokens
- `ADMIN_KEY`: Clave de administrador
- `GEMINI_API_KEY`: API key de Google Gemini (opcional)

## 🔒 Seguridad

- Las API keys se gestionan mediante variables de entorno
- El archivo `.env` está excluido del control de versiones
- Las consultas se validan antes de ejecutarse
- No se almacenan datos sensibles del usuario

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Notas Importantes

- **Compatibilidad Node.js**: El proyecto usa algunas dependencias que recomiendan Node.js >= 20. Si usas Node.js 18, podría haber warnings pero la aplicación funciona correctamente.
- **API Key de Gemini**: Necesitas una API key válida de Google Gemini AI para usar el Tutor IA. Obtén una en [Google AI Studio](https://makersuite.google.com/app/apikey).
- **Puerto por defecto**: La aplicación usa el puerto 3000. Si está ocupado, puedes modificarlo en `server.ts`.

## 📄 Licencia

Este proyecto es para fines educativos. Consulta el archivo LICENSE para más detalles.

## 🆘 Soporte

Si encuentras problemas o tienes preguntas:
- Revisa la documentación de los módulos
- Usa el Tutor IA integrado en la aplicación
- Abre un issue en el repositorio

---

**Desarrollado para el aprendizaje práctico de bases de datos con IA** 🚀

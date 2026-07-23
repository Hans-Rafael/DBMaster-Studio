import { Module } from '../types/database';

export const POSTGRESQL_MODULES: Module[] = [
  {
    id: 'm1',
    number: 1,
    engine: 'postgresql',
    title: 'Módulo 1: Introducción a PostgreSQL',
    shortDescription: 'Fundamentos de bases de datos relacionales, arquitectura de PostgreSQL, terminal psql, DBeaver, gestión de usuarios e instalación de la base de datos de empleados.',
    badge: 'Fundamentos',
    iconName: 'Database',
    estimatedMinutes: 45,
    topics: [
      {
        id: 'm1-t1',
        title: '1. Conceptos básicos de bases de datos relacionales',
        subtitle: 'Modelo Entidad-Relación y Principios RDBMS',
        description: 'Comprensión de los principios fundamentales de los sistemas gestores de bases de datos relacionales (RDBMS) estructurados en tablas, filas, columnas y claves.',
        summaryPoints: [
          'Las bases de datos relacionales organizan los datos en tablas estructuradas.',
          'Las Claves Primarias (Primary Keys) garantizan la unicidad de cada registro.',
          'Las Claves Foráneas (Foreign Keys) establecen relaciones de integridad referencial entre tablas.',
          'Cumplen con los principios ACID: Atomicidad, Consistencia, Aislamiento y Durabilidad.'
        ],
        theoryMarkdown: `
### Modelo Relacional y RDBMS
Un **Sistema Gestor de Bases de Datos Relacionales (RDBMS)** almacena datos en tablas de dos dimensiones compuestas por filas (tuplas) y columnas (atributos).

#### Conceptos Clave:
- **Tabla (Relación):** Colección de datos estructurados sobre una entidad del mundo real (ej. \`empleados\`, \`departamentos\`).
- **Registro (Fila / Tupla):** Representa una instancia única dentro de una tabla.
- **Columna (Campo / Atributo):** Propiedad o caracteristica que describe a la entidad.
- **Clave Primaria (Primary Key - PK):** Campo o conjunto de campos que identifica de forma unívoca cada fila.
- **Clave Foránea (Foreign Key - FK):** Referencia a la clave primaria de otra tabla para enlazar relaciones.

#### Principios ACID en PostgreSQL:
1. **Atomicidad:** Una transacción se ejecuta completamente o no se ejecuta en absoluto.
2. **Consistencia:** Los datos cumplen todas las reglas e integridades del esquema.
3. **Aislamiento (Isolation):** Las transacciones concurrentes no interfieren entre sí.
4. **Durabilidad:** Una vez confirmada una transacción (COMMIT), los cambios persisten incluso ante fallos del sistema.
        `,
        codeExamples: [
          {
            title: 'Estructura Relacional Típica',
            language: 'sql',
            code: `-- Ejemplo de relación entre Departamentos y Empleados
CREATE TABLE departamentos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE empleados (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    departamento_id INT REFERENCES departamentos(id)
);`,
            explanation: 'La tabla empleados contiene una clave foránea (departamento_id) que apunta a la clave primaria de departamentos.'
          }
        ],
        keyTakeaways: [
          'PostgreSQL es uno de los RDBMS más potentes y respetados del mundo Open Source.',
          'El modelo relacional evita la duplicación mediante la normalización de tablas.'
        ]
      },
      {
        id: 'm1-t2',
        title: '2. Introducción a PostgreSQL y su arquitectura',
        subtitle: 'Procesos de Cliente/Servidor, Memoria y Almacenamiento',
        description: 'Exploración de la arquitectura interna de PostgreSQL, el modelo de procesos cliente-servidor, componentes de memoria (shared_buffers) y el motor de almacenamiento (MVCC).',
        summaryPoints: [
          'PostgreSQL utiliza una arquitectura Cliente/Servidor basada en el modelo proceso por conexión (postmaster).',
          'Gestión de concurrencia mediante MVCC (Multi-Version Concurrency Control) sin bloqueos de lectura.',
          'Componentes de memoria principal: Shared Buffers, Work Mem y Maintenance Work Mem.',
          'El registro de transacciones (WAL - Write-Ahead Logging) garantiza la recuperabilidad de datos.'
        ],
        theoryMarkdown: `
### Arquitectura Interna de PostgreSQL

PostgreSQL opera mediante un modelo **Cliente/Servidor de múltiples procesos**:

1. **Proceso Postmaster (Proceso Principal):** Escucha las peticiones en el puerto predeterminado (normalmente 5432) y crea un nuevo proceso hijo (*backend process*) para cada conexión de cliente recibida.
2. **Procesos Backend:** Procesan las consultas SQL del cliente asignado.
3. **Shared Buffers (Memoria Compartida):** Caché principal donde se cargan las páginas de tabla e índices desde el disco duro.
4. **Write-Ahead Log (WAL):** Registra todos los cambios antes de escribirlos en las tablas, garantizando durabilidad y recuperación ante fallos del sistema.
5. **MVCC (Multi-Version Concurrency Control):** Mecanismo donde cada transacción ve una foto (*snapshot*) consistente de los datos. Las lecturas nunca bloquean a las escrituras y las escrituras nunca bloquean a las lecturas.
        `,
        codeExamples: [
          {
            title: 'Verificar la versión y configuración de PostgreSQL',
            language: 'sql',
            code: `-- Consultar versión de PostgreSQL
SELECT version();

-- Consultar configuración de memoria compartida
SHOW shared_buffers;
SHOW work_mem;`,
            explanation: 'Muestra la versión exacta del servidor PostgreSQL y la asignación actual de memoria de trabajo y caché.'
          }
        ],
        keyTakeaways: [
          'El puerto por defecto de PostgreSQL es el 5432.',
          'MVCC permite alta concurrencia mediante el almacenamiento de múltiples versiones de tuplas.'
        ]
      },
      {
        id: 'm1-t3',
        title: '3. Formas de acceso al sistema de base de datos PostgreSQL',
        subtitle: 'Conexión desde Clientes, Aplicaciones y Herramientas',
        description: 'Métodos para interactuar con la base de datos: CLI (psql), GUIs (DBeaver, pgAdmin), controladores de lenguaje (Python, Node.js) y cadenas de conexión URI.',
        summaryPoints: [
          'Línea de comandos psql para administración rápida y automatizaciones.',
          'Herramientas gráficas (DBeaver, pgAdmin) para desarrollo y modelado visual.',
          'Cadenas de conexión URI estándar: postgresql://usuario:password@host:5432/dbname',
          'Autenticación a través del archivo pg_hba.conf.'
        ],
        theoryMarkdown: `
### Métodos de Conexión a PostgreSQL

Se puede conectar a PostgreSQL a través de tres vías principales:

1. **Interfaz de Línea de Comandos (psql):** Herramienta nativa para ejecutar consultas SQL, scripts y comandos metanativos (\`\\d\`, \`\\l\`, \`\\c\`).
2. **Administradores Gráficos (GUI):** DBeaver, pgAdmin 4, DataGrip o TablePlus.
3. **Drivers y ORMs:** psycopg2 / asyncpg (Python), pg / Prisma / Drizzle (Node.js/TypeScript), JDBC (Java), Npgsql (.NET).

#### Formato de la Cadena de Conexión (Connection String):
\`\`\`text
postgresql://usuario:contraseña@servidor:5432/nombre_bd?sslmode=require
\`\`\`
        `,
        codeExamples: [
          {
            title: 'Ejemplo de Cadena de Conexión PostgreSQL',
            language: 'bash',
            code: `# Conexión con psql indicando parámetros
psql -h localhost -p 5432 -U postgres -d company_db

# Conexión usando URI
psql postgresql://admin:secreto123@127.0.0.1:5432/company_db`,
            explanation: 'Comandos estándar para iniciar sesión en la consola psql hacia una base de datos local o remota.'
          }
        ],
        keyTakeaways: [
          'pg_hba.conf define las políticas de acceso e ip permitidas.',
          'DBeaver es la herramienta GUI universal multiplataforma recomendada.'
        ]
      },
      {
        id: 'm1-t4',
        title: '4. Sistema de administración de base de datos DBeaver',
        subtitle: 'Uso de la GUI Universal DBeaver',
        description: 'Guía práctica para instalar, configurar conexiones y utilizar DBeaver para consultar datos, ver diagramas ER y administrar PostgreSQL.',
        summaryPoints: [
          'DBeaver soporta PostgreSQL, MySQL, SQLite, MongoDB y más.',
          'Editor SQL con autocompletado inteligente, resaltado de sintaxis y formateo.',
          'Visualización interactiva de esquemas y Diagramas Entidad-Relación (ERD).',
          'Herramientas de importación/exportación de archivos CSV, JSON y SQL.'
        ],
        theoryMarkdown: `
### Guía Práctica de DBeaver para PostgreSQL

**DBeaver** es un gestor de bases de datos gratuito, open-source y multiplataforma basado en Eclipse.

#### Pasos para Conectar PostgreSQL en DBeaver:
1. Abrir DBeaver y hacer clic en **Nueva Conexión** (icono de enchufe con signo +).
2. Seleccionar **PostgreSQL** de la lista de controladores.
3. Configurar los campos:
   - **Host:** \`localhost\` (o la IP de tu servidor Cloud)
   - **Puerto:** \`5432\`
   - **Database:** \`company_db\`
   - **Username:** \`postgres\`
   - **Password:** \`tu_contraseña\`
4. Hacer clic en **Test Connection** (DBeaver descargará automáticamente el driver JDBC de PostgreSQL si es necesario) y luego presionar **Finish**.

#### Atajos útiles en DBeaver:
- \`Ctrl + Enter\` (o \`Cmd + Enter\`): Ejecutar la sentencia SQL bajo el cursor.
- \`Alt + X\` (o \`Cmd + Option + X\`): Ejecutar el script completo.
- \`Ctrl + Shift + F\`: Formatear el código SQL.
        `,
        codeExamples: [
          {
            title: 'Consulta de prueba en el editor de DBeaver',
            language: 'sql',
            code: `-- Seleccionar todos los empleados en DBeaver
SELECT * FROM empleados;

-- Ver estructura de la tabla mediante metadata
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'empleados';`,
            explanation: 'Consulta la lista de columnas e información de tipos de datos almacenados en el diccionario de PostgreSQL.'
          }
        ],
        dbeaverNote: 'En DBeaver puedes hacer doble clic sobre cualquier tabla en el panel izquierdo para ver sus datos y la pestaña ER Diagram para ver sus claves foráneas.',
        keyTakeaways: [
          'DBeaver simplifica la inspección visual de tablas, índices y procedimientos.',
          'Permite exportar datos a CSV/Excel con un solo clic.'
        ]
      },
      {
        id: 'm1-t5',
        title: '5. Comandos básicos en la terminal de PostgreSQL (psql)',
        subtitle: 'Dominio de la Meta-Consola psql',
        description: 'Aprende a navegar por la interfaz de línea de comandos psql utilizando metacomandos iniciados con barra invertida (\\).',
        summaryPoints: [
          'Los metacomandos de psql comienzan con barra invertida (\\).',
          '\\l lista todas las bases de datos del servidor.',
          '\\c nombre_bd conecta a una base de datos específica.',
          '\\dt lista todas las tablas del esquema actual.',
          '\\d nombre_tabla describe las columnas, restricciones e índices de una tabla.'
        ],
        theoryMarkdown: `
### Metacomandos de la Terminal psql

A diferencia de las sentencias SQL que terminan en punto y coma (\`;\`), los metacomandos de \`psql\` son interpretados directamente por el cliente y comienzan con una barra invertida (\`\\\`).

#### Tabla de Comandos Imprescindibles:

| Comando | Descripción |
| :--- | :--- |
| \`\\l\` | Listar todas las bases de datos |
| \`\\c db_name\` | Conectarse/cambiarse a la base de datos \`db_name\` |
| \`\\dt\` | Listar todas las tablas del esquema público |
| \`\\d tabla\` | Mostrar la estructura y restricciones de la tabla especificada |
| \`\\dn\` | Listar todos los esquemas existentes |
| \`\\du\` | Listar todos los usuarios y roles con sus atributos |
| \`\\df\` | Listar funciones y procedimientos almacenados |
| \`\\i archivo.sql\` | Ejecutar un script SQL desde un archivo externo |
| \`\\q\` | Salir de la terminal psql |
        `,
        codeExamples: [
          {
            title: 'Sesión Típica en la Terminal psql',
            language: 'bash',
            code: `# 1. Listar bases de datos
\\l

# 2. Conectar a la base de datos de la empresa
\\c company_db

# 3. Listar las tablas disponibles
\\dt

# 4. Ver estructura de la tabla empleados
\\d empleados

# 5. Ejecutar una consulta SQL estándar
SELECT count(*) FROM empleados;

# 6. Salir
\\q`,
            explanation: 'Flujo completo de inspección de base de datos desde la consola de comandos de PostgreSQL.'
          }
        ],
        terminalCommand: 'psql -U postgres -d company_db',
        keyTakeaways: [
          'Los comandos \\ no requieren punto y coma al final.',
          'psql es la herramienta más rápida para ejecutar archivos de script .sql gigantes.'
        ]
      },
      {
        id: 'm1-t6',
        title: '6. Instalación de la base de prueba sobre empleados de una empresa',
        subtitle: 'Base de Datos de Práctica: company_db',
        description: 'Puesta a punto de la base de datos de entrenamiento con las tablas de empleados, departamentos, proyectos, contrataciones y registros de salarios.',
        summaryPoints: [
          'La base de datos de prueba se denomina company_db.',
          'Incluye las tablas de departamentos, empleados, proyectos y asignaciones.',
          'Permite poner en práctica consultas de filtro, agrupaciones, JOINs y transacciones.'
        ],
        theoryMarkdown: `
### Esquema de la Base de Datos de Prueba (Company DB)

Para todos los ejercicios prácticos de este curso, utilizaremos el esquema \`company_db\`. Este esquema simula la estructura organizativa de una empresa tecnológica moderna.

#### Tablas Principales:
1. **departamentos:** ID, Nombre, Ubicación y Presupuesto anual.
2. **empleados:** ID, Nombre, Apellido, Email, Cargo, Salario, Fecha de Contratación, Departamento ID y Estado Activo.
3. **proyectos:** ID, Nombre del proyecto, Presupuesto asignado, Fecha de inicio y Departamento responsable.
4. **empleado_proyecto:** Tabla pivote para relación muchos a muchos entre empleados y proyectos con horas asignadas.
        `,
        codeExamples: [
          {
            title: 'Script de Creación de la Base de Datos de Muestra',
            language: 'sql',
            code: `-- Crear base de datos
CREATE DATABASE company_db;

-- Tabla de Departamentos
CREATE TABLE departamentos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ubicacion VARCHAR(100),
    presupuesto NUMERIC(12, 2) DEFAULT 0.00
);

-- Tabla de Empleados
CREATE TABLE empleados (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    cargo VARCHAR(100),
    salario NUMERIC(10, 2) CHECK (salario >= 0),
    fecha_contratacion DATE DEFAULT CURRENT_DATE,
    departamento_id INT REFERENCES departamentos(id),
    activo BOOLEAN DEFAULT TRUE
);`,
            explanation: 'Crea la estructura básica relacional con claves primarias, claves foráneas y restricciones CHECK.'
          }
        ],
        keyTakeaways: [
          'El tipo SERIAL en PostgreSQL crea un generador automático de secuencias numéricas (Auto-Increment).',
          'NUMERIC(10,2) es el tipo recomendado para salarios y dinero por su precisión exacta sin errores de flotante.'
        ]
      },
      {
        id: 'm1-t7',
        title: '7. Historia y desarrollo del Lenguaje SQL',
        subtitle: 'Evolución del Estándar SQL y Características de PostgreSQL',
        description: 'Un recorrido por el origen del lenguaje SQL en IBM, los estándares ANSI/ISO (SQL-92, SQL:1999, SQL:2016, SQL:2023) y el liderazgo de PostgreSQL en soporte de estándares.',
        summaryPoints: [
          'SQL fue creado originalmente como SEQUEL en IBM por Donald Chamberlin y Raymond Boyce en los años 70.',
          'Estándares clave: SQL-92 (sintaxis relacional base), SQL:1999 (Triggers y Recursividad CTE), SQL:2003 (Funciones de ventana y JSON).',
          'PostgreSQL cumple con al menos 160 de las 179 características obligatorias del estándar SQL:2023.'
        ],
        theoryMarkdown: `
### Historia de SQL y Filosofía de PostgreSQL

- **1970:** Edgar F. Codd publica el artículo fundamental del modelo relacional.
- **1974:** IBM desarrolla SEQUEL (*Structured English Query Language*), que más tarde pasa a llamarse SQL.
- **1986:** ANSI publica el primer estándar oficial SQL.
- **1986 (origen de PostgreSQL):** El profesor Michael Stonebraker en la Universidad de California, Berkeley inicia el proyecto **POSTGRES** (*Post-Ingres*).
- **1996:** Se añade el soporte del lenguaje SQL al motor y pasa a llamarse **PostgreSQL**.

#### ¿Por qué PostgreSQL es el motor SQL más avanzado?
PostgreSQL destaca por ser extremadamente fiel al estándar ISO/IEC SQL, soportando características avanzadas como:
- Tipos de datos JSON/JSONB nativos con índices GIN.
- Common Table Expressions (CTE) con soporte recursivo (\`WITH RECURSIVE\`).
- Funciones de Ventana (\`OVER\`, \`PARTITION BY\`).
- Extensibilidad con lenguajes como PL/pgSQL, PL/Python y PL/v8 (JS).
        `,
        codeExamples: [
          {
            title: 'Ejemplo de Estándar Moderno: CTE Recursivo en PostgreSQL',
            language: 'sql',
            code: `-- Generar una serie numérica del 1 al 5 usando SQL Estándar soportado en PostgreSQL
WITH RECURSIVE serie AS (
    SELECT 1 AS numero
    UNION ALL
    SELECT numero + 1 FROM serie WHERE numero < 5
)
SELECT * FROM serie;`,
            explanation: 'Las Expresiones de Tabla Comunes (CTE) recursivas son parte del estándar SQL:1999 soportado impecablemente en PostgreSQL.'
          }
        ],
        keyTakeaways: [
          'PostgreSQL combina la flexibilidad de JSON (NoSQL) con el rigor relacional de SQL.',
          'Su licencia libre estilo MIT/BSD permite su uso comercial sin costos de licencias.'
        ]
      },
      {
        id: 'm1-t8',
        title: '8. Conceptos básicos de gestión de usuarios',
        subtitle: 'Roles, Permisos (GRANT/REVOKE) y Autenticación',
        description: 'Aprende a administrar la seguridad en PostgreSQL mediante la creación de roles, asignación de privilegios con GRANT y revocación con REVOKE.',
        summaryPoints: [
          'En PostgreSQL los conceptos de "Usuario" y "Grupo" se unifican bajo la noción de Roles.',
          'CREATE ROLE / CREATE USER para instanciar identidades con o sin LOGIN.',
          'GRANT asigna permisos específicos (SELECT, INSERT, UPDATE) sobre objetos de la BD.',
          'REVOKE quita permisos previamente concedidos.'
        ],
        theoryMarkdown: `
### Gestión de Roles y Seguridad en PostgreSQL

En PostgreSQL no existen diferencias técnicas internas entre usuarios y grupos: todos son **Roles**.

#### Tipos de Roles:
- **Rol con atributo LOGIN (equivale a un Usuario):** Puede iniciar sesión en la BD.
- **Rol sin atributo LOGIN (equivale a un Grupo):** Sirve para agrupar permisos y heredarlos a otros roles.

#### Principales Privilegios:
- \`SELECT\`, \`INSERT\`, \`UPDATE\`, \`DELETE\` sobre tablas y vistas.
- \`USAGE\` sobre esquemas y secuencias.
- \`EXECUTE\` sobre funciones y procedimientos.
        `,
        codeExamples: [
          {
            title: 'Creación de Rol y Asignación de Permisos de Lectura',
            language: 'sql',
            code: `-- 1. Crear un rol de analista con contraseña y permiso de login
CREATE USER analista_datos WITH PASSWORD 'PasswordSeguro123!';

-- 2. Conceder permiso de lectura en la tabla de empleados
GRANT SELECT ON TABLE empleados TO analista_datos;

-- 3. Conceder permiso de lectura en todas las tablas del esquema public
GRANT SELECT ON ALL TABLES IN SCHEMA public TO analista_datos;

-- 4. Revocar el permiso de inserción por seguridad
REVOKE INSERT, UPDATE, DELETE ON TABLE empleados FROM analista_datos;`,
            explanation: 'Crea un usuario analista_datos con privilegios estrictos de solo lectura (Principio de Menor Privilegio).'
          }
        ],
        keyTakeaways: [
          'Aplica siempre el principio de menor privilegio para proteger los datos de producción.',
          'Los roles pueden heredarse mediante la sintaxis GRANT nombre_grupo TO nombre_usuario.'
        ]
      }
    ]
  },
  {
    id: 'm2',
    number: 2,
    engine: 'postgresql',
    title: 'Módulo 2: Lenguaje de Definición de Datos (DDL)',
    shortDescription: 'Creación de bases de datos, esquemas, tablas, tipos de datos, restricciones (PK, FK, CHECK, UNIQUE) e índices (B-Tree, GIN).',
    badge: 'Estructura DDL',
    iconName: 'Table',
    estimatedMinutes: 50,
    topics: [
      {
        id: 'm2-t1',
        title: '1. Principales objetos de PostgreSQL relacionados con DDL',
        subtitle: 'Catálogo de Objetos del Motor',
        description: 'Visión general de los objetos gestionados mediante el Lenguaje de Definición de Datos (DDL): Databases, Schemas, Tables, Views, Indexes, Sequences, Domains y Triggers.',
        summaryPoints: [
          'Las sentencias DDL principales son CREATE, ALTER y DROP.',
          'Jerarquía de objetos: Servidor -> Base de Datos -> Esquema -> Objetos (Tablas, Vistas, Índices).',
          'Las secuencias (Sequences) proporcionan generadores autoincrementales de enteros.',
          'Los dominios (Domains) permiten crear tipos de datos personalizados con reglas reutilizables.'
        ],
        theoryMarkdown: `
### Jerarquía de Objetos en PostgreSQL

Las sentencias DDL (**Data Definition Language**) modifican el diccionario y la estructura física de la base de datos.

\`\`\`text
Servidor PostgreSQL (Cluster)
 └── Base de Datos (ej. company_db)
      └── Esquemas (ej. public, contabilidad, rrhh)
           ├── Tablas (Tables)
           ├── Vistas (Views)
           ├── Índices (Indexes)
           ├── Secuencias (Sequences)
           ├── Funciones y Procedimientos
           └── Disparadores (Triggers)
\`\`\`
        `,
        codeExamples: [
          {
            title: 'Ejemplo de consulta a los objetos DDL del sistema',
            language: 'sql',
            code: `-- Ver todos los esquemas existentes
SELECT schema_name FROM information_schema.schemata;

-- Ver todas las secuencias en uso
SELECT sequence_name FROM information_schema.sequences;`,
            explanation: 'Explora el catálogo information_schema para auditoría de objetos definidos.'
          }
        ],
        keyTakeaways: [
          'PostgreSQL ejecuta sentencias DDL dentro de transacciones de forma transaccional (puedes hacer ROLLBACK de un DROP TABLE!).',
          'El esquema por defecto siempre se llama "public".'
        ]
      },
      {
        id: 'm2-t2',
        title: '2. Creación de bases de datos y esquemas',
        subtitle: 'CREATE DATABASE y CREATE SCHEMA',
        description: 'Organización lógica y física mediante la creación de bases de datos separadas y esquemas de trabajo para aislar módulos de software.',
        summaryPoints: [
          'CREATE DATABASE crea un nuevo contenedor de almacenamiento aislado.',
          'CREATE SCHEMA permite agrupar tablas por módulo (ej. rrhh, ventas, finanzas).',
          'search_path determina el orden de resolución de esquemas en las consultas.'
        ],
        theoryMarkdown: `
### Creación de Bases de Datos y Esquemas

Un **esquema** es una carpeta lógica dentro de una base de datos. Permite que múltiples usuarios compartan una misma BD sin interferir entre sí.

#### Ventajas del uso de Esquemas:
- Organiza objetos por subsistema (ej. \`rrhh.empleados\` vs \`ventas.clientes\`).
- Facilita la gestión de permisos por módulo.
- Evita colisiones de nombres de tablas.
        `,
        codeExamples: [
          {
            title: 'Creación de Esquemas y Configuración de search_path',
            language: 'sql',
            code: `-- Crear un esquema dedicado para el departamento financiero
CREATE SCHEMA finanzas;

-- Crear una tabla dentro del esquema finanzas
CREATE TABLE finanzas.facturas (
    id SERIAL PRIMARY KEY,
    monto NUMERIC(10,2) NOT NULL,
    fecha_emision DATE DEFAULT CURRENT_DATE
);

-- Configurar la ruta de búsqueda de esquemas para la sesión actual
SET search_path TO finanzas, public;`,
            explanation: 'Organiza tablas en espacios de nombres limpios y configura la búsqueda automática.'
          }
        ],
        keyTakeaways: [
          'Al omitir el nombre del esquema, PostgreSQL crea la tabla en el esquema por defecto public.',
          'search_path funciona de manera similar al PATH de comandos del sistema operativo.'
        ]
      },
      {
        id: 'm2-t3',
        title: '3. Creación, modificación y eliminación de tablas',
        subtitle: 'Sintaxis de CREATE TABLE, ALTER TABLE y DROP TABLE',
        description: 'Uso práctico de DDL para definir columnas con tipos de datos (INTEGER, VARCHAR, NUMERIC, TIMESTAMP, JSONB), modificar estructuras sobre la marcha y eliminar tablas.',
        summaryPoints: [
          'CREATE TABLE define el nombre de la tabla, sus columnas y tipos de datos.',
          'ALTER TABLE permite agregar, modificar o eliminar columnas sin perder datos.',
          'DROP TABLE elimina la tabla y su contenido permanentemente (o condicionalmente con IF EXISTS).'
        ],
        theoryMarkdown: `
### Definición de Tablas en PostgreSQL

PostgreSQL cuenta con uno de los conjuntos de tipos de datos más ricos del mercado:
- **Números:** \`INTEGER\`, \`BIGINT\`, \`NUMERIC(p,s)\`, \`REAL\`.
- **Cadenas:** \`VARCHAR(n)\`, \`TEXT\` (longitud ilimitada con rendimiento óptimo).
- **Fechas/Tiempo:** \`DATE\`, \`TIME\`, \`TIMESTAMP WITH TIME ZONE\`, \`INTERVAL\`.
- **Especiales:** \`BOOLEAN\`, \`UUID\`, \`JSONB\` (JSON binario indexable), \`ARRAY\`.
        `,
        codeExamples: [
          {
            title: 'Ejemplo completo de DDL: CREATE, ALTER y DROP',
            language: 'sql',
            code: `-- 1. Crear tabla de proyectos de software
CREATE TABLE proyectos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    presupuesto NUMERIC(12,2) DEFAULT 0.00,
    fecha_inicio DATE DEFAULT CURRENT_DATE
);

-- 2. Modificar la tabla agregando una columna de estado
ALTER TABLE proyectos ADD COLUMN estado VARCHAR(20) DEFAULT 'PLANIFICACION';

-- 3. Renombrar una columna
ALTER TABLE proyectos RENAME COLUMN presupuesto TO presupuesto_estimado;

-- 4. Eliminar la tabla si existe
-- DROP TABLE IF EXISTS proyectos;`,
            explanation: 'Ciclo de vida completo del esquema DDL de una tabla en PostgreSQL.'
          }
        ],
        keyTakeaways: [
          'El tipo TEXT en PostgreSQL no penaliza el rendimiento en comparación con VARCHAR(n).',
          'Utiliza siempre IF EXISTS al hacer DROP TABLE en scripts automáticos de despliegue.'
        ]
      },
      {
        id: 'm2-t4',
        title: '4. Definición de restricciones',
        subtitle: 'Integridad Referencial y Reglas de Negocio',
        description: 'Garantizar la calidad de los datos mediante PRIMARY KEY, FOREIGN KEY, NOT NULL, UNIQUE y restricciones personalizadas CHECK.',
        summaryPoints: [
          'NOT NULL impide que un campo almacene valores nulos.',
          'UNIQUE asegura que no existan valores duplicados en una columna.',
          'PRIMARY KEY combina UNIQUE + NOT NULL de forma automática.',
          'FOREIGN KEY valida la existencia de relaciones entre tablas.',
          'CHECK evalúa expresiones booleanas para validar reglas de negocio (ej. salario > 0).'
        ],
        theoryMarkdown: `
### Restricciones (Constraints) en PostgreSQL

Las restricciones previenen la corrupción de datos a nivel de motor de BD.

#### Tipos de Restricciones:
1. **NOT NULL:** Exige un valor en cada fila.
2. **UNIQUE:** Impide duplicados (permite múltiples NULLs según estándar SQL).
3. **PRIMARY KEY:** Identificador único de la tabla.
4. **FOREIGN KEY:** Mantiene la integridad referencial. Soporta acciones en cascada (\`ON DELETE CASCADE\`, \`ON DELETE SET NULL\`).
5. **CHECK:** Valida condiciones lógicas arbitrarias.
        `,
        codeExamples: [
          {
            title: 'Definición de Restricciones Avanzadas',
            language: 'sql',
            code: `CREATE TABLE contratos (
    id SERIAL PRIMARY KEY,
    empleado_id INT NOT NULL REFERENCES empleados(id) ON DELETE CASCADE,
    tipo_contrato VARCHAR(50) NOT NULL,
    salario_mensual NUMERIC(10,2) NOT NULL CONSTRAINT chk_salario_positivo CHECK (salario_mensual >= 1000.00),
    email_contacto VARCHAR(100) UNIQUE NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    CONSTRAINT chk_fechas_validas CHECK (fecha_fin IS NULL OR fecha_fin > fecha_inicio)
);`,
            explanation: 'Garantiza que el salario supere el salario mínimo y que la fecha de fin sea posterior a la de inicio.'
          }
        ],
        keyTakeaways: [
          'ON DELETE CASCADE elimina automáticamente los registros hijos cuando se borra el padre.',
          'Nombrar explícitamente las restricciones (CONSTRAINT nombre) facilita identificar errores en las aplicaciones.'
        ]
      },
      {
        id: 'm2-t5',
        title: '5. Gestión de Índices',
        subtitle: 'Optimización de Consultas B-Tree, Hash, GIN y GiST',
        description: 'Creación y administración de índices en PostgreSQL para acelerar búsquedas y optimizar el rendimiento de la cláusula WHERE y los JOINs.',
        summaryPoints: [
          'Los índices aceleran el acceso a datos a costa de mayor espacio en disco y un ligero sobrecosto en INSERT/UPDATE.',
          'B-Tree es el índice por defecto ideal para comparaciones de igualdad y rangos (<, <=, =, >=, >).',
          'Los índices de expresión (Expression Indexes) permiten indexar el resultado de funciones (ej. LOWER(email)).',
          'Los índices GIN (Generalized Inverted Index) son ideales para consultas sobre documentos JSONB y arreglos.'
        ],
        theoryMarkdown: `
### Estrategias de Indexación en PostgreSQL

Un **índice** es una estructura de datos secundaria (similar al índice de un libro) que permite a PostgreSQL localizar filas rápidamente sin realizar un escaneo completo de la tabla (*Sequential Scan*).

#### Tipos de Índices en PostgreSQL:
- **B-Tree:** El tipo universal multiuso.
- **Hash:** Optimizado para igualdad estricta (\`=\`).
- **GIN:** Para datos compuestos (JSONB, Full-Text Search, Arrays).
- **GiST / SP-GiST:** Para datos geográficos (PostGIS), rangos y búsqueda vectorial.
- **BRIN:** Para tablas masivas con orden cronológico natural (Big Data).
        `,
        codeExamples: [
          {
            title: 'Creación de Índices B-Tree, de Expresión e Índices Únicos',
            language: 'sql',
            code: `-- 1. Índice B-Tree simple para acelerar búsquedas por departamento
CREATE INDEX idx_empleados_departamento ON empleados(departamento_id);

-- 2. Índice de Expresión para búsquedas insensibles a mayúsculas
CREATE INDEX idx_empleados_email_lower ON empleados(LOWER(email));

-- 3. Consulta que aprovecha el índice de expresión
SELECT * FROM empleados WHERE LOWER(email) = 'carlos.gomez@empresa.com';`,
            explanation: 'Permite búsquedas rápidas en milisegundos evitando el escaneo completo secuencial de millones de filas.'
          }
        ],
        keyTakeaways: [
          'No sobre-indexe: cada índice ralentiza las operaciones de escritura (INSERT, UPDATE, DELETE).',
          'Usa EXPLAIN ANALYZE para comprobar si PostgreSQL está haciendo uso efectivo del índice.'
        ]
      }
    ]
  },
  {
    id: 'm3',
    number: 3,
    engine: 'postgresql',
    title: 'Módulo 3: Lenguaje de Manipulación de Datos – Parte I',
    shortDescription: 'Inserción, modificación, eliminación de datos (DML), control de transacciones (BEGIN, COMMIT, ROLLBACK), filtros de selección y creación de Vistas.',
    badge: 'DML & Vistas',
    iconName: 'Edit3',
    estimatedMinutes: 50,
    topics: [
      {
        id: 'm3-t1',
        title: '1. Principales objetos de PostgreSQL relacionados con DML',
        subtitle: 'Comandos de Manipulación de Registros',
        description: 'Introducción a las sentencias DML (Data Manipulation Language) principales: INSERT, UPDATE, DELETE, MERGE/UPSERT y la potente cláusula RETURNING propia de PostgreSQL.',
        summaryPoints: [
          'Las sentencias DML operan sobre los registros (filas) almacenados en las tablas.',
          'INSERT agrega nuevas tuplas.',
          'UPDATE modifica columnas de registros existentes.',
          'DELETE remueve registros específicos.',
          'RETURNING devuelve inmediatamente los valores insertados o modificados sin requerir un SELECT adicional.'
        ],
        theoryMarkdown: `
### Comandos DML y Cláusula RETURNING

Las sentencias **DML** manipulan los datos contenidos en las estructuras previamente creadas con DDL.

#### La Cláusula RETURNING de PostgreSQL:
En el estándar SQL tradicional, después de insertar o actualizar un registro es necesario realizar un \`SELECT\` para obtener la ID generada automáticamente. PostgreSQL resuelve esto elegantemente mediante la cláusula \`RETURNING\`.
        `,
        codeExamples: [
          {
            title: 'Uso de RETURNING en INSERT y UPDATE',
            language: 'sql',
            code: `-- Insertar un empleado y devolver la ID generada automáticamente y la fecha
INSERT INTO empleados (nombre, apellido, email, cargo, salario, departamento_id)
VALUES ('Roberto', 'Díaz', 'roberto.diaz@empresa.com', 'Desarrollador', 3600.00, 1)
RETURNING id, fecha_contratacion;`,
            explanation: 'Devuelve inmediatamente la ID autogenerada por la secuencia sin necesidad de una consulta separada.'
          }
        ],
        keyTakeaways: [
          'RETURNING ahorra viajes de ida y vuelta al servidor (round-trips) desde las aplicaciones clienta.',
          'Se puede usar RETURNING * para devolver la fila completa recién modificada.'
        ]
      },
      {
        id: 'm3-t2',
        title: '2. Control de transacciones',
        subtitle: 'Principios ACID, BEGIN, COMMIT, ROLLBACK y Savepoints',
        description: 'Gestión de bloques transaccionales para garantizar la consistencia en operaciones financieras y empresariales compuestas.',
        summaryPoints: [
          'BEGIN / START TRANSACTION inicia un bloque seguro de cambios.',
          'COMMIT persiste todos los cambios realizados durante la transacción de forma definitiva.',
          'ROLLBACK deshace todos los cambios realizados si ocurre un fallo.',
          'SAVEPOINT establece puntos intermedios de restauración parcial dentro de una misma transacción.'
        ],
        theoryMarkdown: `
### Control de Transacciones en PostgreSQL

Una **transacción** es una unidad lógica de trabajo que agrupa múltiples sentencias SQL. O se ejecutan todas con éxito, o no se aplica ninguna (*All or Nothing*).

#### Ejemplo Clásico: Transferencia de Fondos entre Cuentas/Departamentos
1. Restar presupuesto al departamento A.
2. Sumar presupuesto al departamento B.

Si el paso 2 falla, la base de datos debe revertir automáticamente el paso 1 mediante \`ROLLBACK\`.
        `,
        codeExamples: [
          {
            title: 'Ejemplo de Transacción con SAVEPOINT y ROLLBACK',
            language: 'sql',
            code: `-- Iniciar bloque transaccional
BEGIN;

-- Ajuste de presupuesto del Depto 1
UPDATE departamentos SET presupuesto = presupuesto - 10000 WHERE id = 1;

-- Crear un punto de guardado
SAVEPOINT sp_primer_ajuste;

-- Intentar insertar un nuevo departamento
INSERT INTO departamentos (nombre, ubicacion, presupuesto) 
VALUES ('Investigación', 'Piso 5', 50000);

-- Si deseamos revertir solo hasta el punto de guardado:
ROLLBACK TO SAVEPOINT sp_primer_ajuste;

-- Confirmar los cambios definitivos
COMMIT;`,
            explanation: 'Garantiza que solo las operaciones validadas se confirmen en el disco duro.'
          }
        ],
        keyTakeaways: [
          'PostgreSQL ejecuta por defecto cada comando individual fuera de un bloque BEGIN en modo Autocommit.',
          'Puedes deshacer sentencias DDL (como DROP TABLE) dentro de un bloque BEGIN si no has hecho COMMIT.'
        ]
      },
      {
        id: 'm3-t3',
        title: '3. Inserción, modificación y eliminación de datos',
        subtitle: 'Operaciones CRUD básicas y UPSERT (ON CONFLICT)',
        description: 'Aprende a ejecutar inserciones masivas, actualizaciones con condiciones WHERE y la potente sintaxis UPSERT con ON CONFLICT DO UPDATE.',
        summaryPoints: [
          'INSERT INTO ... VALUES admite múltiples tuplas separadas por comas.',
          'UPDATE sin WHERE modifica TODAS las filas de la tabla (¡usar con precaución!).',
          'UPSERT (ON CONFLICT) inserta un registro o lo actualiza si ya existe la clave duplicada.'
        ],
        theoryMarkdown: `
### Inserción Masiva y Sintaxis UPSERT en PostgreSQL

#### UPSERT (ON CONFLICT):
En aplicaciones web concurrentes, ocurre frecuentemente que dos procesos intentan insertar el mismo correo electrónico. En lugar de lanzar un error, \`ON CONFLICT\` permite definir una acción alternativa (actualizar los datos existentes o ignorar).
        `,
        codeExamples: [
          {
            title: 'Ejemplo de Inserción Múltiple y UPSERT',
            language: 'sql',
            code: `-- 1. Inserción de múltiples registros en un solo comando
INSERT INTO departamentos (nombre, ubicacion, presupuesto) VALUES
('Calidad y QA', 'Piso 4 - Madrid', 40000.00),
('Atención al Cliente', 'Piso 1 - Madrid', 35000.00);

-- 2. Ejemplo de UPSERT (INSERT o UPDATE si ya existe el email)
INSERT INTO empleados (nombre, apellido, email, cargo, salario, departamento_id)
VALUES ('Carlos', 'Gómez', 'carlos.gomez@empresa.com', 'Líder Técnico', 4800.00, 1)
ON CONFLICT (email) 
DO UPDATE SET salario = EXCLUDED.salario, cargo = EXCLUDED.cargo;`,
            explanation: 'Si el email ya existe, actualiza el salario y cargo usando las palabras clave EXCLUDED.'
          }
        ],
        keyTakeaways: [
          'Verifica siempre el filtro WHERE en UPDATE y DELETE ejecutando primero un SELECT.',
          'ON CONFLICT DO NOTHING ignora los duplicados silenciosamente sin detener el script.'
        ]
      },
      {
        id: 'm3-t4',
        title: '4. Consultas básicas de selección de datos. Filtros, condiciones y ordenamiento',
        subtitle: 'Dominio de SELECT, WHERE, ORDER BY, LIMIT y Operadores',
        description: 'Extracción precisa de datos mediante operadores lógicos (AND, OR, NOT), operadores de comparación (=, !=, <, >, BETWEEN, IN, ILIKE) y ordenamiento con NULLS FIRST / NULLS LAST.',
        summaryPoints: [
          'SELECT proyecta las columnas deseadas.',
          'WHERE filtra las filas que cumplen condiciones lógicas.',
          'ILIKE realiza búsquedas insensibles a mayúsculas/minúsculas.',
          'ORDER BY ordena resultados de forma ascendente (ASC) o descendente (DESC).',
          'LIMIT y OFFSET controlan la paginación de datos.'
        ],
        theoryMarkdown: `
### Consultas SELECT y Filtrado Avanzado

La sentencia **SELECT** es la herramienta fundamental de consulta en bases de datos relacionales.

#### Operadores Especiales de PostgreSQL:
- **ILIKE:** BúsquedaInsensible a mayúsculas (\`WHERE nombre ILIKE 'carlos%'\`).
- **BETWEEN a AND b:** Inclusivo para rangos de números o fechas.
- **IN (val1, val2):** Compara contra una lista explícita de valores.
- **IS NULL / IS NOT NULL:** Evaluación correcta de valores ausentes (NULL).
        `,
        codeExamples: [
          {
            title: 'Consulta SELECT con Filtros Complejos y Paginación',
            language: 'sql',
            code: `-- Obtener los 3 empleados con mayor salario del departamento de Tecnología (id 1)
SELECT id, nombre, apellido, cargo, salario 
FROM empleados
WHERE departamento_id = 1 
  AND activo = TRUE 
  AND salario >= 3000.00
ORDER BY salario DESC
LIMIT 3 OFFSET 0;`,
            explanation: 'Filtra empleados activos con alto salario, los ordena del más alto al más bajo y obtiene los primeros 3.'
          }
        ],
        keyTakeaways: [
          'Nunca uses NULL = NULL; utiliza siempre la sintaxis IS NULL o IS NOT NULL.',
          'OFFSET n omite las primeras n filas, útil para paginación de tablas en frontend.'
        ]
      },
      {
        id: 'm3-t5',
        title: '5. Creación, modificación y eliminación de Vistas. Usos, ventajas y desventajas',
        subtitle: 'CREATE VIEW, Materialized Views y Capa de Abstracción',
        description: 'Uso de Vistas como consultas guardadas para simplificar reportes, restringir el acceso a datos sensibles y optimización mediante Vistas Materializadas.',
        summaryPoints: [
          'Una Vista es una tabla virtual basada en el resultado de una consulta SELECT.',
          'No almacena datos físicamente en disco (las Vistas estándar ejecutan la consulta subyacente cada vez).',
          'Las Vistas Materializadas (CREATE MATERIALIZED VIEW) guardan en disco la foto fija de los datos para respuestas ultrarrápidas.',
          'Proporcionan seguridad al ocultar columnas confidenciales (ej. contraseñas, salarios).'
        ],
        theoryMarkdown: `
### Vistas Estándar vs Vistas Materializadas

#### Ventajas de las Vistas:
1. **Simplicidad:** Oculta JOINs complejos y subconsultas detrás de un nombre sencillo.
2. **Seguridad:** Permite conceder acceso a una vista filtrada sin otorgar acceso a las tablas base.
3. **Consistencia:** Centraliza la lógica de negocio de los reportes.

#### Vistas Materializadas en PostgreSQL:
Para reportes pesados que tardan minutos en procesar, PostgreSQL ofrece **Materialized Views**. Almacenan el resultado físicamente y se pueden refrescar periódicamente mediante \`REFRESH MATERIALIZED VIEW\`.
        `,
        codeExamples: [
          {
            title: 'Creación de Vista Estándar y Vista Materializada',
            language: 'sql',
            code: `-- 1. Crear una vista para simplificar la información de empleados y departamentos
CREATE OR REPLACE VIEW vista_empleados_resumen AS
SELECT 
    e.id AS empleado_id,
    e.nombre || ' ' || e.apellido AS nombre_completo,
    e.cargo,
    e.salario,
    d.nombre AS departamento,
    d.ubicacion
FROM empleados e
JOIN departamentos d ON e.departamento_id = d.id
WHERE e.activo = TRUE;

-- 2. Consultar la vista como si fuera una tabla normal
SELECT * FROM vista_empleados_resumen WHERE departamento = 'Tecnología';`,
            explanation: 'Encapsula la lógica del JOIN en un objeto reutilizable por el equipo de reporte.'
          }
        ],
        keyTakeaways: [
          'Las Vistas estándar siempre reflejan el estado actual en tiempo real de las tablas base.',
          'Las Vistas Materializadas requieren ejecutar REFRESH MATERIALIZED VIEW para actualizar sus datos.'
        ]
      }
    ]
  },
  {
    id: 'm4',
    number: 4,
    engine: 'postgresql',
    title: 'Módulo 4: Lenguaje de Manipulación de Datos – Parte II',
    shortDescription: 'Funciones de agregación, agrupaciones (GROUP BY/HAVING), operaciones de conjuntos (UNION, INTERSECT, EXCEPT), JOINs avanzados, subconsultas y Window Functions.',
    badge: 'Consultas Avanzadas',
    iconName: 'PieChart',
    estimatedMinutes: 60,
    topics: [
      {
        id: 'm4-t1',
        title: '1. Funciones de agregación y agrupación',
        subtitle: 'COUNT, SUM, AVG, MAX, MIN, GROUP BY y HAVING',
        description: 'Procesamiento de conjuntos de datos para generar métricas estadísticas, totales por departamento y filtros sobre datos agrupados con HAVING.',
        summaryPoints: [
          'COUNT() cuenta el número de registros.',
          'SUM() y AVG() calculan la suma total y el promedio numérico.',
          'MAX() y MIN() obtienen el valor máximo y mínimo.',
          'GROUP BY colapsa filas con los mismos valores en filas de resumen.',
          'HAVING filtra los grupos generados por GROUP BY (a diferencia de WHERE que filtra filas individuales).'
        ],
        theoryMarkdown: `
### Agregación y Agrupación de Datos

Las funciones de agregación devuelven un único valor numérico o de resumen calculado a partir de un conjunto de valores.

#### Regla de Oro del GROUP BY:
Cualquier columna presente en la cláusula \`SELECT\` que no forme parte de una función de agregación (**debe**) ser incluida explícitamente en la cláusula \`GROUP BY\`.
        `,
        codeExamples: [
          {
            title: 'Métricas por Departamento con GROUP BY y HAVING',
            language: 'sql',
            code: `-- Calcular salario promedio, máximo y total por departamento
-- mostrando solo aquellos departamentos con promedio superior a 3000
SELECT 
    d.nombre AS departamento,
    COUNT(e.id) AS total_empleados,
    ROUND(AVG(e.salario), 2) AS salario_promedio,
    MAX(e.salario) AS salario_maximo,
    SUM(e.salario) AS nomina_total
FROM empleados e
JOIN departamentos d ON e.departamento_id = d.id
GROUP BY d.nombre
HAVING AVG(e.salario) > 3000.00
ORDER BY salario_promedio DESC;`,
            explanation: 'Resume los datos financieros por departamento filtrando con HAVING sobre el promedio calculado.'
          }
        ],
        keyTakeaways: [
          'WHERE se aplica antes de agrupar; HAVING se aplica después de agrupar.',
          'COUNT(*) incluye registros con valores NULL, mientras que COUNT(columna) ignora los NULLs.'
        ]
      },
      {
        id: 'm4-t2',
        title: '2. Operaciones de conjuntos entre tablas',
        subtitle: 'UNION, UNION ALL, INTERSECT y EXCEPT',
        description: 'Combinar verticalmente los resultados de múltiples consultas SELECT utilizando teoría de conjuntos relacional.',
        summaryPoints: [
          'UNION combina los resultados de dos consultas eliminando duplicados.',
          'UNION ALL combina los resultados incluyendo todas las filas sin eliminar duplicados (más rápido).',
          'INTERSECT devuelve únicamente las filas presentes en AMBAS consultas.',
          'EXCEPT devuelve las filas de la primera consulta que NO están en la segunda.'
        ],
        theoryMarkdown: `
### Operaciones de Conjuntos SQL

Para utilizar operaciones de conjuntos, las consultas involucradas deben cumplir dos requisitos indispensables:
1. Tener el mismo número de columnas proyectadas.
2. Contener tipos de datos compatibles en cada posición correspondiente.
        `,
        codeExamples: [
          {
            title: 'Ejemplos de UNION ALL y EXCEPT',
            language: 'sql',
            code: `-- 1. Lista unificada de contactos de empleados y directores (UNION ALL)
SELECT nombre, email, 'Empleado' AS tipo FROM empleados
UNION ALL
SELECT nombre, email, 'Director' AS tipo FROM departamentos d JOIN empleados e ON d.id = e.departamento_id WHERE e.cargo ILIKE '%gerente%'

-- 2. Departamentos que NO tienen proyectos asignados (EXCEPT)
SELECT id FROM departamentos
EXCEPT
SELECT departamento_id FROM proyectos;`,
            explanation: 'Combina listas compatibles de emails o busca diferencias entre tablas relacionales.'
          }
        ],
        keyTakeaways: [
          'Prefiere siempre UNION ALL sobre UNION si sabes de antemano que no existen duplicados, para evitar el costo computacional de ordenamiento.',
          'EXCEPT equivale a la operación A - B de la teoría de conjuntos.'
        ]
      },
      {
        id: 'm4-t3',
        title: '3. Consultas utilizando diferentes tipos de instrucciones JOIN',
        subtitle: 'INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN y CROSS JOIN',
        description: 'Dominio de la combinación horizontal de tablas mediante claves primarias y foráneas para consultar relaciones simples y compuestas.',
        summaryPoints: [
          'INNER JOIN devuelve solo las filas que tienen coincidencias en AMBAS tablas.',
          'LEFT JOIN (LEFT OUTER JOIN) devuelve TODAS las filas de la tabla izquierda y las coincidentes de la derecha (o NULL si no hay).',
          'RIGHT JOIN devuelve todas las filas de la tabla derecha.',
          'FULL OUTER JOIN devuelve todas las filas de ambas tablas combinadas.',
          'CROSS JOIN genera el producto cartesiano de ambas tablas.'
        ],
        theoryMarkdown: `
### Guía Visual y Práctica de JOINs

Los JOINs cruzan información almacenada en tablas distintas relacionándolas a través de columnas comunes.

\`\`\`text
  Tabla A           Tabla B
┌─────────┐       ┌─────────┐
│ id | A  │       │ id | B  │
├─────────┤       ├─────────┤
│  1 | X  │  ───  │  1 | Y  │  <-- INNER JOIN (Coincidencia en id)
│  2 | Z  │       │  3 | W  │
└─────────┘       └─────────┘
\`\`\`
        `,
        codeExamples: [
          {
            title: 'Ejemplo de INNER JOIN, LEFT JOIN y FULL OUTER JOIN',
            language: 'sql',
            code: `-- 1. INNER JOIN: Empleados con su departamento asignado
SELECT e.nombre, e.apellido, e.cargo, d.nombre AS departamento
FROM empleados e
INNER JOIN departamentos d ON e.departamento_id = d.id;

-- 2. LEFT JOIN: TODOS los departamentos y sus empleados (incluso deptos sin empleados)
SELECT d.nombre AS departamento, e.nombre AS empleado
FROM departamentos d
LEFT JOIN empleados e ON d.id = e.departamento_id;`,
            explanation: 'Demuestra cómo el LEFT JOIN conserva todas las entidades de la tabla izquierda aunque no tengan registros relacionados en la derecha.'
          }
        ],
        keyTakeaways: [
          'El LEFT JOIN es ideal para detectar registros huérfanos agregando WHERE tabla_derecha.id IS NULL.',
          'Evita los CROSS JOIN accidentales omitiendo la cláusula ON, ya que pueden colapsar la memoria del servidor.'
        ]
      },
      {
        id: 'm4-t4',
        title: '4. Subconsultas y consultas anidadas',
        subtitle: 'Subconsultas Escalares, Operadores IN/EXISTS y CTEs (WITH)',
        description: 'Técnicas de anidamiento de sentencias SELECT dentro de cláusulas WHERE, FROM o HAVING, y simplificación de código con CTEs.',
        summaryPoints: [
          'Subconsulta Escalar: Devuelve un solo valor de una fila y una columna.',
          'Subconsulta de Lista: Devuelve múltiples filas para ser evaluadas con IN, ANY o ALL.',
          'Subconsulta Correlacionada: Depende de valores de la consulta externa y se evalúa por cada fila.',
          'CTEs (Common Table Expressions - WITH): Crean tablas temporales con nombre para hacer el código altamente legible.'
        ],
        theoryMarkdown: `
### Subconsultas y Expresiones CTE (WITH)

Una **subconsulta** es una consulta SQL incrustada dentro de otra consulta principal.

#### Expresiones de Tabla Comunes (CTEs - Cláusula WITH):
En lugar de anidar múltiples SELECTs difíciles de leer, las CTEs permiten nombrar el resultado intermedio:
        `,
        codeExamples: [
          {
            title: 'Subconsulta con EXISTS vs CTE con Cláusula WITH',
            language: 'sql',
            code: `-- 1. Subconsulta con EXISTS: Empleados que participan en al menos un proyecto
SELECT nombre, apellido, cargo FROM empleados e
WHERE EXISTS (
    SELECT 1 FROM empleado_proyecto ep WHERE ep.empleado_id = e.id
);

-- 2. Mismo reporte utilizando una CTE (WITH) clara y modular
WITH promedio_empresa AS (
    SELECT AVG(salario) AS avg_salario FROM empleados
)
SELECT e.nombre, e.apellido, e.salario, p.avg_salario
FROM empleados e, promedio_empresa p
WHERE e.salario > p.avg_salario;`,
            explanation: 'Las CTEs mejoran notablemente el mantenimiento y legibilidad del código SQL complejo.'
          }
        ],
        keyTakeaways: [
          'EXISTS suele ser sustancialmente más rápido que IN para conjuntos de datos grandes en PostgreSQL.',
          'Las CTEs pueden encadenarse separándolas por comas dentro de la misma sentencia WITH.'
        ]
      },
      {
        id: 'm4-t5',
        title: '5. Consultas avanzadas para generar reportes',
        subtitle: 'Funciones de Ventana (Window Functions) y Análitica',
        description: 'Creación de reportes gerenciales avanzados mediante funciones analíticas ROW_NUMBER(), RANK(), DENSE_RANK(), LAG(), LEAD() y agregaciones móviles con OVER (PARTITION BY...).',
        summaryPoints: [
          'Las Funciones de Ventana realizan cálculos sobre un conjunto de filas relacionadas sin colapsar las filas resultantes.',
          'OVER (PARTITION BY ... ORDER BY ...) define la ventana analítica.',
          'ROW_NUMBER() asigna un número secuencial a cada fila dentro de la partición.',
          'LAG() y LEAD() permiten acceder a filas anteriores o posteriores sin necesidad de autopermutaciones (Self-JOINs).'
        ],
        theoryMarkdown: `
### Funciones de Ventana (Window Functions) en PostgreSQL

A diferencia de \`GROUP BY\` que agrupa múltiples filas en una sola, las **Window Functions** conservan la identidad de cada fila individual al tiempo que calculan métricas acumuladas, rankings o porcentajes.

#### Sintaxis General:
\`\`\`sql
FUNCION() OVER (
    PARTITION BY columna_agrupacion 
    ORDER BY columna_ordenamiento
)
\`\`\`
        `,
        codeExamples: [
          {
            title: 'Ranking de Salarios por Departamento con ROW_NUMBER y RANK',
            language: 'sql',
            code: `-- Obtener el ranking de salarios de cada empleado dentro de su propio departamento
SELECT 
    e.nombre,
    e.apellido,
    d.nombre AS departamento,
    e.salario,
    ROW_NUMBER() OVER (PARTITION BY e.departamento_id ORDER BY e.salario DESC) AS posicion_depto,
    RANK() OVER (ORDER BY e.salario DESC) AS rank_empresa_global
FROM empleados e
JOIN departamentos d ON e.departamento_id = d.id;`,
            explanation: 'Calcula posiciones relativas por departamento y un ranking global en una sola consulta limpia.'
          }
        ],
        keyTakeaways: [
          'ROW_NUMBER() siempre genera valores únicos continuos (1, 2, 3), mientras que RANK() asigna la misma posición ante empates.',
          'LAG(salario) permite calcular diferencias de incremento salarial respecto a la contratación previa.'
        ]
      }
    ]
  },
  {
    id: 'm5',
    number: 5,
    engine: 'postgresql',
    title: 'Módulo 5: Procedimientos Almacenados',
    shortDescription: 'Creación, modificación y ejecución de Procedimientos Almacenados (CREATE PROCEDURE), parámetros IN/OUT, control de flujo y manejo de excepciones en PL/pgSQL.',
    badge: 'Procedimientos',
    iconName: 'Code',
    estimatedMinutes: 50,
    topics: [
      {
        id: 'm5-t1',
        title: '1. Procedimientos almacenados. Sintaxis',
        subtitle: 'CREATE PROCEDURE y Lenguaje PL/pgSQL',
        description: 'Fundamentos de los procedimientos almacenados en PostgreSQL introducidos en la versión 11, diferencia con las funciones y sintaxis del bloque PL/pgSQL.',
        summaryPoints: [
          'Los procedimientos almacenados se crean con CREATE PROCEDURE.',
          'A diferencia de las funciones tradicionales, los procedimientos PUEDEN gestionar transacciones (COMMIT y ROLLBACK) dentro de su cuerpo.',
          'El bloque de código principal se delimita entre BEGIN ... END y dólares dobles ($$).',
          'Utilizan el lenguaje imperativo PL/pgSQL.'
        ],
        theoryMarkdown: `
### Procedimientos Almacenados en PostgreSQL

Soportados desde PostgreSQL 11, los **Procedimientos Almacenados** permiten encapsular lógica de negocio compleja en el servidor de la base de datos.

#### Estructura General de un Bloque PL/pgSQL:
\`\`\`sql
CREATE OR REPLACE PROCEDURE nombre_procedimiento(parametros)
LANGUAGE plpgsql
AS $$
DECLARE
    -- Declaración de variables locales
    v_variable INT;
BEGIN
    -- Cuerpo del procedimiento
    -- Sentencias SQL y control de flujo
END;
$$;
\`\`\`
        `,
        codeExamples: [
          {
            title: 'Sintaxis Básica de un Procedimiento Almacenado',
            language: 'sql',
            code: `CREATE OR REPLACE PROCEDURE sp_actualizar_presupuesto_depto(
    p_depto_id INT,
    p_monto_adicional NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE departamentos 
    SET presupuesto = presupuesto + p_monto_adicional
    WHERE id = p_depto_id;
    
    RAISE NOTICE 'Presupuesto actualizado para el departamento %', p_depto_id;
END;
$$;`,
            explanation: 'Define un procedimiento seguro que incrementa el presupuesto de un departamento determinado.'
          }
        ],
        keyTakeaways: [
          'Usa $$ como delimitador de cadena para evitar tener que escapar comillas simples dentro del código.',
          'RAISE NOTICE imprime mensajes informativos en la consola psql o DBeaver.'
        ]
      },
      {
        id: 'm5-t2',
        title: '2. Creación, modificación, eliminación y ejecución',
        subtitle: 'Comandos CALL, ALTER PROCEDURE y DROP PROCEDURE',
        description: 'Cómo invocar procedimientos mediante la instrucción CALL, reemplazar versiones existentes y eliminarlos de forma segura.',
        summaryPoints: [
          'CALL invoca la ejecución de un procedimiento almacenado.',
          'CREATE OR REPLACE PROCEDURE modifica el procedimiento sin perder permisos asociados.',
          'DROP PROCEDURE elimina el procedimiento de la base de datos.'
        ],
        theoryMarkdown: `
### Ciclo de Vida de los Procedimientos

Para ejecutar un procedimiento en PostgreSQL no se utiliza \`SELECT\`, sino el comando imperativo **CALL**.
        `,
        codeExamples: [
          {
            title: 'Ejecución y Eliminación de Procedimientos',
            language: 'sql',
            code: `-- Invocar el procedimiento creado
CALL sp_actualizar_presupuesto_depto(1, 15000.00);

-- Eliminar el procedimiento especificado
DROP PROCEDURE IF EXISTS sp_actualizar_presupuesto_depto(INT, NUMERIC);`,
            explanation: 'Invoca la lógica de actualización pasándole los parámetros requeridos.'
          }
        ],
        keyTakeaways: [
          'Al eliminar o modificar un procedimiento sobrecargado, debes incluir el tipo de sus parámetros para desambiguarlo.',
          'Los procedimientos almacenados reducen el tráfico de red procesando la lógica directamente en el servidor.'
        ]
      },
      {
        id: 'm5-t3',
        title: '3. Uso de parámetros de entrada y salida',
        subtitle: 'Parámetros IN, OUT e INOUT',
        description: 'Paso de valores hacia procedimientos y retorno de resultados múltiples a través de parámetros de salida.',
        summaryPoints: [
          'IN (por defecto): Parámetro de entrada recibido por el procedimiento.',
          'OUT: Parámetro que devuelve un valor calculado hacia quien realiza la llamada.',
          'INOUT: Parámetro que sirve tanto de entrada como para devolver el resultado modificado.'
        ],
        theoryMarkdown: `
### Tipos de Parámetros en PL/pgSQL

- **IN:** Solo lectura dentro del procedimiento.
- **OUT:** Inicialmente NULL dentro del procedimiento; asigna un resultado para el cliente.
- **INOUT:** Lee el valor enviado y permite reescribirlo para retornar.
        `,
        codeExamples: [
          {
            title: 'Procedimiento con Parámetros OUT',
            language: 'sql',
            code: `CREATE OR REPLACE PROCEDURE sp_obtener_estadisticas_depto(
    IN p_depto_id INT,
    OUT p_total_empleados INT,
    OUT p_salario_promedio NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT COUNT(*), COALESCE(AVG(salario), 0)
    INTO p_total_empleados, p_salario_promedio
    FROM empleados
    WHERE departamento_id = p_depto_id AND activo = TRUE;
END;
$$;

-- Invocación para recibir los parámetros de salida
CALL sp_obtener_estadisticas_depto(1, NULL, NULL);`,
            explanation: 'Asigna los resultados del SELECT directamente a las variables de salida OUT mediante la cláusula INTO.'
          }
        ],
        keyTakeaways: [
          'INTO asigna el resultado de una consulta escalar directamente a variables o parámetros OUT en PL/pgSQL.',
          'COALESCE evita retornar NULL asignando un valor predeterminado cero.'
        ]
      },
      {
        id: 'm5-t4',
        title: '4. Control de flujo. Manejo de excepciones',
        subtitle: 'IF/THEN/ELSE, Bucles LOOP/WHILE y Bloque EXCEPTION',
        description: 'Estructuras condicionales, bucles iterativos y captura de errores para garantizar la robustez del código almacenado.',
        summaryPoints: [
          'Condicionales: IF ... THEN ... ELSIF ... ELSE ... END IF.',
          'Bucles: LOOP ... EXIT WHEN ..., WHILE cond LOOP, FOR registro IN consulta LOOP.',
          'Manejo de Errores: Bloque EXCEPTION WHEN OTHERS THEN para capturar y controlar fallos.'
        ],
        theoryMarkdown: `
### Control de Flujo y Captura de Excepciones

PL/pgSQL es un lenguaje de programación procedural completo que soporta lógica condicional y gestión robusta de excepciones.

#### Estructura de Captura de Errores:
\`\`\`sql
BEGIN
    -- Operaciones propensas a fallos
EXCEPTION
    WHEN unique_violation THEN
        -- Manejar violaciones de clave única
    WHEN OTHERS THEN
        -- Capturar cualquier otro error inesperado
END;
\`\`\`
        `,
        codeExamples: [
          {
            title: 'Procedimiento con Control de Flujo y Manejo de Excepciones',
            language: 'sql',
            code: `CREATE OR REPLACE PROCEDURE sp_transferir_empleado(
    p_empleado_id INT,
    p_nuevo_depto_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_existe_depto BOOLEAN;
BEGIN
    -- Validar si el nuevo departamento existe
    SELECT EXISTS(SELECT 1 FROM departamentos WHERE id = p_nuevo_depto_id) INTO v_existe_depto;
    
    IF NOT v_existe_depto THEN
        RAISE EXCEPTION 'El departamento destino % no existe.', p_nuevo_depto_id;
    END IF;

    -- Transferir empleado
    UPDATE empleados 
    SET departamento_id = p_nuevo_depto_id 
    WHERE id = p_empleado_id;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error al transferir el empleado: %', SQLERRM;
END;
$$;`,
            explanation: 'Lanza excepciones controladas con RAISE EXCEPTION e intercepta errores del sistema con SQLERRM.'
          }
        ],
        keyTakeaways: [
          'SQLERRM contiene el mensaje textual de error capturado por la excepción.',
          'Un bloque EXCEPTION que captura el error realiza un ROLLBACK implícito de las operaciones ocurridas dentro del bloque del procedimiento.'
        ]
      }
    ]
  },
  {
    id: 'm6',
    number: 6,
    engine: 'postgresql',
    title: 'Módulo 6: Programación de Funciones',
    shortDescription: 'Definición de Funciones (CREATE FUNCTION), funciones escalares, funciones que retornan tablas (RETURNS TABLE), diferencias clave con procedimientos.',
    badge: 'Funciones',
    iconName: 'FunctionSquare',
    estimatedMinutes: 45,
    topics: [
      {
        id: 'm6-t1',
        title: '1. Funciones. Sintaxis',
        subtitle: 'CREATE FUNCTION y Tipos de Retorno',
        description: 'Creación de funciones personalizadas de usuario (UDF) en PostgreSQL, especificando el tipo de retorno estricto y modificadores de volatilidad.',
        summaryPoints: [
          'Las funciones DEBEN retornar siempre un valor especificado mediante RETURNS tipo.',
          'Se invocan directamente dentro de sentencias SELECT (ej. SELECT mi_funcion()).',
          'Modificadores de Volatilidad: IMMUTABLE (siempre devuelve lo mismo), STABLE, VOLATILE (por defecto).',
          'Pueden programarse en SQL puro o PL/pgSQL.'
        ],
        theoryMarkdown: `
### Programación de Funciones (UDFs) en PostgreSQL

A diferencia de los procedimientos almacenados que se invocan con \`CALL\`, las **Funciones** se invocan dentro de expresiones \`SELECT\`.

#### Clasificación por Volatilidad:
1. **IMMUTABLE:** No modifica la BD y para las mismas entradas devuelve SIEMPRE el mismo resultado exacto. Permite optimización de índices.
2. **STABLE:** No modifica la BD y dentro de una misma transacción devuelve los mismos resultados.
3. **VOLATILE:** Puede modificar la BD o devolver resultados cambiantes en cada llamada (ej. \`random()\`, \`now()\`).
        `,
        codeExamples: [
          {
            title: 'Función Escalar Sencilla en PL/pgSQL',
            language: 'sql',
            code: `CREATE OR REPLACE FUNCTION fn_calcular_bono(
    p_salario NUMERIC,
    p_porcentaje NUMERIC
)
RETURNS NUMERIC
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
    RETURN ROUND(p_salario * (p_porcentaje / 100.0), 2);
END;
$$;

-- Invocación directa en una consulta SELECT
SELECT nombre, salario, fn_calcular_bono(salario, 10) AS bono_navideno 
FROM empleados;`,
            explanation: 'Calcula el bono del 10% reutilizando la función directamente en la proyección SELECT.'
          }
        ],
        keyTakeaways: [
          'Las funciones IMMUTABLE son indispensables si deseas crear un Índice de Expresión.',
          'Las funciones no pueden ejecutar transacciones explicitas (BEGIN/COMMIT/ROLLBACK).'
        ]
      },
      {
        id: 'm6-t2',
        title: '2. Creación, modificación y eliminación',
        subtitle: 'CREATE OR REPLACE FUNCTION y DROP FUNCTION',
        description: 'Gestión del código fuente de las funciones de usuario y sobrecarga de firmas de funciones.',
        summaryPoints: [
          'CREATE OR REPLACE FUNCTION sustituye la definición sin perder dependencias.',
          'PostgreSQL permite sobrecarga de funciones (mismo nombre pero distintos tipos de parámetros).',
          'DROP FUNCTION remueve la función especificando la firma de parámetros.'
        ],
        theoryMarkdown: `
### Administración y Sobrecarga de Funciones

En PostgreSQL puedes tener dos funciones con el mismo nombre si aceptan diferentes argumentos (Sobrecarga de Funciones).
        `,
        codeExamples: [
          {
            title: 'Sobrecarga y Reemplazo de Funciones',
            language: 'sql',
            code: `-- Firma 1: Recibe salario y porcentaje
CREATE OR REPLACE FUNCTION fn_calcular_impuesto(p_monto NUMERIC)
RETURNS NUMERIC AS $$
BEGIN
    RETURN p_monto * 0.15;
END;
$$ LANGUAGE plpgsql;

-- Invocar
SELECT fn_calcular_impuesto(3000.00);

-- Eliminar
DROP FUNCTION IF EXISTS fn_calcular_impuesto(NUMERIC);`,
            explanation: 'Demuestra la definición y eliminación limpia especificando el tipo de parámetro NUMERIC.'
          }
        ],
        keyTakeaways: [
          'Para reemplazar el tipo de retorno de una función existente debes hacer un DROP FUNCTION previo.',
          'Las funciones se ejecutan bajo el contexto de permisos de quien la invoca (SECURITY INVOKER por defecto).'
        ]
      },
      {
        id: 'm6-t3',
        title: '3. Funciones escalares y funciones de tabla',
        subtitle: 'RETURNS TABLE y SETOF (Table-Valued Functions)',
        description: 'Construcción de funciones avanzadas que devuelven conjuntos completos de datos estructurados en formato de tabla (Table Functions).',
        summaryPoints: [
          'Función Escalar: Retorna un único valor atómico (INTEGER, VARCHAR, NUMERIC).',
          'Función de Tabla: Retorna un conjunto de filas estructuradas usando RETURNS TABLE(...) o SETOF tipo.',
          'Se pueden consultar dentro de la cláusula FROM como si fuesen una tabla física (SELECT * FROM mi_funcion_tabla()).'
        ],
        theoryMarkdown: `
### Funciones que Retornan Tablas (RETURNS TABLE)

Las **Funciones de Tabla** permiten encapsular lógica de filtrado y parametrización avanzada retornando un resultado iterable similar a una Vista dinamizable por argumentos.
        `,
        codeExamples: [
          {
            title: 'Ejemplo de Función que Retorna una Tabla',
            language: 'sql',
            code: `CREATE OR REPLACE FUNCTION fn_obtener_empleados_por_depto(p_depto_id INT)
RETURNS TABLE (
    empleado_id INT,
    nombre_completo TEXT,
    cargo VARCHAR,
    salario NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.nombre || ' ' || e.apellido AS nombre_completo,
        e.cargo,
        e.salario
    FROM empleados e
    WHERE e.departamento_id = p_depto_id AND e.activo = TRUE;
END;
$$;

-- Invocación en la cláusula FROM
SELECT * FROM fn_obtener_empleados_por_depto(1);`,
            explanation: 'Retorna un conjunto de resultados estructurados que se pueden filtrar y unir mediante JOINs.'
          }
        ],
        keyTakeaways: [
          'RETURN QUERY ejecuta la consulta interna y transmite los datos directamente al cliente con óptimo uso de memoria.',
          'Las Funciones de Tabla son la solución perfecta para APIs que necesitan consultar reportes con parámetros dinámicos.'
        ]
      },
      {
        id: 'm6-t4',
        title: '4. Casos de usos',
        subtitle: 'Comparativa: Funciones vs Procedimientos Almacenados',
        description: 'Guía de decisión arquitectónica para saber cuándo implementar una Función o un Procedimiento Almacenado en proyectos reales.',
        summaryPoints: [
          'Usa Funciones cuando necesites calcular valores dentro de consultas SELECT o generar Vistas dinámicas.',
          'Usa Procedimientos cuando necesites realizar transacciones con COMMIT/ROLLBACK, procesamientos batch masivos o no requieras retornar datos obligatoriamente.',
          'Las Funciones son óptimas para abstracciones de calculadoras y transformaciones de datos.'
        ],
        theoryMarkdown: `
### Matriz de Decisión: Funciones vs Procedimientos

| Criterio | Funciones (\`CREATE FUNCTION\`) | Procedimientos (\`CREATE PROCEDURE\`) |
| :--- | :--- | :--- |
| **Invocación** | En \`SELECT\`, \`WHERE\`, \`FROM\` | Exclusivamente con \`CALL\` |
| **Retorno** | Obligatorio (\`RETURNS tipo\`) | Opcional (vía parámetros \`OUT\`) |
| **Manejo de Transacciones** | No puede ejecutar \`COMMIT\` / \`ROLLBACK\` | Sí puede manejar \`COMMIT\` y \`ROLLBACK\` |
| **Uso Principal** | Cálculos, filtros, reportes dinámicos | Tareas batch, mantenimiento, procesos ETL |
        `,
        codeExamples: [
          {
            title: 'Ejemplo Integrado: Reutilización de Funciones en Vistas',
            language: 'sql',
            code: `-- Integrar función de bono dentro de un reporte de nómina
SELECT 
    nombre,
    salario,
    fn_calcular_bono(salario, 15) AS bono_rendimiento,
    salario + fn_calcular_bono(salario, 15) AS total_a_pagar
FROM empleados
WHERE activo = TRUE;`,
            explanation: 'Reutiliza la lógica de cálculo empresarial dentro de consultas del sistema.'
          }
        ],
        keyTakeaways: [
          'Si requieres hacer COMMIT a mitad de un bucle masivo para liberar memoria, utiliza un Procedimiento Almacenado.',
          'Si la lógica será llamada por un ORM dentro de un SELECT, utiliza una Función.'
        ]
      }
    ]
  },
  {
    id: 'm7',
    number: 7,
    engine: 'postgresql',
    title: 'Módulo 7: Programación de Triggers',
    shortDescription: 'Eventos en bases de datos, sintaxis de Triggers (BEFORE/AFTER/INSTEAD OF), variables especiales NEW/OLD, auditoría y optimización.',
    badge: 'Triggers',
    iconName: 'Zap',
    estimatedMinutes: 55,
    topics: [
      {
        id: 'm7-t1',
        title: '1. Concepto de eventos. Definición y características. Relación con el concepto de triggers',
        subtitle: 'Disparadores Basados en Eventos DDL/DML',
        description: 'Comprender el modelo de eventos en PostgreSQL y cómo los disparadores (Triggers) reaccionan automáticamente ante cambios en los datos.',
        summaryPoints: [
          'Un Trigger es una función que se ejecuta automáticamente cuando ocurre un evento DML (INSERT, UPDATE, DELETE).',
          'Aseguran la aplicación automática de reglas de negocio complejas sin depender del código de la aplicación.',
          'Momentos de disparo: BEFORE (antes de escribir), AFTER (después de confirmar la escritura), INSTEAD OF (en vistas).'
        ],
        theoryMarkdown: `
### Eventos y Disparadores (Triggers) en PostgreSQL

Un **Trigger** (Disparador) es un mecanismo que se activa automáticamente en respuesta a un evento específico en una tabla o vista.

#### Eventos que Activador Triggers:
- \`INSERT\`: Cuando se agrega una nueva fila.
- \`UPDATE\`: Cuando se modifica una fila existente.
- \`DELETE\`: Cuando se elimina una fila.
- \`TRUNCATE\`: Cuando se vacía la tabla.

#### Ámbito de Ejecución:
- **FOR EACH ROW:** Se ejecuta de forma individual por cada fila afectada (acceso a las variables \`OLD\` y \`NEW\`).
- **FOR EACH STATEMENT:** Se ejecuta una sola vez por comando SQL completo.
        `,
        codeExamples: [
          {
            title: 'Concepto de Variables Especiales en Triggers',
            language: 'sql',
            code: `-- Variables automáticas disponibles en funciones de trigger PL/pgSQL:
-- NEW: Fila recién insertada o modificada (disponible en INSERT/UPDATE).
-- OLD: Fila previa a la modificación o eliminación (disponible en UPDATE/DELETE).
-- TG_OP: Cadena que indica el evento ('INSERT', 'UPDATE', 'DELETE').`,
            explanation: 'NEW y OLD permiten comparar los valores anteriores y nuevos durante la ejecución del trigger.'
          }
        ],
        keyTakeaways: [
          'En PostgreSQL los Triggers requieren asociar una función previamente definida que devuelva el tipo TRIGGER.',
          'BEFORE INSERT permite interceptar y validar o modificar los datos antes de guardarlos en disco.'
        ]
      },
      {
        id: 'm7-t2',
        title: '2. Triggers. Sintaxis. Implementación de triggers',
        subtitle: 'Sintaxis Completa de CREATE TRIGGER y Función Asociada',
        description: 'Paso a paso para crear una función de disparo (Trigger Function) que retorne TRIGGER y asociarla a una tabla mediante CREATE TRIGGER.',
        summaryPoints: [
          'Paso 1: Crear la función de disparo que retorna TRIGGER.',
          'Paso 2: Crear el disparador en la tabla especificando BEFORE/AFTER e INSERT/UPDATE/DELETE.',
          'En funciones BEFORE, retornar NEW guarda la fila y retornar NULL aborta la operación.'
        ],
        theoryMarkdown: `
### Implementación de Triggers en PostgreSQL

#### Paso 1: Función de Trigger
\`\`\`sql
CREATE OR REPLACE FUNCTION fn_nombre_trigger()
RETURNS TRIGGER AS $$
BEGIN
    -- Lógica utilizando NEW y OLD
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
\`\`\`

#### Paso 2: Asociación del Trigger a la Tabla
\`\`\`sql
CREATE TRIGGER trg_nombre
BEFORE INSERT OR UPDATE ON nombre_tabla
FOR EACH ROW EXECUTE FUNCTION fn_nombre_trigger();
\`\`\`
        `,
        codeExamples: [
          {
            title: 'Ejemplo Práctico: Asignación Automática de Fecha de Modificación',
            language: 'sql',
            code: `-- 1. Función que actualiza la fecha de modificación
CREATE OR REPLACE FUNCTION fn_actualizar_fecha_modificacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_modificacion = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Asociar el Trigger a la tabla empleados
CREATE TRIGGER trg_empleados_actualizacion_fecha
BEFORE UPDATE ON empleados
FOR EACH ROW
EXECUTE FUNCTION fn_actualizar_fecha_modificacion();`,
            explanation: 'Garantiza que la columna fecha_modificacion se actualice automáticamente ante cualquier UPDATE sin depender de la aplicación.'
          }
        ],
        keyTakeaways: [
          'Las funciones de trigger siempre deben retornar el tipo de dato TRIGGER.',
          'En un trigger BEFORE DELETE se debe retornar OLD.'
        ]
      },
      {
        id: 'm7-t3',
        title: '3. Casos de uso de triggers en PostgreSQL',
        subtitle: 'Tabla de Auditoría e Historial de Cambios de Salarios',
        description: 'Implementación real de un sistema de auditoría empresarial que registra automáticamente cada cambio de salario en una tabla de auditoría.',
        summaryPoints: [
          'Auditoría: Registrar quién, cuándo y qué datos modificó en la base de datos.',
          'Validaciones complejas: Impedir operaciones en horarios no laborales o verificar presupuestos.',
          'Sincronización en cascada: Actualizar contadores en tablas agregadas de forma automática.'
        ],
        theoryMarkdown: `
### Caso de Uso Real: Auditoría de Salarios

En aplicaciones financieras es un requisito legal auditar cualquier incremento o reducción de salario indicando la fecha, el usuario de la base de datos y los valores antiguo y nuevo.
        `,
        codeExamples: [
          {
            title: 'Sistema Completo de Auditoría de Salarios con Triggers',
            language: 'sql',
            code: `-- 1. Crear tabla de auditoría de salarios
CREATE TABLE auditoria_salarios (
    id SERIAL PRIMARY KEY,
    empleado_id INT NOT NULL,
    salario_anterior NUMERIC(10,2),
    salario_nuevo NUMERIC(10,2),
    usuario VARCHAR(50) DEFAULT CURRENT_USER,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Función de Trigger para auditar cambios
CREATE OR REPLACE FUNCTION fn_auditar_salario()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.salario IS DISTINCT FROM NEW.salario THEN
        INSERT INTO auditoria_salarios(empleado_id, salario_anterior, salario_nuevo)
        VALUES (NEW.id, OLD.salario, NEW.salario);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Crear el Trigger de auditoría
CREATE TRIGGER trg_auditar_cambio_salario
AFTER UPDATE OF salario ON empleados
FOR EACH ROW
EXECUTE FUNCTION fn_auditar_salario();`,
            explanation: 'Guarda automáticamente una traza imborrable en auditoria_salarios solo cuando la columna salario sufra modificaciones.'
          }
        ],
        keyTakeaways: [
          'IS DISTINCT FROM evalúa correctamente cambios de valor incluso si involucra valores NULL.',
          'AFTER UPDATE garantiza que la auditoría solo se guarde si el UPDATE en la tabla principal tuvo éxito.'
        ]
      },
      {
        id: 'm7-t4',
        title: '4. Optimización y consideraciones en el uso de funciones y triggers',
        subtitle: 'Buenas Prácticas, Costos de Rendimiento y Alternativas',
        description: 'Riesgos de sobreutilizar disparadores (Efectos Colaterales Ocultos, Recursividad) y cómo optimizar funciones en entornos de alta concurrencia.',
        summaryPoints: [
          'Evita la lógica de negocio excesiva en triggers, ya que dificulta la depuración y pruebas unitarias.',
          'Evita triggers en cascada que activen otros triggers de forma recursiva.',
          'Utiliza restricciones CHECK y FOREIGN KEY siempre que sea posible antes de recurrir a un trigger.',
          'Inhabilita o deshabilita triggers en cargas masivas de datos mediante ALTER TABLE ... DISABLE TRIGGER.'
        ],
        theoryMarkdown: `
### Buenas Prácticas y Rendimiento de Triggers

#### Consejos de Optimización:
1. **Evalúa si una restricción estándar es suficiente:** Una restricción \`CHECK\` o \`FOREIGN KEY\` es órdenes de magnitud más rápida que un Trigger en PL/pgSQL.
2. **Usa cláusula WHEN en el Trigger:** Evita ejecutar el cuerpo de la función si la condición previa no se cumple:
   \`\`\`sql
   CREATE TRIGGER trg_ejemplo
   BEFORE UPDATE ON empleados
   FOR EACH ROW
   WHEN (OLD.salario IS DISTINCT FROM NEW.salario)
   EXECUTE FUNCTION fn_auditar_salario();
   \`\`\`
3. **Cargas Masivas:** Inhabilita los triggers temporalmente al importar millones de registros para evitar degradas de velocidad.
        `,
        codeExamples: [
          {
            title: 'Deshabilitar y Habilitar Triggers para Mantenimiento',
            language: 'sql',
            code: `-- Deshabilitar todos los triggers de la tabla para importaciones masivas
ALTER TABLE empleados DISABLE TRIGGER ALL;

-- Realizar importación masiva...

-- Volver a habilitar los triggers
ALTER TABLE empleados ENABLE TRIGGER ALL;`,
            explanation: 'Acelera las operaciones de carga masiva deshabilitando temporalmente las verificaciones de triggers.'
          }
        ],
        keyTakeaways: [
          'Usa la cláusula WHEN en el CREATE TRIGGER para evitar invocar el motor PL/pgSQL innecesariamente.',
          'Los triggers no ejecutados se traducen en inserciones hasta 10 veces más rápidas.'
        ]
      }
    ]
  },
  {
    id: 'm8',
    number: 8,
    engine: 'postgresql',
    title: 'Módulo 8: Gestión Básica de Datos',
    shortDescription: 'Formatos de datos (CSV, JSON), importación/exportación con COPY y pg_dump, copias de seguridad (Backups/WAL) y conexión a PostgreSQL desde Python.',
    badge: 'Administración & Python',
    iconName: 'Server',
    estimatedMinutes: 50,
    topics: [
      {
        id: 'm8-t1',
        title: '1. Conceptos de archivos y sus distintos formatos',
        subtitle: 'Intercambio de Datos: CSV, JSON, BSON y Scripts SQL',
        description: 'Análisis de los formatos de archivo más utilizados para el intercambio, ingesta y exportación de bases de datos.',
        summaryPoints: [
          'CSV (Comma-Separated Values): Formato de texto plano ideal para tablas y hojas de cálculo Excel.',
          'JSON (JavaScript Object Notation): Formato jerárquico ideal para estructuras no relacionales y APIs REST.',
          'Scripts SQL (.sql): Archivos con instrucciones DDL/DML para reproducir bases de datos completas.'
        ],
        theoryMarkdown: `
### Formatos de Intercambio de Datos

En el ciclo de vida del software, es indispensable mover datos entre PostgreSQL, hojas de cálculo, servicios web y lenguajes de programación.

#### Comparativa de Formatos:
- **CSV:** Muy ligero, compatible con Excel/PowerBI, requiere un esquema de columnas estricto.
- **JSON / JSONB:** Excelente para estructuras anidadas (ej. detalles de contratos o configuraciones).
- **Dump SQL (.sql):** Contiene las sentencias de recreación de esquema y registros de datos.
        `,
        codeExamples: [
          {
            title: 'Soporte Nativo de JSONB en PostgreSQL',
            language: 'sql',
            code: `-- Crear tabla con columna JSONB para datos no estructurados
CREATE TABLE empleados_detalles (
    empleado_id INT PRIMARY KEY REFERENCES empleados(id),
    metadatos JSONB
);

-- Insertar un documento JSON
INSERT INTO empleados_detalles VALUES (
    101, 
    '{"habilidades": ["PostgreSQL", "Python", "Docker"], "redes": {"linkedin": "carlosgomez"}}'
);

-- Consultar directamente una clave dentro del JSONB
SELECT metadatos->'redes'->>'linkedin' AS linkedin
FROM empleados_detalles;`,
            explanation: 'Demuestra el operador ->> para extraer valores de texto directamente de campos JSONB.'
          }
        ],
        keyTakeaways: [
          'JSONB almacena el JSON formateado en formato binario indexable, lo que permite consultas ultrarrápidas.',
          'CSV es la opción por excelencia para migrar datos desde Excel a PostgreSQL.'
        ]
      },
      {
        id: 'm8-t2',
        title: '2. Exportación e importación de datos',
        subtitle: 'Comandos COPY, \\copy y Herramientas de Carga',
        description: 'Uso eficiente de los comandos COPY (nivel servidor) y \\copy (nivel cliente psql) para la ingesta y extracción masiva de archivos CSV.',
        summaryPoints: [
          'COPY (Servidor): Requiere permisos de superusuario; lee/escribe archivos directamente en el disco duro del servidor PostgreSQL.',
          '\\copy (Cliente psql): Funciona para cualquier usuario; lee/escribe archivos desde la máquina local donde se ejecuta psql.',
          'Admite especificar delimitadores (comas, punto y coma, tabulaciones) y encabezados (HEADER).'
        ],
        theoryMarkdown: `
### Importación y Exportación Masiva de Datos

El comando **COPY** de PostgreSQL es el mecanismo de carga y descarga de datos más rápido disponible en el motor.

#### Diferencia entre COPY y \\copy:
- **COPY:** Ejecutado por el proceso del servidor PostgreSQL (ruta del archivo en el servidor).
- **\\copy:** Metacomando del cliente \`psql\` (ruta del archivo en tu laptop/computadora local).
        `,
        codeExamples: [
          {
            title: 'Ejemplos de COPY y \\copy para CSV',
            language: 'sql',
            code: `-- 1. Exportar la tabla de empleados a un archivo CSV en el servidor
COPY empleados TO '/tmp/empleados_export.csv' WITH (FORMAT csv, HEADER, DELIMITER ',');

-- 2. Importar datos desde un CSV local utilizando \\copy en psql
-- \\copy departamentos FROM './departamentos_nuevos.csv' WITH (FORMAT csv, HEADER, DELIMITER ';');`,
            explanation: 'Exporta todos los datos de la tabla empleados a un formato estándar CSV accesible por Excel.'
          }
        ],
        keyTakeaways: [
          'Utiliza siempre la opción HEADER para ignorar la primera fila de títulos del archivo CSV.',
          'COPY es hasta 20 veces más rápido que ejecutar múltiples sentencias INSERT individuales.'
        ]
      },
      {
        id: 'm8-t3',
        title: '3. Conceptos de backup y recuperación de datos',
        subtitle: 'pg_dump, pg_restore, Log Lógico vs Físico (WAL) y PITR',
        description: 'Estrategias de respaldo para entornos de producción: Copias lógicas (pg_dump), copias físicas y recuperación en un punto del tiempo (Point-In-Time Recovery).',
        summaryPoints: [
          'pg_dump realiza respaldos lógicos de una sola base de datos en formato script SQL o comprimido custom.',
          'pg_dumpall respalda el clúster entero, incluyendo roles y configuraciones globales.',
          'pg_restore restaura backups creados en formato comprimido (.dump / .tar).',
          'WAL (Write-Ahead Logging) habilita copias físicas incrementales y recuperación Point-In-Time (PITR).'
        ],
        theoryMarkdown: `
### Estrategias de Copias de Seguridad (Backups)

#### 1. Respaldos Lógicos (pg_dump):
Genera sentencias SQL (\`CREATE TABLE\`, \`INSERT\`) o archivos binarios comprimidos. Ideal para bases de datos pequeñas/medianas o migraciones de versión.

#### 2. Respaldos Físicos (WAL / Archiving):
Copia los archivos de bloques físicos del disco e incluye los archivos del registro WAL. Es indispensable para empresas que requieren cero pérdida de datos (RPO ≈ 0) mediante **PITR** (*Point-In-Time Recovery*).
        `,
        codeExamples: [
          {
            title: 'Comandos de Consola para pg_dump y pg_restore',
            language: 'bash',
            code: `# 1. Exportar una base de datos completa a un archivo SQL de texto plano
pg_dump -U postgres -d company_db -f company_db_backup.sql

# 2. Exportar en formato binario comprimido personalizado (Custom Format)
pg_dump -U postgres -F c -b -v -f company_db_custom.dump company_db

# 3. Restaurar un backup en formato custom a una nueva BD limpia
createdb -U postgres company_db_restaurada
pg_restore -U postgres -d company_db_restaurada -v company_db_custom.dump`,
            explanation: 'Comandos esenciales de administración para automatizar respaldos en scripts cron de Linux.'
          }
        ],
        keyTakeaways: [
          'El formato custom (-F c) de pg_dump permite restaurar en paralelo usando múltiples núcleos de CPU (pg_restore -j 4).',
          'Un respaldo que no se prueba restaurar periódicamente no es una copia de seguridad garantizada.'
        ]
      },
      {
        id: 'm8-t4',
        title: '4. Conexión a una base de datos desde aplicaciones. Ejemplo utilizando Python',
        subtitle: 'Integración de PostgreSQL con Python (psycopg2 / SQLAlchemy)',
        description: 'Construcción de scripts en Python para conectarse a PostgreSQL, ejecutar consultas parametrizadas de forma segura e integrar ORMs.',
        summaryPoints: [
          'psycopg2 / psycopg3 es el driver adaptador nativo de PostgreSQL para Python.',
          'SQLAlchemy proporciona un ORM (Object-Relational Mapping) y motor de consultas elegante.',
          'Uso de consultas parametrizadas con placeholders (%s) para PREVENIR Inyecciones SQL.'
        ],
        theoryMarkdown: `
### Conexión de Aplicaciones Python a PostgreSQL

Para interactuar con PostgreSQL desde Python, el estándar de la industria es el driver \`psycopg2\` o el ORM \`SQLAlchemy\`.

#### Prevención Crítica de Inyección SQL:
NUNCA concatenes cadenas en SQL (\`f"SELECT * FROM users WHERE name = '{user_input}'"\`). Utiliza siempre **consultas parametrizadas** pasando las variables en una tupla.
        `,
        codeExamples: [
          {
            title: 'Script de Conexión Completo en Python con psycopg2',
            language: 'python',
            code: `# Script ejecutable de Python para conectar a PostgreSQL
import psycopg2
from psycopg2 import extras

# Configurar parámetros de conexión
conn_params = {
    "host": "localhost",
    "port": 5432,
    "dbname": "company_db",
    "user": "postgres",
    "password": "PasswordSeguro123!"
}

try:
    # 1. Establecer conexión
    connection = psycopg2.connect(**conn_params)
    cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    print("Conexión exitosa a PostgreSQL!")

    # 2. Consulta parametrizada segura contra Inyección SQL
    query = """
        SELECT e.id, e.nombre, e.apellido, e.salario, d.nombre AS departamento
        FROM empleados e
        JOIN departamentos d ON e.departamento_id = d.id
        WHERE e.salario >= %s AND e.activo = %s;
    """
    
    # 3. Ejecutar pasando parámetros en una tupla
    cursor.execute(query, (3000.00, True))
    empleados = cursor.fetchall()

    # 4. Procesar resultados
    for emp in empleados:
        print(f"Empleado: \${emp['nombre']} \${emp['apellido']} | Salario: \\\$\${emp['salario']} | Depto: \${emp['departamento']}")

    # 5. Cerrar recursos
    cursor.close()
    connection.close()

except Exception as error:
    print(f"Error de conexión a PostgreSQL: {error}")`,
            explanation: 'Ejemplo completo de Python para consulta segura de datos con cierre automático de conexión.'
          }
        ],
        pythonSnippet: `import psycopg2

conn = psycopg2.connect("postgresql://postgres:password@localhost:5432/company_db")
cur = conn.cursor()
cur.execute("SELECT * FROM empleados WHERE departamento_id = %s", (1,))
print(cur.fetchall())
cur.close()
conn.close()`,
        keyTakeaways: [
          'Usa RealDictCursor para recibir los resultados en formato diccionario de Python (similares a JSON).',
          'Recuerda hacer conn.commit() explícito al realizar INSERT, UPDATE o DELETE con psycopg2.'
        ]
      }
    ]
  }
];

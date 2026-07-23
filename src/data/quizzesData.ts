import { Quiz } from '../types/database';

export const QUIZZES_DATA: Quiz[] = [
  {
    moduleId: 'm1',
    title: 'Examen Módulo 1: Introducción a PostgreSQL',
    description: 'Ponte a prueba sobre arquitectura relacional, comandos psql, DBeaver y usuarios.',
    questions: [
      {
        id: 'q1-1',
        question: '¿Cuál es el puerto predeterminado que utiliza PostgreSQL para escuchar conexiones de red?',
        options: ['3306', '5432', '27017', '8080'],
        correctAnswerIndex: 1,
        explanation: 'El puerto por defecto de PostgreSQL es el 5432. MySQL usa 3306 y MongoDB 27017.'
      },
      {
        id: 'q1-2',
        question: 'En la consola psql, ¿qué metacomando permite listar todas las tablas del esquema actual?',
        options: ['\\l', '\\c', '\\dt', '\\du'],
        correctAnswerIndex: 2,
        explanation: '\\dt lista las tablas (display tables). \\l lista bases de datos y \\du lista usuarios/roles.'
      },
      {
        id: 'q1-3',
        question: '¿Qué mecanismo utiliza PostgreSQL para permitir lecturas y escrituras concurrentes sin bloqueos mutuos?',
        options: ['MVCC (Multi-Version Concurrency Control)', 'Table Lock Global', 'Single Thread Event Loop', 'Exclusive Mutex'],
        correctAnswerIndex: 0,
        explanation: 'MVCC permite que las lecturas no bloqueen las escrituras ni las escrituras a las lecturas almacenando múltiples versiones de las tuplas.'
      },
      {
        id: 'q1-4',
        question: '¿Qué comando SQL se utiliza para conceder permisos a un rol de usuario?',
        options: ['ALLOW', 'GRANT', 'PERMIT', 'SET PRIVILEGE'],
        correctAnswerIndex: 1,
        explanation: 'GRANT es el comando del estándar SQL para otorgar privilegios (SELECT, INSERT, etc.) sobre objetos.'
      }
    ]
  },
  {
    moduleId: 'm2',
    title: 'Examen Módulo 2: Lenguaje de Definición de Datos (DDL)',
    description: 'Evalúa tu comprensión de CREATE TABLE, ALTER, DROP, restricciones e índices.',
    questions: [
      {
        id: 'q2-1',
        question: '¿Qué tipo de dato autoincremental de PostgreSQL crea automáticamente una secuencia asociada a la columna de clave primaria?',
        options: ['AUTO_INCREMENT', 'SERIAL', 'IDENTITY_INSERT', 'NUMBER_SEQUENCE'],
        correctAnswerIndex: 1,
        explanation: 'SERIAL (o BIGSERIAL) crea una secuencia interna e instruye a la columna a tomar su valor por defecto.'
      },
      {
        id: 'q2-2',
        question: '¿Qué sucede cuando se aplica la restricción ON DELETE CASCADE a una clave foránea (FOREIGN KEY)?',
        options: [
          'Impide eliminar el registro padre si tiene hijos.',
          'Elimina automáticamente los registros hijos en la tabla secundaria cuando el registro padre se elimina.',
          'Establece en NULL las claves foráneas de los hijos.',
          'Lanza una excepción de auditoría.'
        ],
        correctAnswerIndex: 1,
        explanation: 'ON DELETE CASCADE propaga la eliminación de la fila padre a todas las filas hijas asociadas.'
      },
      {
        id: 'q2-3',
        question: '¿Cuál es el tipo de índice por defecto creado por PostgreSQL cuando ejecutas CREATE INDEX?',
        options: ['Hash', 'GIN', 'B-Tree', 'BRIN'],
        correctAnswerIndex: 2,
        explanation: 'B-Tree es el tipo de índice multiuso por defecto en PostgreSQL para comparaciones de orden y rango.'
      }
    ]
  },
  {
    moduleId: 'm3',
    title: 'Examen Módulo 3: Lenguaje de Manipulación de Datos – Parte I',
    description: 'Evalúa tu habilidad con INSERT, UPDATE, DELETE, transacciones (BEGIN/COMMIT) y Vistas.',
    questions: [
      {
        id: 'q3-1',
        question: '¿Qué cláusula propia de PostgreSQL permite devolver los valores recién generados por un INSERT sin requerir un SELECT adicional?',
        options: ['OUTPUT', 'RETURNING', 'RETURN VALUES', 'GET INSERTED'],
        correctAnswerIndex: 1,
        explanation: 'RETURNING devuelve de inmediato las columnas especificadas de la fila insertada o actualizada.'
      },
      {
        id: 'q3-2',
        question: '¿Qué comando deshace todos los cambios realizados en una transacción antes de que se confirme?',
        options: ['COMMIT', 'ABORT', 'ROLLBACK', 'REVERT'],
        correctAnswerIndex: 2,
        explanation: 'ROLLBACK revierte de manera limpia todas las operaciones ejecutadas desde el BEGIN.'
      },
      {
        id: 'q3-3',
        question: '¿Cuál es la diferencia clave entre una Vista normal y una Vista Materializada?',
        options: [
          'Las Vistas normales no se pueden consultar con SELECT.',
          'Las Vistas Materializadas almacenan físicamente los datos en disco para un acceso ultrarrápido.',
          'Las Vistas Materializadas no soportan JOINs.',
          'No existe diferencia.'
        ],
        correctAnswerIndex: 1,
        explanation: 'CREATE MATERIALIZED VIEW guarda en disco la foto fija de los datos para respuestas rápidas en reportes pesados.'
      }
    ]
  },
  {
    moduleId: 'm4',
    title: 'Examen Módulo 4: DML – Parte II y Consultas Avanzadas',
    description: 'Demuestra tu dominio sobre GROUP BY, HAVING, JOINs y Funciones de Ventana.',
    questions: [
      {
        id: 'q4-1',
        question: '¿Cuál es la diferencia entre las cláusulas WHERE y HAVING?',
        options: [
          'WHERE se aplica sobre filas individuales antes de agrupar; HAVING sobre los grupos generados por GROUP BY.',
          'HAVING solo se utiliza en PostgreSQL y WHERE en MySQL.',
          'WHERE no soporta operadores lógicos.',
          'HAVING es más rápido que WHERE siempre.'
        ],
        correctAnswerIndex: 0,
        explanation: 'WHERE filtra filas de origen antes de agrupar. HAVING filtra sobre las agregaciones calculadas.'
      },
      {
        id: 'q4-2',
        question: '¿Qué tipo de JOIN devuelve todas las filas de la tabla izquierda y las coincidentes de la derecha (o NULL)?',
        options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'CROSS JOIN'],
        correctAnswerIndex: 1,
        explanation: 'LEFT JOIN conserva todas las filas de la tabla declarada a la izquierda.'
      },
      {
        id: 'q4-3',
        question: '¿Qué función de ventana asigna un número secuencial continuo (1, 2, 3...) a cada fila dentro de una partición?',
        options: ['RANK()', 'DENSE_RANK()', 'ROW_NUMBER()', 'LEAD()'],
        correctAnswerIndex: 2,
        explanation: 'ROW_NUMBER() siempre devuelve un entero secuencial sin huecos por empates.'
      }
    ]
  },
  {
    moduleId: 'm5',
    title: 'Examen Módulo 5: Procedimientos Almacenados',
    description: 'Verifica tu dominio de PL/pgSQL, CALL y manejo de excepciones.',
    questions: [
      {
        id: 'q5-1',
        question: '¿Cómo se invoca la ejecución de un Procedimiento Almacenado en PostgreSQL?',
        options: ['EXECUTE mi_proc()', 'CALL mi_proc()', 'SELECT mi_proc()', 'RUN mi_proc()'],
        correctAnswerIndex: 1,
        explanation: 'Desde PostgreSQL 11 los procedimientos almacenados se invocan con el comando CALL.'
      },
      {
        id: 'q5-2',
        question: '¿Cuál es la ventaja principal de un Procedimiento Almacenado sobre una Función en PostgreSQL?',
        options: [
          'Los procedimientos son más rápidos.',
          'Los procedimientos almacenados PUEDEN gestionar transacciones (COMMIT/ROLLBACK) dentro de su cuerpo.',
          'Los procedimientos no requieren tipo de lenguaje.',
          'Las funciones no pueden aceptar parámetros.'
        ],
        correctAnswerIndex: 1,
        explanation: 'Los procedimientos pueden hacer COMMIT o ROLLBACK de transacciones intermedias.'
      }
    ]
  },
  {
    moduleId: 'm6',
    title: 'Examen Módulo 6: Programación de Funciones',
    description: 'Valida tus conocimientos sobre UDFs, RETURNS TABLE y volatilidad.',
    questions: [
      {
        id: 'q6-1',
        question: '¿Qué modificador de volatilidad debes asignar a una función que SIEMPRE devuelve el mismo resultado para los mismos argumentos sin modificar la base de datos?',
        options: ['VOLATILE', 'STABLE', 'IMMUTABLE', 'PERSISTENT'],
        correctAnswerIndex: 2,
        explanation: 'IMMUTABLE garantiza la idéntica respuesta para las mismas entradas y permite usar la función en índices de expresión.'
      },
      {
        id: 'q6-2',
        question: '¿Cómo se debe invocar una función de tabla que utiliza la cláusula RETURNS TABLE(...)?',
        options: ['CALL mi_funcion()', 'SELECT * FROM mi_funcion()', 'RUN FUNCTION mi_funcion()', 'EXECUTE TABLE mi_funcion()'],
        correctAnswerIndex: 1,
        explanation: 'Las funciones de tabla se consultan dentro de la cláusula FROM como si fuesen tablas normales.'
      }
    ]
  },
  {
    moduleId: 'm7',
    title: 'Examen Módulo 7: Programación de Triggers',
    description: 'Comprueba lo aprendido sobre disparadores, NEW/OLD y auditoría.',
    questions: [
      {
        id: 'q7-1',
        question: 'En una función de Trigger para el evento INSERT, ¿qué variable especial representa la nueva fila ingresada?',
        options: ['OLD', 'NEW', 'INSERTED', 'ROW'],
        correctAnswerIndex: 1,
        explanation: 'NEW contiene los valores de la fila recién insertada o modificada.'
      },
      {
        id: 'q7-2',
        question: '¿Qué tipo de dato de retorno OBLIGATORIO debe especificar una función en PL/pgSQL diseñada para ser usada por un Trigger?',
        options: ['VOID', 'BOOLEAN', 'TRIGGER', 'INTEGER'],
        correctAnswerIndex: 2,
        explanation: 'Toda función que vaya a asociarse a un CREATE TRIGGER debe declarar RETURNS TRIGGER.'
      }
    ]
  },
  {
    moduleId: 'm8',
    title: 'Examen Módulo 8: Gestión Básica de Datos & Python',
    description: 'Demuestra tu preparación en backups, COPY y conexión desde Python.',
    questions: [
      {
        id: 'q8-1',
        question: '¿Cuál es la herramienta de consola estándar de PostgreSQL para realizar una copia de seguridad lógica de una base de datos?',
        options: ['pg_dump', 'pg_backup', 'postgres_save', 'pg_export'],
        correctAnswerIndex: 0,
        explanation: 'pg_dump es la herramienta oficial para respaldar bases de datos individuales.'
      },
      {
        id: 'q8-2',
        question: '¿Cuál es el driver adaptador de PostgreSQL más utilizado en la comunidad de Python?',
        options: ['mysql-connector', 'psycopg2', 'sqlite3', 'pg-python'],
        correctAnswerIndex: 1,
        explanation: 'psycopg2 (y psycopg3) es el adaptador nativo estándar de la comunidad Python para conectar con PostgreSQL.'
      }
    ]
  }
];

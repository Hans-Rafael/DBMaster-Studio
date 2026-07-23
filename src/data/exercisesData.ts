import { PracticalExercise } from '../types/database';

export const PRACTICAL_EXERCISES: PracticalExercise[] = [
  {
    id: 'ex-m1-1',
    moduleId: 'm1',
    engine: 'postgresql',
    title: 'Ejercicio 1: Inspeccionar Empleados de la Empresa',
    difficulty: 'fácil',
    instructions: 'Escribe una consulta SQL básica para seleccionar el nombre, apellido, cargo y salario de todos los empleados en la tabla "empleados".',
    hints: [
      'Utiliza la sentencia SELECT seguida de las columnas deseadas separadas por comas.',
      'Especifica la tabla con FROM empleados.'
    ],
    initialCode: '-- Escribe tu consulta SQL aquí\nSELECT ',
    solutionCode: 'SELECT nombre, apellido, cargo, salario FROM empleados;',
    solutionExplanation: 'Proyecta las columnas nombre, apellido, cargo y salario de la tabla empleados.',
    expectedOutputSummary: 'Devuelve la lista de empleados con sus salarios.'
  },
  {
    id: 'ex-m2-1',
    moduleId: 'm2',
    engine: 'postgresql',
    title: 'Ejercicio 2: Crear una Tabla de Proveedores con Restricciones',
    difficulty: 'fácil',
    instructions: 'Crea una nueva tabla llamada "proveedores" con un id autoincremental (SERIAL PRIMARY KEY), un "nombre" obligatorio (VARCHAR 100), un "email" único (UNIQUE) y una "evaluacion" numérica con restricción CHECK (evaluacion >= 0).',
    hints: [
      'Usa CREATE TABLE proveedores (...)',
      'Usa SERIAL PRIMARY KEY para el id.',
      'Usa NOT NULL, UNIQUE y CHECK (evaluacion >= 0).'
    ],
    initialCode: 'CREATE TABLE proveedores (\n  -- Define las columnas aquí\n);',
    solutionCode: `CREATE TABLE proveedores (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  evaluacion NUMERIC(3,1) CHECK (evaluacion >= 0)
);`,
    solutionExplanation: 'Crea la estructura de tabla con todas las restricciones de integridad DDL requeridas.',
    expectedOutputSummary: 'Tabla "proveedores" creada satisfactoriamente.'
  },
  {
    id: 'ex-m3-1',
    moduleId: 'm3',
    engine: 'postgresql',
    title: 'Ejercicio 3: Transacción de Aumento de Salario y Vista',
    difficulty: 'intermedio',
    instructions: 'Escribe una consulta para seleccionar todos los empleados del departamento de Tecnología (departamento_id = 1) con salario superior a 3500 ordenados por salario descendente.',
    hints: [
      'Añade filtro WHERE departamento_id = 1 AND salario > 3500.',
      'Añade ORDER BY salario DESC.'
    ],
    initialCode: 'SELECT * FROM empleados\nWHERE ',
    solutionCode: 'SELECT * FROM empleados WHERE departamento_id = 1 AND salario > 3500 ORDER BY salario DESC;',
    solutionExplanation: 'Filtra empleados del departamento 1 con salario superior a 3500 ordenados de mayor a menor.',
    expectedOutputSummary: 'Muestra a Carlos Gómez y Elena Torres.'
  },
  {
    id: 'ex-m4-1',
    moduleId: 'm4',
    engine: 'postgresql',
    title: 'Ejercicio 4: Reporte de Nómina con JOIN y GROUP BY',
    difficulty: 'intermedio',
    instructions: 'Escribe una consulta que devuelva el nombre del departamento, la cantidad de empleados y el salario promedio por departamento, ordenado por el salario promedio de mayor a menor.',
    hints: [
      'Usa JOIN entre empleados y departamentos.',
      'Usa GROUP BY d.nombre.',
      'Usa funciones de agregación COUNT(e.id) y AVG(e.salario).'
    ],
    initialCode: 'SELECT d.nombre AS departamento, COUNT(e.id) AS total_empleados, AVG(e.salario) AS promedio_salario\nFROM empleados e\nJOIN departamentos d ON e.departamento_id = d.id\n',
    solutionCode: `SELECT d.nombre AS departamento, COUNT(e.id) AS total_empleados, ROUND(AVG(e.salario), 2) AS promedio_salario
FROM empleados e
JOIN departamentos d ON e.departamento_id = d.id
GROUP BY d.nombre
ORDER BY promedio_salario DESC;`,
    solutionExplanation: 'Cruza empleados y departamentos con JOIN, agrupa por departamento y calcula las métricas financieras.',
    expectedOutputSummary: 'Resume la nómina promedio por área organizativa.'
  },
  {
    id: 'ex-m5-1',
    moduleId: 'm5',
    engine: 'postgresql',
    title: 'Ejercicio 5: Procedimiento Almacenado de Transferencia',
    difficulty: 'avanzado',
    instructions: 'Escribe la llamada a un procedimiento almacenado para actualizar o verificar un presupuesto en PostgreSQL.',
    hints: [
      'Recuerda usar la instrucción CALL sp_nombre(...)'
    ],
    initialCode: '-- Invocación del procedimiento almacenado\nCALL ',
    solutionCode: 'CALL sp_actualizar_presupuesto_depto(1, 20000.00);',
    solutionExplanation: 'Ejecuta el procedimiento almacenado pasando los parámetros de departamento y monto.',
    expectedOutputSummary: 'Procedimiento ejecutado correctamente.'
  },
  {
    id: 'ex-m6-1',
    moduleId: 'm6',
    engine: 'postgresql',
    title: 'Ejercicio 6: Crear una Función Escalar en PL/pgSQL',
    difficulty: 'intermedio',
    instructions: 'Crea una función llamada fn_bono_empleado que reciba un salario (NUMERIC) y devuelva el 15% de ese salario.',
    hints: [
      'Usa CREATE OR REPLACE FUNCTION fn_bono_empleado(p_salario NUMERIC) RETURNS NUMERIC',
      'Escribe RETURN p_salario * 0.15;'
    ],
    initialCode: 'CREATE OR REPLACE FUNCTION fn_bono_empleado(p_salario NUMERIC)\nRETURNS NUMERIC AS $$\nBEGIN\n  -- Tu código aquí\nEND;\n$$ LANGUAGE plpgsql;',
    solutionCode: `CREATE OR REPLACE FUNCTION fn_bono_empleado(p_salario NUMERIC)
RETURNS NUMERIC AS $$
BEGIN
  RETURN ROUND(p_salario * 0.15, 2);
END;
$$ LANGUAGE plpgsql;`,
    solutionExplanation: 'Define una función escalar reutilizable en expresiones SELECT.',
    expectedOutputSummary: 'Función fn_bono_empleado creada exitosamente.'
  },
  {
    id: 'ex-mongo-1',
    moduleId: 'm-mongo',
    engine: 'mongodb',
    title: 'Ejercicio MongoDB: Consulta find() sobre Empleados',
    difficulty: 'fácil',
    instructions: 'Escribe una consulta BSON en MongoDB para buscar los empleados cuyo salario sea mayor o igual a 4000.',
    hints: [
      'Usa db.empleados.find({ salario: { $gte: 4000 } })'
    ],
    initialCode: 'db.empleados.find({\n  // Filtro de salario aquí\n})',
    solutionCode: 'db.empleados.find({ salario: { $gte: 4000 } })',
    solutionExplanation: 'Utiliza el operador $gte para filtrar documentos con salario mayor o igual a 4000.',
    expectedOutputSummary: 'Devuelve a Carlos Gómez y Elena Torres.'
  },
  {
    id: 'ex-graphql-1',
    moduleId: 'm-graphql',
    engine: 'graphql',
    title: 'Ejercicio GraphQL: Query Declarativo',
    difficulty: 'fácil',
    instructions: 'Escribe una consulta GraphQL para solicitar únicamente el id, nombre, cargo y salario de todos los empleados.',
    hints: [
      'Sintaxis: query { empleados { id nombre cargo salario } }'
    ],
    initialCode: 'query {\n  empleados {\n    -- Especifica los campos aquí\n  }\n}',
    solutionCode: `query {
  empleados {
    id
    nombre
    cargo
    salario
  }
}`,
    solutionExplanation: 'Consulta GraphQL declarativa que proyecta exactamente las 4 propiedades requeridas.',
    expectedOutputSummary: 'Respuesta JSON estructurada sin datos innecesarios.'
  }
];

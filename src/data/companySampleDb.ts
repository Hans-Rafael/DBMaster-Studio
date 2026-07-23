export interface Departamento {
  id: number;
  nombre: string;
  ubicacion: string;
  presupuesto: number;
}

export interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  cargo: string;
  salario: number;
  fecha_contratacion: string;
  departamento_id: number;
  activo: boolean;
}

export interface Proyecto {
  id: number;
  nombre: string;
  presupuesto: number;
  fecha_inicio: string;
  departamento_id: number;
}

export interface EmpleadoProyecto {
  empleado_id: number;
  proyecto_id: number;
  horas_asignadas: number;
}

export interface VistaReporte {
  empleado: string;
  cargo: string;
  departamento: string;
  salario: number;
}

export const INITIAL_COMPANY_DATA = {
  departamentos: [
    { id: 1, nombre: 'Tecnología', ubicacion: 'Piso 4 - Madrid', presupuesto: 150000.00 },
    { id: 2, nombre: 'Recursos Humanos', ubicacion: 'Piso 2 - Madrid', presupuesto: 45000.00 },
    { id: 3, nombre: 'Ventas y Marketing', ubicacion: 'Piso 3 - Barcelona', presupuesto: 95000.00 },
    { id: 4, nombre: 'Finanzas', ubicacion: 'Piso 2 - Barcelona', presupuesto: 70000.00 },
    { id: 5, nombre: 'Operaciones', ubicacion: 'Piso 1 - Valencia', presupuesto: 60000.00 },
  ] as Departamento[],

  empleados: [
    { id: 101, nombre: 'Carlos', apellido: 'Gómez', email: 'carlos.gomez@empresa.com', cargo: 'Desarrollador Senior', salario: 4500.00, fecha_contratacion: '2021-03-15', departamento_id: 1, activo: true },
    { id: 102, nombre: 'Ana', apellido: 'Martínez', email: 'ana.martinez@empresa.com', cargo: 'Gerente de RRHH', salario: 3800.00, fecha_contratacion: '2019-06-01', departamento_id: 2, activo: true },
    { id: 103, nombre: 'Luis', apellido: 'Hernández', email: 'luis.hernandez@empresa.com', cargo: 'Analista de Datos', salario: 3200.00, fecha_contratacion: '2022-01-10', departamento_id: 1, activo: true },
    { id: 104, nombre: 'Sofía', apellido: 'López', email: 'sofia.lopez@empresa.com', cargo: 'Ejecutiva de Ventas', salario: 2900.00, fecha_contratacion: '2020-11-20', departamento_id: 3, activo: true },
    { id: 105, nombre: 'Javier', apellido: 'Pérez', email: 'javier.perez@empresa.com', cargo: 'Contador General', salario: 3400.00, fecha_contratacion: '2018-04-12', departamento_id: 4, activo: true },
    { id: 106, nombre: 'Elena', apellido: 'Torres', email: 'elena.torres@empresa.com', cargo: 'Arquitecta de Software', salario: 5200.00, fecha_contratacion: '2020-02-01', departamento_id: 1, activo: true },
    { id: 107, nombre: 'David', apellido: 'Sánchez', email: 'david.sanchez@empresa.com', cargo: 'Especialista Marketing', salario: 2800.00, fecha_contratacion: '2023-05-18', departamento_id: 3, activo: true },
    { id: 108, nombre: 'María', apellido: 'Ramírez', email: 'maria.ramirez@empresa.com', cargo: 'Líder de Operaciones', salario: 4100.00, fecha_contratacion: '2017-09-25', departamento_id: 5, activo: true },
    { id: 109, nombre: 'Diego', apellido: 'Castro', email: 'diego.castro@empresa.com', cargo: 'Desarrollador Junior', salario: 2400.00, fecha_contratacion: '2023-09-01', departamento_id: 1, activo: false },
    { id: 110, nombre: 'Laura', apellido: 'Morales', email: 'laura.morales@empresa.com', cargo: 'Analista Financiero', salario: 3100.00, fecha_contratacion: '2022-07-14', departamento_id: 4, activo: true },
  ] as Empleado[],

  proyectos: [
    { id: 1, nombre: 'Migración a la Nube AWS', presupuesto: 50000.00, fecha_inicio: '2024-01-15', departamento_id: 1 },
    { id: 2, nombre: 'Rediseño Portal Clientes', presupuesto: 30000.00, fecha_inicio: '2024-03-01', departamento_id: 3 },
    { id: 3, nombre: 'Sistema de Evaluación 360', presupuesto: 15000.00, fecha_inicio: '2024-02-10', departamento_id: 2 },
    { id: 4, nombre: 'Auditoría ERP Financiero', presupuesto: 25000.00, fecha_inicio: '2024-04-05', departamento_id: 4 },
  ] as Proyecto[],

  empleado_proyecto: [
    { empleado_id: 101, proyecto_id: 1, horas_asignadas: 120 },
    { empleado_id: 106, proyecto_id: 1, horas_asignadas: 160 },
    { empleado_id: 103, proyecto_id: 1, horas_asignadas: 80 },
    { empleado_id: 104, proyecto_id: 2, horas_asignadas: 100 },
    { empleado_id: 107, proyecto_id: 2, horas_asignadas: 140 },
    { empleado_id: 102, proyecto_id: 3, horas_asignadas: 90 },
    { empleado_id: 105, proyecto_id: 4, horas_asignadas: 110 },
  ] as EmpleadoProyecto[],

  vistas: {
    vista_empleados_resumen: [
      { empleado: 'Carlos Gómez', cargo: 'Desarrollador Senior', departamento: 'Tecnología', salario: 4500.00 },
      { empleado: 'Ana Martínez', cargo: 'Gerente de RRHH', departamento: 'Recursos Humanos', salario: 3800.00 },
      { empleado: 'Luis Hernández', cargo: 'Analista de Datos', departamento: 'Tecnología', salario: 3200.00 },
      { empleado: 'Elena Torres', cargo: 'Arquitecta de Software', departamento: 'Tecnología', salario: 5200.00 },
    ]
  } as Record<string, any[]>
};

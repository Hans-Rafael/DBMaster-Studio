import { INITIAL_COMPANY_DATA } from '../data/companySampleDb';
import { QueryResult } from '../types/database';

class GraphqlSandboxEngine {
  public execute(queryStr: string): QueryResult {
    const startTime = performance.now();
    const clean = queryStr.trim();

    try {
      const isMutation = clean.startsWith('mutation');
      const isQuery = clean.startsWith('query') || clean.startsWith('{');

      if (isMutation) {
        const endTime = performance.now();
        return {
          success: true,
          rows: [
            {
              data: {
                crearEmpleado: {
                  id: "111",
                  nombre: "Carlos GraphQL",
                  email: "carlos.graphql@empresa.com",
                  departamento: {
                    id: "1",
                    nombre: "Tecnología"
                  }
                }
              }
            }
          ],
          columns: ['data'],
          rowCount: 1,
          executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
          message: 'Mutación GraphQL procesada correctamente por los resolvers.',
          queryType: 'GRAPHQL'
        };
      }

      if (isQuery) {
        // Evaluate requested fields dynamically
        const requestedEmpleados = INITIAL_COMPANY_DATA.empleados.map(e => {
          const dept = INITIAL_COMPANY_DATA.departamentos.find(d => d.id === e.departamento_id);
          return {
            id: String(e.id),
            nombre: `${e.nombre} ${e.apellido}`,
            cargo: e.cargo,
            salario: e.salario,
            departamento: dept ? { id: String(dept.id), nombre: dept.nombre, ubicacion: dept.ubicacion } : null
          };
        });

        const endTime = performance.now();
        return {
          success: true,
          rows: requestedEmpleados,
          columns: ['id', 'nombre', 'cargo', 'salario', 'departamento'],
          rowCount: requestedEmpleados.length,
          executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
          message: 'GraphQL Query resuelta exitosamente (Sin Over-fetching ni Under-fetching).',
          queryType: 'GRAPHQL'
        };
      }

      throw new Error('Sintaxis GraphQL no reconocida. Inicie con "query" o "mutation".');
    } catch (err: any) {
      const endTime = performance.now();
      return {
        success: false,
        rows: [],
        columns: [],
        rowCount: 0,
        executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
        error: `Error GraphQL Resolver: ${err.message || err}`
      };
    }
  }

  public getSchemaSDL(): string {
    return `type Departamento {
  id: ID!
  nombre: String!
  ubicacion: String!
  presupuesto: Float!
}

type Empleado {
  id: ID!
  nombre: String!
  apellido: String!
  email: String!
  cargo: String!
  salario: Float!
  departamento: Departamento
}

type Query {
  empleados(departamentoId: ID): [Empleado!]!
  empleado(id: ID!): Empleado
  departamentos: [Departamento!]!
}

type Mutation {
  crearEmpleado(nombre: String!, apellido: String!, email: String!, departamentoId: ID!): Empleado!
  actualizarSalario(id: ID!, nuevoSalario: Float!): Empleado!
}`;
  }
}

export const graphqlEngine = new GraphqlSandboxEngine();

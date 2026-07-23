import { INITIAL_COMPANY_DATA } from '../data/companySampleDb';
import { QueryResult } from '../types/database';

class SqlSandboxEngine {
  private dbState: Record<string, any>;
  private inTransaction: boolean = false;
  private transactionBackup: Record<string, any> | null = null;

  constructor() {
    this.dbState = JSON.parse(JSON.stringify(INITIAL_COMPANY_DATA));
  }

  public resetDatabase() {
    this.dbState = JSON.parse(JSON.stringify(INITIAL_COMPANY_DATA));
    this.inTransaction = false;
    this.transactionBackup = null;
  }

  public execute(queryStr: string): QueryResult {
    const startTime = performance.now();
    const cleanQuery = queryStr.trim().replace(/;$/, '');

    if (!cleanQuery) {
      return {
        success: false,
        rows: [],
        columns: [],
        rowCount: 0,
        executionTimeMs: 0,
        error: 'Sintaxis SQL vacía.'
      };
    }

    const upper = cleanQuery.toUpperCase();

    // Transactions
    if (upper === 'BEGIN' || upper === 'BEGIN TRANSACTION' || upper === 'START TRANSACTION') {
      this.inTransaction = true;
      this.transactionBackup = JSON.parse(JSON.stringify(this.dbState));
      const endTime = performance.now();
      return {
        success: true,
        rows: [{ resultado: 'Transacción iniciada (BEGIN)' }],
        columns: ['resultado'],
        rowCount: 1,
        executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
        message: 'BEGIN TRANSACTION exitoso.',
        queryType: 'OTHER'
      };
    }

    if (upper === 'COMMIT') {
      if (!this.inTransaction) {
        return {
          success: false,
          rows: [],
          columns: [],
          rowCount: 0,
          executionTimeMs: 0,
          error: 'No hay ninguna transacción activa para hacer COMMIT.'
        };
      }
      this.inTransaction = false;
      this.transactionBackup = null;
      const endTime = performance.now();
      return {
        success: true,
        rows: [{ resultado: 'Transacción confirmada (COMMIT)' }],
        columns: ['resultado'],
        rowCount: 1,
        executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
        message: 'COMMIT exitoso.',
        queryType: 'OTHER'
      };
    }

    if (upper === 'ROLLBACK') {
      if (!this.inTransaction || !this.transactionBackup) {
        return {
          success: false,
          rows: [],
          columns: [],
          rowCount: 0,
          executionTimeMs: 0,
          error: 'No hay ninguna transacción activa para revertir con ROLLBACK.'
        };
      }
      this.dbState = JSON.parse(JSON.stringify(this.transactionBackup));
      this.inTransaction = false;
      this.transactionBackup = null;
      const endTime = performance.now();
      return {
        success: true,
        rows: [{ resultado: 'Transacción revertida (ROLLBACK)' }],
        columns: ['resultado'],
        rowCount: 1,
        executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
        message: 'ROLLBACK ejecutado con éxito.',
        queryType: 'OTHER'
      };
    }

    try {
      if (upper.startsWith('SELECT') || upper.startsWith('WITH')) {
        return this.handleSelect(cleanQuery, startTime);
      } else if (upper.startsWith('INSERT INTO')) {
        return this.handleInsert(cleanQuery, startTime);
      } else if (upper.startsWith('UPDATE')) {
        return this.handleUpdate(cleanQuery, startTime);
      } else if (upper.startsWith('DELETE FROM')) {
        return this.handleDelete(cleanQuery, startTime);
      } else if (upper.startsWith('CREATE VIEW')) {
        return this.handleCreateView(cleanQuery, startTime);
      } else if (upper.startsWith('CREATE TABLE')) {
        return this.handleCreateTable(cleanQuery, startTime);
      } else if (upper.startsWith('DROP TABLE')) {
        return this.handleDropTable(cleanQuery, startTime);
      } else if (upper.startsWith('CREATE INDEX') || upper.startsWith('GRANT') || upper.startsWith('REVOKE') || upper.startsWith('CREATE PROCEDURE') || upper.startsWith('CREATE FUNCTION') || upper.startsWith('CREATE TRIGGER')) {
        const endTime = performance.now();
        return {
          success: true,
          rows: [{ resultado: `Sentencia ejecutada correctamente: ${cleanQuery.split(' ')[0]} ${cleanQuery.split(' ')[1] || ''}` }],
          columns: ['resultado'],
          rowCount: 1,
          executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
          message: 'Instrucción DDL/Programación procesada correctamente en PostgreSQL.',
          queryType: 'DDL'
        };
      } else {
        // Fallback execution attempt
        return this.handleSelect(cleanQuery, startTime);
      }
    } catch (err: any) {
      const endTime = performance.now();
      return {
        success: false,
        rows: [],
        columns: [],
        rowCount: 0,
        executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
        error: `Error de Sintaxis SQL: ${err.message || err}`
      };
    }
  }

  private handleSelect(query: string, startTime: number): QueryResult {
    // Basic SQL parser for SELECT
    let currentRows: Record<string, any>[] = [];

    // Table detection
    let tableName = 'empleados';
    const fromMatch = query.match(/FROM\s+([a-zA-Z0-9_]+)/i);
    if (fromMatch && fromMatch[1]) {
      tableName = fromMatch[1].toLowerCase();
    }

    if (this.dbState[tableName]) {
      currentRows = JSON.parse(JSON.stringify(this.dbState[tableName]));
    } else if (this.dbState.vistas && this.dbState.vistas[tableName]) {
      currentRows = JSON.parse(JSON.stringify(this.dbState.vistas[tableName]));
    } else {
      // Check if it's SELECT 1 or scalar calculation
      if (query.toUpperCase().includes('SELECT') && !query.toUpperCase().includes('FROM')) {
        const endTime = performance.now();
        return {
          success: true,
          rows: [{ resultado: '1', version: 'PostgreSQL 16.2 on x86_64-pc-linux-gnu' }],
          columns: ['resultado', 'version'],
          rowCount: 1,
          executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
          queryType: 'SELECT'
        };
      }
      throw new Error(`La tabla o vista "${tableName}" no existe en el esquema public.`);
    }

    // JOIN handling
    const joinMatch = query.match(/(INNER|LEFT|RIGHT)?\s*JOIN\s+([a-zA-Z0-9_]+)\s+ON\s+([a-zA-Z0-9_.]+)\s*=\s*([a-zA-Z0-9_.]+)/i);
    if (joinMatch) {
      const joinType = (joinMatch[1] || 'INNER').toUpperCase();
      const joinTable = joinMatch[2].toLowerCase();
      const leftColRaw = joinMatch[3];
      const rightColRaw = joinMatch[4];

      if (this.dbState[joinTable]) {
        const rightRows = this.dbState[joinTable];
        const joined: Record<string, any>[] = [];

        const getColName = (raw: string) => raw.split('.').pop() || raw;
        const leftCol = getColName(leftColRaw);
        const rightCol = getColName(rightColRaw);

        for (const lRow of currentRows) {
          let matched = false;
          for (const rRow of rightRows) {
            if (lRow[leftCol] !== undefined && rRow[rightCol] !== undefined && lRow[leftCol] == rRow[rightCol]) {
              matched = true;
              const merged: Record<string, any> = { ...lRow };
              Object.keys(rRow).forEach(k => {
                if (k !== 'id' && merged[k] !== undefined) {
                  merged[`${joinTable}_${k}`] = rRow[k];
                } else if (k === 'nombre' && merged['nombre'] !== undefined) {
                  merged[`nombre_${joinTable}`] = rRow[k];
                  merged[`departamento`] = rRow[k]; // convenience
                } else {
                  merged[k] = rRow[k];
                }
              });
              joined.push(merged);
            }
          }
          if (!matched && joinType === 'LEFT') {
            joined.push({ ...lRow });
          }
        }
        currentRows = joined;
      }
    }

    // WHERE filtering
    const whereMatch = query.match(/WHERE\s+(.*?)(GROUP BY|ORDER BY|LIMIT|HAVING|$)/i);
    if (whereMatch) {
      const whereCond = whereMatch[1].trim();
      currentRows = currentRows.filter(row => this.evaluateWhere(row, whereCond));
    }

    // GROUP BY & Aggregations
    const groupByMatch = query.match(/GROUP BY\s+([a-zA-Z0-9_.,\s]+)/i);
    if (groupByMatch || query.toUpperCase().includes('AVG(') || query.toUpperCase().includes('COUNT(') || query.toUpperCase().includes('SUM(')) {
      if (query.toUpperCase().includes('AVG(') || query.toUpperCase().includes('COUNT(') || query.toUpperCase().includes('SUM(')) {
        currentRows = this.performAggregation(currentRows, query, groupByMatch ? groupByMatch[1] : undefined);
      }
    }

    // ORDER BY
    const orderByMatch = query.match(/ORDER BY\s+([a-zA-Z0-9_]+)(\s+DESC|\s+ASC)?/i);
    if (orderByMatch) {
      const col = orderByMatch[1].trim();
      const isDesc = (orderByMatch[2] || '').trim().toUpperCase() === 'DESC';
      currentRows.sort((a, b) => {
        const valA = a[col] ?? 0;
        const valB = b[col] ?? 0;
        if (valA < valB) return isDesc ? 1 : -1;
        if (valA > valB) return isDesc ? -1 : 1;
        return 0;
      });
    }

    // LIMIT
    const limitMatch = query.match(/LIMIT\s+(\d+)/i);
    if (limitMatch) {
      const limitVal = parseInt(limitMatch[1], 10);
      currentRows = currentRows.slice(0, limitVal);
    }

    const endTime = performance.now();
    const columns = currentRows.length > 0 ? Object.keys(currentRows[0]) : ['id'];

    return {
      success: true,
      rows: currentRows,
      columns,
      rowCount: currentRows.length,
      executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
      queryType: 'SELECT'
    };
  }

  private evaluateWhere(row: Record<string, any>, cond: string): boolean {
    // Evaluate basic conditions like salario > 3000, activo = true, departamento_id = 1
    try {
      const equalsMatch = cond.match(/([a-zA-Z0-9_]+)\s*=\s*(.*)/i);
      if (equalsMatch) {
        const field = equalsMatch[1].trim();
        let val: any = equalsMatch[2].trim().replace(/^['"]|['"]$/g, '');
        if (val === 'true') val = true;
        if (val === 'false') val = false;
        if (!isNaN(Number(val)) && val !== '') val = Number(val);
        return row[field] == val;
      }

      const gtMatch = cond.match(/([a-zA-Z0-9_]+)\s*>\s*(\d+(\.\d+)?)/i);
      if (gtMatch) {
        const field = gtMatch[1].trim();
        const val = Number(gtMatch[2]);
        return (row[field] || 0) > val;
      }

      const ltMatch = cond.match(/([a-zA-Z0-9_]+)\s*<\s*(\d+(\.\d+)?)/i);
      if (ltMatch) {
        const field = ltMatch[1].trim();
        const val = Number(ltMatch[2]);
        return (row[field] || 0) < val;
      }

      const likeMatch = cond.match(/([a-zA-Z0-9_]+)\s+ILIKE\s+['"](.*?)['"]/i) || cond.match(/([a-zA-Z0-9_]+)\s+LIKE\s+['"](.*?)['"]/i);
      if (likeMatch) {
        const field = likeMatch[1].trim();
        const pattern = likeMatch[2].replace(/%/g, '.*');
        const reg = new RegExp(`^${pattern}$`, 'i');
        return reg.test(String(row[field] || ''));
      }
    } catch {
      return true;
    }
    return true;
  }

  private performAggregation(rows: Record<string, any>[], query: string, groupByColRaw?: string): Record<string, any>[] {
    const isCount = query.toUpperCase().includes('COUNT(');
    const isAvg = query.toUpperCase().includes('AVG(');
    const isSum = query.toUpperCase().includes('SUM(');

    if (groupByColRaw) {
      const groupByCol = groupByColRaw.trim().split(',')[0].trim();
      const groups: Record<string, Record<string, any>[]> = {};
      rows.forEach(r => {
        const key = String(r[groupByCol] ?? 'Sin categoría');
        if (!groups[key]) groups[key] = [];
        groups[key].push(r);
      });

      const aggregated: Record<string, any>[] = [];
      Object.entries(groups).forEach(([key, groupRows]) => {
        const item: Record<string, any> = { [groupByCol]: key };
        if (isCount) item['count'] = groupRows.length;
        if (isAvg) {
          const total = groupRows.reduce((acc, curr) => acc + (Number(curr.salario || curr.presupuesto) || 0), 0);
          item['promedio_salario'] = Math.round((total / groupRows.length) * 100) / 100;
        }
        if (isSum) {
          const total = groupRows.reduce((acc, curr) => acc + (Number(curr.salario || curr.presupuesto) || 0), 0);
          item['total'] = total;
        }
        aggregated.push(item);
      });
      return aggregated;
    } else {
      const item: Record<string, any> = {};
      if (isCount) item['total_registros'] = rows.length;
      if (isAvg) {
        const total = rows.reduce((acc, curr) => acc + (Number(curr.salario || curr.presupuesto) || 0), 0);
        item['promedio_salario'] = Math.round((total / (rows.length || 1)) * 100) / 100;
      }
      if (isSum) {
        const total = rows.reduce((acc, curr) => acc + (Number(curr.salario || curr.presupuesto) || 0), 0);
        item['suma_total'] = total;
      }
      return [item];
    }
  }

  private handleInsert(query: string, startTime: number): QueryResult {
    const tableMatch = query.match(/INSERT INTO\s+([a-zA-Z0-9_]+)/i);
    if (!tableMatch) throw new Error('Sintaxis de INSERT inválida.');
    const table = tableMatch[1].toLowerCase();

    if (!this.dbState[table]) {
      this.dbState[table] = [];
    }

    const newRecord: Record<string, any> = {
      id: Math.floor(100 + Math.random() * 900),
      nombre: 'Nuevo Registro',
      fecha_creacion: new Date().toISOString().split('T')[0]
    };

    // Extract values if simple
    const valuesMatch = query.match(/VALUES\s*\((.*?)\)/i);
    if (valuesMatch) {
      const vals = valuesMatch[1].split(',').map(v => v.trim().replace(/^['"]|['"]$/g, ''));
      if (table === 'empleados' && vals.length >= 2) {
        newRecord.nombre = vals[0] || 'Nuevo';
        newRecord.apellido = vals[1] || 'Empleado';
        newRecord.salario = Number(vals[2]) || 3000;
        newRecord.departamento_id = Number(vals[3]) || 1;
        newRecord.activo = true;
      }
    }

    this.dbState[table].push(newRecord);

    const endTime = performance.now();
    return {
      success: true,
      rows: [newRecord],
      columns: Object.keys(newRecord),
      rowCount: 1,
      affectedRows: 1,
      executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
      message: `INSERT 0 1 - Registro agregado con éxito a la tabla "${table}".`,
      queryType: 'INSERT'
    };
  }

  private handleUpdate(query: string, startTime: number): QueryResult {
    const tableMatch = query.match(/UPDATE\s+([a-zA-Z0-9_]+)/i);
    if (!tableMatch) throw new Error('Sintaxis de UPDATE inválida.');
    const table = tableMatch[1].toLowerCase();

    if (!this.dbState[table]) throw new Error(`Tabla "${table}" no encontrada.`);

    let count = 0;
    this.dbState[table] = this.dbState[table].map(row => {
      count++;
      return { ...row, salario: (row.salario || 3000) * 1.05 };
    });

    const endTime = performance.now();
    return {
      success: true,
      rows: [],
      columns: [],
      rowCount: 0,
      affectedRows: count,
      executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
      message: `UPDATE ${count} - Se actualizaron los registros en "${table}".`,
      queryType: 'UPDATE'
    };
  }

  private handleDelete(query: string, startTime: number): QueryResult {
    const tableMatch = query.match(/DELETE FROM\s+([a-zA-Z0-9_]+)/i);
    if (!tableMatch) throw new Error('Sintaxis de DELETE inválida.');
    const table = tableMatch[1].toLowerCase();

    if (!this.dbState[table]) throw new Error(`Tabla "${table}" no encontrada.`);

    const initialLength = this.dbState[table].length;
    // Filter active = false if present, or pop 1 item
    if (initialLength > 0) {
      this.dbState[table].pop();
    }

    const endTime = performance.now();
    return {
      success: true,
      rows: [],
      columns: [],
      rowCount: 0,
      affectedRows: 1,
      executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
      message: `DELETE 1 - Registro eliminado de "${table}".`,
      queryType: 'DELETE'
    };
  }

  private handleCreateView(query: string, startTime: number): QueryResult {
    const viewMatch = query.match(/CREATE VIEW\s+([a-zA-Z0-9_]+)\s+AS/i);
    const viewName = viewMatch ? viewMatch[1].toLowerCase() : 'vista_custom';

    if (!this.dbState.vistas) this.dbState.vistas = {};
    this.dbState[viewName] = [
      { id: 1, reporte: 'Vista creada satisfactoriamente', fecha: new Date().toISOString() }
    ];

    const endTime = performance.now();
    return {
      success: true,
      rows: [{ resultado: `Vista "${viewName}" creada exitosamente.` }],
      columns: ['resultado'],
      rowCount: 1,
      executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
      message: 'CREATE VIEW completado con éxito.',
      queryType: 'DDL'
    };
  }

  private handleCreateTable(query: string, startTime: number): QueryResult {
    const tableMatch = query.match(/CREATE TABLE\s+([a-zA-Z0-9_]+)/i);
    const tableName = tableMatch ? tableMatch[1].toLowerCase() : 'nueva_tabla';

    this.dbState[tableName] = [];

    const endTime = performance.now();
    return {
      success: true,
      rows: [{ resultado: `Tabla "${tableName}" creada.` }],
      columns: ['resultado'],
      rowCount: 1,
      executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
      message: `CREATE TABLE "${tableName}" ejecutado correctamente.`,
      queryType: 'DDL'
    };
  }

  private handleDropTable(query: string, startTime: number): QueryResult {
    const tableMatch = query.match(/DROP TABLE\s+([a-zA-Z0-9_]+)/i);
    const tableName = tableMatch ? tableMatch[1].toLowerCase() : 'tabla';

    delete this.dbState[tableName];

    const endTime = performance.now();
    return {
      success: true,
      rows: [{ resultado: `Tabla "${tableName}" eliminada.` }],
      columns: ['resultado'],
      rowCount: 1,
      executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
      message: `DROP TABLE "${tableName}" completado.`,
      queryType: 'DDL'
    };
  }

  public getTables(): string[] {
    return Object.keys(this.dbState).filter(k => k !== 'vistas');
  }

  public getViews(): string[] {
    return this.dbState.vistas ? Object.keys(this.dbState.vistas) : [];
  }

  public getTableSchema(tableName: string) {
    if (this.dbState[tableName] && this.dbState[tableName].length > 0) {
      const sample = this.dbState[tableName][0];
      return Object.keys(sample).map(key => ({
        column: key,
        type: typeof sample[key] === 'number' ? 'numeric' : typeof sample[key] === 'boolean' ? 'boolean' : 'varchar/text'
      }));
    }
    return [{ column: 'id', type: 'integer' }, { column: 'nombre', type: 'varchar(100)' }];
  }
}

export const sqlEngine = new SqlSandboxEngine();

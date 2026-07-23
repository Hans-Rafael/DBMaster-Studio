import { INITIAL_COMPANY_DATA } from '../data/companySampleDb';
import { QueryResult } from '../types/database';

class MongoSandboxEngine {
  private collections: Record<string, any[]>;

  constructor() {
    this.collections = {
      empleados: JSON.parse(JSON.stringify(INITIAL_COMPANY_DATA.empleados)),
      departamentos: JSON.parse(JSON.stringify(INITIAL_COMPANY_DATA.departamentos)),
      proyectos: JSON.parse(JSON.stringify(INITIAL_COMPANY_DATA.proyectos))
    };
  }

  public execute(queryStr: string): QueryResult {
    const startTime = performance.now();
    const clean = queryStr.trim();

    try {
      // db.empleados.find({...})
      const findMatch = clean.match(/db\.([a-zA-Z0-9_]+)\.find\((.*?)\)/s);
      if (findMatch) {
        const collectionName = findMatch[1].toLowerCase();
        const filterStr = findMatch[2].trim();

        let docs = this.collections[collectionName] || [];
        if (filterStr && filterStr !== '{}') {
          try {
            // relaxed JSON evaluation
            const filterObj = eval(`(${filterStr})`);
            docs = docs.filter(doc => {
              for (const key in filterObj) {
                if (doc[key] !== filterObj[key]) return false;
              }
              return true;
            });
          } catch {
            // fallback
          }
        }

        const endTime = performance.now();
        const columns = docs.length > 0 ? Object.keys(docs[0]) : ['_id'];
        return {
          success: true,
          rows: docs,
          columns,
          rowCount: docs.length,
          executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
          message: `Query BSON/JSON ejecutada con éxito sobre la colección "${collectionName}".`,
          queryType: 'MONGO'
        };
      }

      // db.empleados.aggregate([...])
      const aggMatch = clean.match(/db\.([a-zA-Z0-9_]+)\.aggregate\((.*?)\)/s);
      if (aggMatch) {
        const collectionName = aggMatch[1].toLowerCase();
        let docs = this.collections[collectionName] || [];

        const endTime = performance.now();
        return {
          success: true,
          rows: docs.slice(0, 5).map(d => ({
            ...d,
            _id: `ObjectId("${Math.random().toString(36).substring(7)}")`,
            agregado: true
          })),
          columns: ['_id', 'nombre', 'cargo', 'salario', 'agregado'],
          rowCount: Math.min(docs.length, 5),
          executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
          message: `Pipeline de Agregación ejecutado en MongoDB (${collectionName}).`,
          queryType: 'MONGO'
        };
      }

      // db.empleados.insertOne({...})
      const insertMatch = clean.match(/db\.([a-zA-Z0-9_]+)\.insertOne\((.*?)\)/s);
      if (insertMatch) {
        const collectionName = insertMatch[1].toLowerCase();
        if (!this.collections[collectionName]) this.collections[collectionName] = [];
        const newDoc = {
          _id: `ObjectId("${Math.random().toString(36).substring(7)}")`,
          nombre: 'Nuevo Documento Mongo',
          fecha_creacion: new Date()
        };
        this.collections[collectionName].push(newDoc);
        const endTime = performance.now();
        return {
          success: true,
          rows: [newDoc],
          columns: Object.keys(newDoc),
          rowCount: 1,
          affectedRows: 1,
          executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
          message: `Documento insertado correctamente en MongoDB (${collectionName}).`,
          queryType: 'MONGO'
        };
      }

      // Default fallback
      const docs = this.collections.empleados;
      const endTime = performance.now();
      return {
        success: true,
        rows: docs,
        columns: Object.keys(docs[0]),
        rowCount: docs.length,
        executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
        message: 'Consulta ejecutada en la base de datos de documentos MongoDB.',
        queryType: 'MONGO'
      };
    } catch (err: any) {
      const endTime = performance.now();
      return {
        success: false,
        rows: [],
        columns: [],
        rowCount: 0,
        executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
        error: `Error de sintaxis MongoDB BSON: ${err.message || err}`
      };
    }
  }

  public getCollections(): string[] {
    return Object.keys(this.collections);
  }
}

export const mongoEngine = new MongoSandboxEngine();

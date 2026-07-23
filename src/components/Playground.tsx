import React, { useState } from 'react';
import { EngineType, QueryResult } from '../types/database';
import { sqlEngine } from '../lib/sqlEngine';
import { mongoEngine } from '../lib/mongoEngine';
import { graphqlEngine } from '../lib/graphqlEngine';
import { Play, RotateCcw, Sparkles, Database, Leaf, Share2, Table, Clock, AlertCircle, CheckCircle2, Download } from 'lucide-react';

interface PlaygroundProps {
  initialCode?: string;
  initialEngine?: EngineType;
  onAskAiExplain: (query: string, engine: EngineType) => void;
}

export const Playground: React.FC<PlaygroundProps> = ({
  initialCode,
  initialEngine = 'postgresql',
  onAskAiExplain,
}) => {
  const [engine, setEngine] = useState<EngineType>(initialEngine);
  const [query, setQuery] = useState<string>(
    initialCode ||
      (initialEngine === 'mongodb'
        ? 'db.empleados.find({ salario: { $gte: 3000 } })'
        : initialEngine === 'graphql'
        ? 'query {\n  empleados {\n    id\n    nombre\n    cargo\n    salario\n    departamento {\n      nombre\n    }\n  }\n}'
        : 'SELECT e.id, e.nombre, e.apellido, e.salario, d.nombre AS departamento\nFROM empleados e\nJOIN departamentos d ON e.departamento_id = d.id\nWHERE e.activo = TRUE\nORDER BY e.salario DESC;')
  );

  const [result, setResult] = useState<QueryResult | null>(null);

  const handleEngineChange = (newEngine: EngineType) => {
    setEngine(newEngine);
    if (newEngine === 'postgresql') {
      setQuery('SELECT * FROM empleados WHERE salario > 3000;');
    } else if (newEngine === 'mongodb') {
      setQuery('db.empleados.find({ salario: { $gte: 3000 } })');
    } else {
      setQuery('query {\n  empleados {\n    id\n    nombre\n    cargo\n    salario\n  }\n}');
    }
    setResult(null);
  };

  const handleRunQuery = () => {
    if (engine === 'postgresql') {
      setResult(sqlEngine.execute(query));
    } else if (engine === 'mongodb') {
      setResult(mongoEngine.execute(query));
    } else {
      setResult(graphqlEngine.execute(query));
    }
  };

  const handleResetDb = () => {
    sqlEngine.resetDatabase();
    handleRunQuery();
  };

  const handleInsertSnippet = (snippet: string) => {
    setQuery(snippet);
  };

  const handleExportCsv = () => {
    if (!result || !result.rows || result.rows.length === 0) return;
    const headers = result.columns.join(',');
    const rowsStr = result.rows.map(r => result.columns.map(c => JSON.stringify(r[c] ?? '')).join(',')).join('\n');
    const blob = new Blob([`${headers}\n${rowsStr}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `query_result_${engine}.csv`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Top Engine Selector & Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Sandbox de Consultas Interactivas</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Ejecución Cliente Instantánea
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Ejecuta consultas en tiempo real sobre la base de datos de prueba <code className="text-blue-300">company_db</code>.
          </p>
        </div>

        {/* Engine Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-stretch sm:self-auto">
          <button
            onClick={() => handleEngineChange('postgresql')}
            className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              engine === 'postgresql'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>PostgreSQL</span>
          </button>

          <button
            onClick={() => handleEngineChange('mongodb')}
            className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              engine === 'mongodb'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Leaf className="w-4 h-4" />
            <span>MongoDB</span>
          </button>

          <button
            onClick={() => handleEngineChange('graphql')}
            className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              engine === 'graphql'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>GraphQL</span>
          </button>
        </div>
      </div>

      {/* Snippet Quick Buttons */}
      <div className="flex overflow-x-auto gap-2 text-xs scrollbar-none pb-1">
        <span className="text-slate-400 font-semibold self-center whitespace-nowrap mr-1">Plantillas rápidas:</span>
        {engine === 'postgresql' && (
          <>
            <button onClick={() => handleInsertSnippet("SELECT * FROM empleados WHERE activo = TRUE;")} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg whitespace-nowrap border border-slate-700">SELECT Empleados</button>
            <button onClick={() => handleInsertSnippet("SELECT d.nombre, COUNT(e.id), AVG(e.salario) FROM empleados e JOIN departamentos d ON e.departamento_id = d.id GROUP BY d.nombre;")} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg whitespace-nowrap border border-slate-700">JOIN & GROUP BY</button>
            <button onClick={() => handleInsertSnippet("BEGIN;\nUPDATE empleados SET salario = salario * 1.1 WHERE departamento_id = 1;\nCOMMIT;")} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg whitespace-nowrap border border-slate-700">Transacción BEGIN/COMMIT</button>
            <button onClick={() => handleInsertSnippet("SELECT nombre, salario, ROW_NUMBER() OVER (PARTITION BY departamento_id ORDER BY salario DESC) FROM empleados;")} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg whitespace-nowrap border border-slate-700">Window Function OVER</button>
          </>
        )}
        {engine === 'mongodb' && (
          <>
            <button onClick={() => handleInsertSnippet("db.empleados.find({ cargo: 'Desarrollador Senior' })")} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg whitespace-nowrap border border-slate-700">db.find() por Cargo</button>
            <button onClick={() => handleInsertSnippet("db.empleados.aggregate([{ $match: { activo: true } }, { $group: { _id: '$departamento_id', total: { $sum: 1 } } }])")} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg whitespace-nowrap border border-slate-700">Pipeline $aggregate</button>
          </>
        )}
        {engine === 'graphql' && (
          <>
            <button onClick={() => handleInsertSnippet("query {\n  empleados {\n    id\n    nombre\n    cargo\n    salario\n  }\n}")} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg whitespace-nowrap border border-slate-700">Query Básica</button>
            <button onClick={() => handleInsertSnippet("mutation {\n  crearEmpleado(nombre: \"Laura\", apellido: \"García\", email: \"laura@empresa.com\", departamentoId: \"1\") {\n    id\n    nombre\n  }\n}")} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg whitespace-nowrap border border-slate-700">Mutation Crear</button>
          </>
        )}
      </div>

      {/* Query Editor Box */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="text-xs font-bold text-slate-300 ml-2">Console Editor ({engine.toUpperCase()})</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleResetDb}
              title="Restablecer base de datos a estado inicial"
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restablecer BD</span>
            </button>

            <button
              onClick={() => onAskAiExplain(query, engine)}
              className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Explicar con IA</span>
            </button>

            <button
              onClick={handleRunQuery}
              className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold flex items-center space-x-2 shadow-lg shadow-blue-600/30 transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Ejecutar [Ctrl+Enter]</span>
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-950">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                handleRunQuery();
              }
            }}
            rows={7}
            className="w-full bg-transparent text-emerald-300 font-mono text-sm focus:outline-none resize-y leading-relaxed"
            placeholder="Escribe tu consulta aquí..."
          />
        </div>
      </div>

      {/* Query Result Output */}
      {result && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-0">
          {/* Result Header Bar */}
          <div className={`px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs font-medium ${
            result.success ? 'bg-emerald-950/20 text-emerald-300' : 'bg-red-950/20 text-red-300'
          }`}>
            <div className="flex items-center space-x-2">
              {result.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
              <span className="font-bold">
                {result.success ? 'Ejecución Existosa' : 'Error de Ejecución'}
              </span>
              {result.message && <span className="text-slate-300 hidden sm:inline">— {result.message}</span>}
            </div>

            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1 text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{result.executionTimeMs} ms</span>
              </span>
              <span className="flex items-center space-x-1 text-slate-400">
                <Table className="w-3.5 h-3.5" />
                <span>{result.rowCount} filas</span>
              </span>

              {result.success && result.rows.length > 0 && (
                <button
                  onClick={handleExportCsv}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center space-x-1 text-[11px]"
                >
                  <Download className="w-3 h-3" />
                  <span>CSV</span>
                </button>
              )}
            </div>
          </div>

          {/* Error Display */}
          {result.error && (
            <div className="p-4 bg-red-950/40 border-b border-red-900/50 text-red-200 font-mono text-xs">
              <strong>Detalle del Error:</strong>
              <p className="mt-1">{result.error}</p>
            </div>
          )}

          {/* Table Result Display */}
          {result.success && result.rows && result.rows.length > 0 ? (
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-950 text-slate-300 uppercase tracking-wider font-semibold sticky top-0 border-b border-slate-800">
                  <tr>
                    {result.columns.map((col, i) => (
                      <th key={i} className="px-4 py-3 border-r border-slate-800/60 last:border-0">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 font-mono text-slate-200">
                  {result.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-800/40 transition-colors">
                      {result.columns.map((col, cIdx) => (
                        <td key={cIdx} className="px-4 py-2.5 border-r border-slate-800/30 last:border-0 max-w-xs truncate">
                          {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col] ?? 'NULL')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : result.success ? (
            <div className="p-6 text-center text-xs text-slate-400">
              Consulta ejecutada correctamente sin filas para retornar (0 registros devueltos).
            </div>
          ) : null}
        </div>
      )}

    </div>
  );
};

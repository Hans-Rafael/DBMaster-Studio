import React, { useState } from 'react';
import { Layers, Database, Play, ArrowRight } from 'lucide-react';
import { sqlEngine } from '../lib/sqlEngine';
import { QueryResult } from '../types/database';

export const VisualJoinHelper: React.FC = () => {
  const [joinType, setJoinType] = useState<'INNER' | 'LEFT' | 'RIGHT' | 'FULL' | 'CROSS'>('INNER');
  const [result, setResult] = useState<QueryResult | null>(null);

  const getQueryForJoin = (type: typeof joinType) => {
    switch (type) {
      case 'INNER':
        return 'SELECT e.nombre, e.apellido, d.nombre AS departamento\nFROM empleados e\nINNER JOIN departamentos d ON e.departamento_id = d.id;';
      case 'LEFT':
        return 'SELECT e.nombre, e.apellido, d.nombre AS departamento\nFROM empleados e\nLEFT JOIN departamentos d ON e.departamento_id = d.id;';
      case 'RIGHT':
        return 'SELECT e.nombre, e.apellido, d.nombre AS departamento\nFROM empleados e\nRIGHT JOIN departamentos d ON e.departamento_id = d.id;';
      case 'FULL':
        return 'SELECT e.nombre, e.apellido, d.nombre AS departamento\nFROM empleados e\nFULL JOIN departamentos d ON e.departamento_id = d.id;';
      case 'CROSS':
        return 'SELECT e.nombre, d.nombre AS departamento\nFROM empleados e\nCROSS JOIN departamentos d;';
    }
  };

  const handleRunJoin = () => {
    const q = getQueryForJoin(joinType);
    setResult(sqlEngine.execute(q));
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-2">
        <div className="flex items-center space-x-2">
          <Layers className="w-6 h-6 text-sky-400" />
          <h1 className="text-xl font-bold text-white">Guía Visual de Tipos de JOIN en SQL</h1>
        </div>
        <p className="text-xs text-slate-300">
          Comprende intuitivamente cómo operan INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN y CROSS JOIN sobre la tabla de Empleados y Departamentos.
        </p>
      </div>

      {/* Selector Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {(['INNER', 'LEFT', 'RIGHT', 'FULL', 'CROSS'] as const).map((type) => (
          <button
            key={type}
            onClick={() => {
              setJoinType(type);
              setResult(null);
            }}
            className={`p-3 rounded-xl border text-xs font-bold transition-all ${
              joinType === type
                ? 'bg-sky-600/30 text-sky-200 border-sky-500/60 shadow-lg shadow-sky-600/20'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800'
            }`}
          >
            {type} JOIN
          </button>
        ))}
      </div>

      {/* Visual Diagram & Explanation Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        
        {/* Venn Diagram Representation */}
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col items-center justify-center min-h-[200px]">
          <div className="relative w-48 h-32 flex items-center justify-center">
            {/* Left Circle (Empleados) */}
            <div
              className={`absolute left-4 w-28 h-28 rounded-full border-2 flex items-center justify-start pl-3 text-xs font-bold transition-all ${
                joinType === 'LEFT' || joinType === 'INNER' || joinType === 'FULL' || joinType === 'CROSS'
                  ? 'bg-sky-500/30 border-sky-400 text-sky-200'
                  : 'bg-slate-800/40 border-slate-700 text-slate-500'
              }`}
            >
              Empleados
            </div>

            {/* Right Circle (Departamentos) */}
            <div
              className={`absolute right-4 w-28 h-28 rounded-full border-2 flex items-center justify-end pr-3 text-xs font-bold transition-all ${
                joinType === 'RIGHT' || joinType === 'INNER' || joinType === 'FULL' || joinType === 'CROSS'
                  ? 'bg-indigo-500/30 border-indigo-400 text-indigo-200'
                  : 'bg-slate-800/40 border-slate-700 text-slate-500'
              }`}
            >
              Deptos
            </div>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 mt-4">
            {joinType === 'INNER' && 'Solo filas coincidentes en ambas tablas.'}
            {joinType === 'LEFT' && 'Todas las filas de Empleados + coincidencias de Deptos.'}
            {joinType === 'RIGHT' && 'Todas las filas de Deptos + coincidencias de Empleados.'}
            {joinType === 'FULL' && 'Todas las filas de ambas tablas (coincidentes o con NULL).'}
            {joinType === 'CROSS' && 'Producto cartesiano completo (N x M filas).'}
          </span>
        </div>

        {/* Code & Execute Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Database className="w-4 h-4 text-sky-400" />
            <span>Consulta SQL Generada:</span>
          </h3>

          <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-sky-300 leading-relaxed overflow-x-auto">
            <code>{getQueryForJoin(joinType)}</code>
          </pre>

          <button
            onClick={handleRunJoin}
            className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-sky-600/30 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Simular {joinType} JOIN sobre Base de Prueba</span>
          </button>
        </div>
      </div>

      {/* Query Results */}
      {result && result.rows && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Resultado de la Combinación ({result.rowCount} registros)
          </h3>

          <div className="overflow-x-auto bg-slate-950 rounded-xl border border-slate-800">
            <table className="w-full text-left font-mono text-xs text-slate-200">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
                <tr>
                  {result.columns.map((c, i) => (
                    <th key={i} className="p-2.5">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {result.rows.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-800/30">
                    {result.columns.map((c, j) => (
                      <td key={j} className="p-2.5">
                        {r[c] === null || r[c] === undefined ? (
                          <span className="text-red-400 font-semibold bg-red-950/40 px-1.5 py-0.5 rounded">NULL</span>
                        ) : (
                          String(r[c])
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

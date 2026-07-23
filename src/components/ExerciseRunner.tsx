import React, { useState } from 'react';
import { PracticalExercise, QueryResult, EngineType } from '../types/database';
import { sqlEngine } from '../lib/sqlEngine';
import { mongoEngine } from '../lib/mongoEngine';
import { graphqlEngine } from '../lib/graphqlEngine';
import { Code2, Play, Lightbulb, CheckCircle2, Sparkles, Terminal, ArrowRight, Eye } from 'lucide-react';

interface ExerciseRunnerProps {
  exercises: PracticalExercise[];
  onExerciseCompleted: (exerciseId: string) => void;
  onAskAiGrade: (userCode: string, objective: string, engine: EngineType) => void;
}

export const ExerciseRunner: React.FC<ExerciseRunnerProps> = ({
  exercises,
  onExerciseCompleted,
  onAskAiGrade,
}) => {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(exercises[0]?.id || '');
  const activeExercise = exercises.find(e => e.id === selectedExerciseId) || exercises[0];

  const [userCode, setUserCode] = useState<string>(activeExercise?.initialCode || '');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  const handleSelectExercise = (exId: string) => {
    setSelectedExerciseId(exId);
    const ex = exercises.find(e => e.id === exId);
    setUserCode(ex?.initialCode || '');
    setResult(null);
    setShowSolution(false);
    setShowHint(false);
  };

  const handleRunExercise = () => {
    if (!activeExercise) return;
    let res: QueryResult;
    if (activeExercise.engine === 'postgresql') {
      res = sqlEngine.execute(userCode);
    } else if (activeExercise.engine === 'mongodb') {
      res = mongoEngine.execute(userCode);
    } else {
      res = graphqlEngine.execute(userCode);
    }
    setResult(res);

    if (res.success) {
      onExerciseCompleted(activeExercise.id);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Exercise Selector Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <Code2 className="w-5 h-5 text-purple-400" />
            <span>Ejercicios Prácticos de Código</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Resuelve desafíos prácticos escribiendo consultas reales en el editor interactivo.</p>
        </div>

        <select
          value={selectedExerciseId}
          onChange={(e) => handleSelectExercise(e.target.value)}
          className="bg-slate-950 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500"
        >
          {exercises.map((ex) => (
            <option key={ex.id} value={ex.id}>
              [{ex.difficulty.toUpperCase()}] {ex.title}
            </option>
          ))}
        </select>
      </div>

      {/* Task Instruction Card */}
      {activeExercise && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">{activeExercise.title}</h2>
            <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-[11px] font-bold uppercase">
              {activeExercise.difficulty}
            </span>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
            {activeExercise.instructions}
          </p>

          {/* Hints & Solution Toggles */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setShowHint(!showHint)}
              className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold flex items-center space-x-1.5"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>{showHint ? 'Ocultar Pistas' : 'Ver Pista'}</span>
            </button>

            <button
              onClick={() => setShowSolution(!showSolution)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center space-x-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showSolution ? 'Ocultar Solución' : 'Ver Solución Oficial'}</span>
            </button>

            <button
              onClick={() => onAskAiGrade(userCode, activeExercise.instructions, activeExercise.engine)}
              className="px-3.5 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold flex items-center space-x-1.5 ml-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Evaluar con IA</span>
            </button>
          </div>

          {/* Hint Display */}
          {showHint && activeExercise.hints && (
            <div className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-xl text-xs text-amber-200 space-y-1">
              <strong className="text-amber-300 font-bold block mb-1">💡 Pistas para Resolver:</strong>
              <ul className="list-disc list-inside space-y-1">
                {activeExercise.hints.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Solution Display */}
          {showSolution && (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-2">
              <strong className="text-emerald-400 font-bold block">✅ Solución Oficial del Ejercicio:</strong>
              <pre className="p-3 bg-slate-900 rounded-lg text-emerald-300 font-mono overflow-x-auto">
                <code>{activeExercise.solutionCode}</code>
              </pre>
              <p className="text-slate-400 italic">{activeExercise.solutionExplanation}</p>
            </div>
          )}
        </div>
      )}

      {/* Code Editor Box */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-purple-400" />
            <span>Editor de Código de Ejercicio</span>
          </span>

          <button
            onClick={handleRunExercise}
            className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold flex items-center space-x-2 shadow-lg shadow-purple-600/30 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Verificar Solución</span>
          </button>
        </div>

        <div className="p-4 bg-slate-950">
          <textarea
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            rows={8}
            className="w-full bg-transparent text-emerald-300 font-mono text-sm focus:outline-none resize-y leading-relaxed"
            placeholder="Escribe la consulta solución..."
          />
        </div>
      </div>

      {/* Result Verification */}
      {result && (
        <div className={`p-5 rounded-2xl border text-xs space-y-2 ${
          result.success ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-red-950/40 border-red-500/40 text-red-200'
        }`}>
          <div className="flex items-center space-x-2 text-sm font-bold">
            {result.success ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Terminal className="w-5 h-5 text-red-400" />}
            <span>{result.success ? '¡Excelente! Ejercicio Ejecutado y Validado' : 'Falló la ejecución'}</span>
          </div>

          <p>{result.message || result.error}</p>

          {result.success && result.rows && result.rows.length > 0 && (
            <div className="mt-3 overflow-x-auto max-h-48 bg-slate-950 p-2 rounded-xl border border-slate-800">
              <table className="w-full text-left font-mono text-[11px] text-slate-200">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    {result.columns.map((c, i) => <th key={i} className="p-2">{c}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((r, i) => (
                    <tr key={i} className="border-b border-slate-800/40">
                      {result.columns.map((c, j) => <td key={j} className="p-2">{String(r[c] ?? '')}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

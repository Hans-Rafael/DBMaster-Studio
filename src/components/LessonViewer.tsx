import React, { useState } from 'react';
import { Topic, Module } from '../types/database';
import { CheckCircle2, Copy, Check, Terminal, Sparkles, BookOpen, Layers, Code2, ArrowRight } from 'lucide-react';

interface LessonViewerProps {
  topic: Topic;
  module: Module;
  onMarkCompleted: (topicId: string) => void;
  isCompleted: boolean;
  onOpenPlaygroundWithCode: (code: string, engine: 'postgresql' | 'mongodb' | 'graphql') => void;
  onAskAiTutor: (context: string) => void;
  onNextTopic?: () => void;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({
  topic,
  module,
  onMarkCompleted,
  isCompleted,
  onOpenPlaygroundWithCode,
  onAskAiTutor,
  onNextTopic,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-[10px] font-bold uppercase tracking-widest">
            {module.title}
          </span>

          <button
            onClick={() => onMarkCompleted(topic.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              isCompleted
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? '✓ Lección Completada (+50 XP)' : 'Marcar como Completada'}</span>
          </button>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
          {topic.title}
        </h1>
        {topic.subtitle && (
          <p className="text-sm font-medium text-blue-400 mt-1">{topic.subtitle}</p>
        )}
        <p className="text-sm text-slate-300 mt-3 leading-relaxed">{topic.description}</p>
      </div>

      {/* Key Summary Points */}
      {topic.summaryPoints && topic.summaryPoints.length > 0 && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3 flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>Puntos Clave de la Lección</span>
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-slate-300">
            {topic.summaryPoints.map((point, idx) => (
              <li key={idx} className="flex items-start space-x-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-blue-400 font-bold shrink-0 mt-0.5">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Lesson Theory Markdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-200 text-sm leading-relaxed space-y-4 shadow-sm">
        <div className="prose prose-invert max-w-none space-y-4">
          {topic.theoryMarkdown.split('\n').map((line, idx) => {
            const trimmedLine = line.trim();
            
            if (trimmedLine.startsWith('### ')) {
              return <h3 key={idx} className="text-lg font-bold text-white border-b border-slate-800 pb-2 mt-4 mb-3">{trimmedLine.replace('### ', '')}</h3>;
            }
            if (trimmedLine.startsWith('#### ')) {
              return <h4 key={idx} className="text-sm font-bold text-blue-300 mt-4 mb-2">{trimmedLine.replace('#### ', '')}</h4>;
            }
            if (trimmedLine.startsWith('- ')) {
              return (
                <li key={idx} className="list-disc list-inside space-y-1 pl-2 text-slate-300 text-xs sm:text-sm leading-relaxed ml-4">
                  <span dangerouslySetInnerHTML={{ 
                    __html: trimmedLine.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>') 
                  }} />
                </li>
              );
            }
            if (/^\d+\.\s/.test(trimmedLine)) {
              return (
                <li key={idx} className="list-decimal list-inside space-y-1 pl-2 text-slate-300 text-xs sm:text-sm leading-relaxed ml-4">
                  <span dangerouslySetInnerHTML={{ 
                    __html: trimmedLine.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>') 
                  }} />
                </li>
              );
            }
            if (trimmedLine === '') {
              return <div key={idx} className="h-2" />;
            }
            return (
              <p key={idx} className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                <span dangerouslySetInnerHTML={{ 
                  __html: trimmedLine.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>') 
                }} />
              </p>
            );
          })}
        </div>
      </div>

      {/* Code Examples with Live Try In Playground */}
      {topic.codeExamples && topic.codeExamples.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Code2 className="w-5 h-5 text-emerald-400" />
            <span>Ejemplos de Código Prácticos</span>
          </h3>

          {topic.codeExamples.map((ex, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
              <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">{ex.title}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopyCode(ex.code, idx)}
                    className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors text-xs flex items-center space-x-1"
                  >
                    {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIndex === idx ? 'Copiado' : 'Copiar'}</span>
                  </button>

                  <button
                    onClick={() => onOpenPlaygroundWithCode(ex.code, module.engine)}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-md shadow-emerald-600/20"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Probar en Sandbox</span>
                  </button>
                </div>
              </div>

              <div className="p-4 overflow-x-auto bg-slate-950">
                <pre className="text-xs font-mono text-emerald-300 leading-relaxed whitespace-pre-wrap">
                  <code>{ex.code}</code>
                </pre>
              </div>

              {ex.explanation && (
                <div className="bg-slate-900/60 px-4 py-2.5 border-t border-slate-800/80 text-xs text-slate-400 italic">
                  💡 {ex.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* DBeaver Tip or Terminal Command Note */}
      {topic.dbeaverNote && (
        <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-200 flex items-start space-x-3">
          <Layers className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300 font-bold block mb-1">Tip DBeaver GUI:</strong>
            <p className="text-slate-300">{topic.dbeaverNote}</p>
          </div>
        </div>
      )}

      {topic.terminalCommand && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300">psql:</span>
            <span className="text-emerald-300">{topic.terminalCommand}</span>
          </div>
          <button
            onClick={() => handleCopyCode(topic.terminalCommand!, 99)}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Ask AI Tutor Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-sm font-bold text-white flex items-center justify-center sm:justify-start space-x-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>¿Tienes dudas sobre esta lección?</span>
          </h4>
          <p className="text-xs text-slate-300">Consulta a nuestro Tutor IA especializado en PostgreSQL para una explicación personalizada.</p>
        </div>

        <button
          onClick={() => onAskAiTutor(`Explicación de la lección: ${topic.title}. ${topic.description}`)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold whitespace-nowrap shadow-md shadow-blue-600/30"
        >
          Preguntar a la IA
        </button>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          onClick={() => onMarkCompleted(topic.id)}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold ${
            isCompleted ? 'bg-emerald-600/20 text-emerald-300' : 'bg-blue-600 text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isCompleted ? 'Lección Completada' : 'Marcar como Completada'}</span>
        </button>

        {onNextTopic && (
          <button
            onClick={onNextTopic}
            className="flex items-center space-x-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            <span>Siguiente Lección</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
};

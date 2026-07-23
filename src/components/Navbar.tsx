import React from 'react';
import { Database, FileJson, Network, Sparkles, Award, RotateCcw } from 'lucide-react';
import { EngineType } from '../types/database';

interface NavbarProps {
  activeEngine: EngineType;
  onSelectEngine: (engine: EngineType) => void;
  activeTab: string;
  onSelectTab: (tab: any) => void;
  userXp: number;
  completedTopicsCount: number;
  totalTopicsCount: number;
  onResetDb: () => void;
  onOpenAiTutor: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeEngine,
  onSelectEngine,
  activeTab,
  onSelectTab,
  userXp,
  completedTopicsCount,
  totalTopicsCount,
  onResetDb,
  onOpenAiTutor,
}) => {
  const progressPercent = Math.round((completedTopicsCount / (totalTopicsCount || 1)) * 100);

  return (
    <header className="h-16 border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-tr from-blue-700 to-indigo-500 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-lg shadow-blue-900/40">
          DB
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight uppercase text-white">
              DBMaster <span className="text-blue-500 font-extrabold">Studio</span>
            </span>
            <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-bold rounded-full uppercase tracking-wider hidden sm:inline-block">
              Bento Grid Studio
            </span>
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 border border-slate-800 rounded-xl">
        <button
          onClick={() => onSelectEngine('postgresql')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeEngine === 'postgresql'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          PostgreSQL
        </button>

        <button
          onClick={() => onSelectEngine('mongodb')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeEngine === 'mongodb'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <FileJson className="w-3.5 h-3.5" />
          MongoDB
        </button>

        <button
          onClick={() => onSelectEngine('graphql')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeEngine === 'graphql'
              ? 'bg-pink-600 text-white shadow-md shadow-pink-900/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Network className="w-3.5 h-3.5" />
          GraphQL
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenAiTutor}
          className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-900/40 border border-blue-400/30 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
          <span className="hidden lg:inline">Tutor IA</span>
        </button>

        <button
          onClick={onResetDb}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl border border-slate-800 transition-all"
          title="Restablecer Datos"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="hidden xl:flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-xs font-bold text-yellow-400">{userXp} XP</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">PROGRESO: {progressPercent}%</span>
          </div>
        </div>
      </div>
    </header>
  );
};

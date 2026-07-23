import React from 'react';
import { Database, Sparkles, BookOpen, Terminal, HelpCircle, Award, Code2, Layers, LogOut } from 'lucide-react';
import { UserProgress } from '../types/database';

interface HeaderProps {
  activeTab: 'study' | 'playground' | 'quizzes' | 'exercises' | 'joins' | 'python';
  setActiveTab: (tab: 'study' | 'playground' | 'quizzes' | 'exercises' | 'joins' | 'python') => void;
  userProgress: UserProgress;
  onOpenAiTutor: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userProgress,
  onOpenAiTutor,
  onLogout,
}) => {
  const totalCompleted = userProgress.completedTopics.length;
  const totalExercises = userProgress.completedExercises.length;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 border-b border-slate-800 text-slate-100 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center space-x-4 cursor-pointer" onClick={() => setActiveTab('study')}>
            <div className="p-3 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl shadow-lg shadow-blue-500/30 text-white">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight uppercase text-white">
                  DBMaster <span className="text-blue-400 font-black">Studio</span>
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-full hidden sm:inline-block">
                  Plataforma para Aprender Bases de Datos
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block">PostgreSQL · MongoDB · GraphQL Studio</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('study')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'study'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>1. Teoría & Módulos</span>
            </button>

            <button
              onClick={() => setActiveTab('playground')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'playground'
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>2. Playground SQL</span>
            </button>

            <button
              onClick={() => setActiveTab('quizzes')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'quizzes'
                  ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>3. Mini-Exámenes</span>
            </button>

            <button
              onClick={() => setActiveTab('exercises')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'exercises'
                  ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>4. Ejercicios Prácticos</span>
            </button>

            <button
              onClick={() => setActiveTab('joins')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'joins'
                  ? 'bg-sky-600/20 text-sky-400 border border-sky-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Guía JOINs</span>
            </button>
          </nav>

          {/* Action Buttons & Progress Badge */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300">
                <strong className="text-white">{totalCompleted}</strong> temas · <strong className="text-emerald-400">{totalExercises}</strong> ejercicios
              </span>
            </div>

            <button
              onClick={onOpenAiTutor}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md shadow-blue-600/20 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Tutor IA Gemini</span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            )}
          </div>

        </div>

        {/* Mobile Tab Navigation bar */}
        <div className="md:hidden flex overflow-x-auto py-2 space-x-2 border-t border-slate-800 text-xs scrollbar-none">
          <button
            onClick={() => setActiveTab('study')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
              activeTab === 'study' ? 'bg-blue-600 text-white' : 'text-slate-400 bg-slate-800/40'
            }`}
          >
            Teoría
          </button>
          <button
            onClick={() => setActiveTab('playground')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
              activeTab === 'playground' ? 'bg-emerald-600 text-white' : 'text-slate-400 bg-slate-800/40'
            }`}
          >
            Playground
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
              activeTab === 'quizzes' ? 'bg-amber-600 text-white' : 'text-slate-400 bg-slate-800/40'
            }`}
          >
            Exámenes
          </button>
          <button
            onClick={() => setActiveTab('exercises')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
              activeTab === 'exercises' ? 'bg-purple-600 text-white' : 'text-slate-400 bg-slate-800/40'
            }`}
          >
            Ejercicios
          </button>
          <button
            onClick={() => setActiveTab('joins')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
              activeTab === 'joins' ? 'bg-sky-600 text-white' : 'text-slate-400 bg-slate-800/40'
            }`}
          >
            JOINs
          </button>
          <button
            onClick={() => setActiveTab('python')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
              activeTab === 'python' ? 'bg-teal-600 text-white' : 'text-slate-400 bg-slate-800/40'
            }`}
          >
            Python
          </button>
        </div>

      </div>
    </header>
  );
};

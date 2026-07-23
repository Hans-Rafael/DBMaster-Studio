import React from 'react';
import { Module, Topic, UserProgress } from '../types/database';
import { CheckCircle2, Circle, ChevronRight, Database, Leaf, Share2, Award } from 'lucide-react';

interface ModuleListProps {
  modules: Module[];
  selectedTopic: Topic | null;
  onSelectTopic: (topic: Topic, module: Module) => void;
  userProgress: UserProgress;
}

export const ModuleList: React.FC<ModuleListProps> = ({
  modules,
  selectedTopic,
  onSelectTopic,
  userProgress,
}) => {
  const getEngineBadge = (engine: Module['engine']) => {
    switch (engine) {
      case 'postgresql':
        return (
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Database className="w-3 h-3" />
            <span>PostgreSQL</span>
          </span>
        );
      case 'mongodb':
        return (
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Leaf className="w-3 h-3" />
            <span>MongoDB</span>
          </span>
        );
      case 'graphql':
        return (
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-pink-500/10 text-pink-400 border border-pink-500/20">
            <Share2 className="w-3 h-3" />
            <span>GraphQL</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full h-full bg-slate-900/60 border-r border-slate-800 text-slate-200 overflow-y-auto custom-scrollbar">
      <div className="p-4 border-b border-slate-800 bg-slate-950/80">
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-1 flex items-center justify-between">
          <span>Mapa Curricular</span>
          <Award className="w-4 h-4 text-blue-400" />
        </h2>
        <p className="text-[11px] text-slate-400 font-mono">8 Módulos PostgreSQL + NoSQL & GraphQL</p>
      </div>

      <div className="p-3 space-y-3">
        {modules.map((mod) => {
          const completedInModule = mod.topics.filter(t => userProgress.completedTopics.includes(t.id)).length;
          const isFullyCompleted = completedInModule === mod.topics.length && mod.topics.length > 0;

          return (
            <div key={mod.id} className="p-3.5 bg-slate-900/90 border border-slate-800/80 rounded-2xl shadow-sm space-y-2">
              {/* Module Header */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  {getEngineBadge(mod.engine)}
                  <span className="text-[10px] font-mono text-slate-400">
                    {completedInModule}/{mod.topics.length}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-white mt-1.5 line-clamp-1">{mod.title}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{mod.shortDescription}</p>
              </div>

              {/* Module Topics List */}
              <div className="space-y-1 pt-1 border-t border-slate-800/60">
                {mod.topics.map((topic) => {
                  const isSelected = selectedTopic?.id === topic.id;
                  const isCompleted = userProgress.completedTopics.includes(topic.id);

                  return (
                    <button
                      key={topic.id}
                      onClick={() => onSelectTopic(topic, mod)}
                      className={`w-full text-left px-2.5 py-2 rounded-xl text-xs transition-all flex items-start space-x-2 group ${
                        isSelected
                          ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-900/50'
                          : 'hover:bg-slate-800/80 text-slate-300'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isCompleted ? (
                          <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-400'}`} />
                        ) : (
                          <Circle className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-600 group-hover:text-slate-400'}`} />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={`line-clamp-2 text-[11px] leading-snug ${isSelected ? 'font-bold text-white' : 'text-slate-300'}`}>
                          {topic.title}
                        </p>
                      </div>

                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 mt-0.5 transition-transform ${isSelected ? 'text-white translate-x-0.5' : 'text-slate-600 opacity-0 group-hover:opacity-100'}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

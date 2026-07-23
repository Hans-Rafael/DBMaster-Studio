import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ModuleList } from './components/ModuleList';
import { LessonViewer } from './components/LessonViewer';
import { Playground } from './components/Playground';
import { QuizRunner } from './components/QuizRunner';
import { ExerciseRunner } from './components/ExerciseRunner';
import { AiTutorModal } from './components/AiTutorModal';
import { VisualJoinHelper } from './components/VisualJoinHelper';
import { PythonConnectorsView } from './components/PythonConnectorsView';
import { LoginScreen } from './components/LoginScreen';

import { POSTGRESQL_MODULES } from './data/modulesPostgreSQL';
import { MONGO_GRAPHQL_MODULES } from './data/modulesMongoGraphQL';
import { QUIZZES_DATA } from './data/quizzesData';
import { PRACTICAL_EXERCISES } from './data/exercisesData';
import { Module, Topic, UserProgress, EngineType } from './types/database';

export function App() {
  const allModules: Module[] = [...POSTGRESQL_MODULES, ...MONGO_GRAPHQL_MODULES];

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error al hacer logout:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  const [activeTab, setActiveTab] = useState<'study' | 'playground' | 'quizzes' | 'exercises' | 'joins' | 'python'>('study');
  
  const [selectedModule, setSelectedModule] = useState<Module>(allModules[0]);
  const [selectedTopic, setSelectedTopic] = useState<Topic>(allModules[0].topics[0]);

  // Playground state overrides
  const [playgroundCode, setPlaygroundCode] = useState<string>('');
  const [playgroundEngine, setPlaygroundEngine] = useState<EngineType>('postgresql');

  // AI Tutor Modal state
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [aiContext, setAiContext] = useState<string>('');

  // User Progress persisted in localStorage
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('dbmaster_user_progress');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      completedTopics: [],
      completedExercises: [],
      quizScores: {},
    };
  });

  useEffect(() => {
    localStorage.setItem('dbmaster_user_progress', JSON.stringify(userProgress));
  }, [userProgress]);

  const handleSelectTopic = (topic: Topic, module: Module) => {
    setSelectedTopic(topic);
    setSelectedModule(module);
    setActiveTab('study');
  };

  const handleMarkTopicCompleted = (topicId: string) => {
    setUserProgress(prev => {
      if (prev.completedTopics.includes(topicId)) return prev;
      return {
        ...prev,
        completedTopics: [...prev.completedTopics, topicId],
      };
    });
  };

  const handleOpenPlaygroundWithCode = (code: string, engine: EngineType) => {
    setPlaygroundCode(code);
    setPlaygroundEngine(engine);
    setActiveTab('playground');
  };

  const handleAskAiTutor = (context: string) => {
    setAiContext(context);
    setIsAiModalOpen(true);
  };

  const handleQuizCompleted = (moduleId: string, scorePercentage: number) => {
    setUserProgress(prev => ({
      ...prev,
      quizScores: {
        ...prev.quizScores,
        [moduleId]: scorePercentage,
      },
    }));
  };

  const handleExerciseCompleted = (exerciseId: string) => {
    setUserProgress(prev => {
      if (prev.completedExercises.includes(exerciseId)) return prev;
      return {
        ...prev,
        completedExercises: [...prev.completedExercises, exerciseId],
      };
    });
  };

  // Find next topic for lesson viewer navigation
  const getNextTopic = () => {
    const currentTopics = selectedModule.topics;
    const currentIdx = currentTopics.findIndex(t => t.id === selectedTopic.id);
    if (currentIdx < currentTopics.length - 1) {
      return { topic: currentTopics[currentIdx + 1], module: selectedModule };
    }
    const currentModuleIdx = allModules.findIndex(m => m.id === selectedModule.id);
    if (currentModuleIdx < allModules.length - 1) {
      const nextMod = allModules[currentModuleIdx + 1];
      return { topic: nextMod.topics[0], module: nextMod };
    }
    return null;
  };

  const nextTopicInfo = getNextTopic();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-500 selection:text-white">
      
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProgress={userProgress}
        onOpenAiTutor={() => handleAskAiTutor('Consulta libre sobre bases de datos')}
        onLogout={handleLogout}
      />

      {/* Main Content Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar for Study Mode */}
        {activeTab === 'study' && (
          <aside className="w-80 shrink-0 hidden lg:block h-[calc(100vh-4rem)]">
            <ModuleList
              modules={allModules}
              selectedTopic={selectedTopic}
              onSelectTopic={handleSelectTopic}
              userProgress={userProgress}
            />
          </aside>
        )}

        {/* Dynamic Center View */}
        <main className="flex-1 overflow-y-auto min-w-0 pb-12">
          
          {activeTab === 'study' && selectedTopic && (
            <div>
              {/* Mobile Module Selector Bar */}
              <div className="lg:hidden p-4 bg-slate-900 border-b border-slate-800">
                <label className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wider">
                  Seleccionar Lección:
                </label>
                <select
                  value={selectedTopic.id}
                  onChange={(e) => {
                    const foundMod = allModules.find(m => m.topics.some(t => t.id === e.target.value));
                    const foundTop = foundMod?.topics.find(t => t.id === e.target.value);
                    if (foundMod && foundTop) {
                      handleSelectTopic(foundTop, foundMod);
                    }
                  }}
                  className="w-full bg-slate-950 text-slate-200 text-xs font-semibold p-2.5 rounded-xl border border-slate-800"
                >
                  {allModules.map(m => (
                    <optgroup key={m.id} label={m.title}>
                      {m.topics.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.title}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <LessonViewer
                topic={selectedTopic}
                module={selectedModule}
                onMarkCompleted={handleMarkTopicCompleted}
                isCompleted={userProgress.completedTopics.includes(selectedTopic.id)}
                onOpenPlaygroundWithCode={handleOpenPlaygroundWithCode}
                onAskAiTutor={handleAskAiTutor}
                onNextTopic={
                  nextTopicInfo
                    ? () => handleSelectTopic(nextTopicInfo.topic, nextTopicInfo.module)
                    : undefined
                }
              />
            </div>
          )}

          {activeTab === 'playground' && (
            <Playground
              initialCode={playgroundCode}
              initialEngine={playgroundEngine}
              onAskAiExplain={(q, eng) =>
                handleAskAiTutor(`Explicación de consulta ${eng.toUpperCase()}:\n${q}`)
              }
            />
          )}

          {activeTab === 'quizzes' && (
            <QuizRunner
              quizzes={QUIZZES_DATA}
              onQuizCompleted={handleQuizCompleted}
            />
          )}

          {activeTab === 'exercises' && (
            <ExerciseRunner
              exercises={PRACTICAL_EXERCISES}
              onExerciseCompleted={handleExerciseCompleted}
              onAskAiGrade={(code, obj, eng) =>
                handleAskAiTutor(`Evaluación de código ${eng.toUpperCase()}:\nCódigo:\n${code}\n\nObjetivo: ${obj}`)
              }
            />
          )}

          {activeTab === 'joins' && <VisualJoinHelper />}

          {activeTab === 'python' && <PythonConnectorsView />}

        </main>
      </div>

      {/* AI Tutor Modal */}
      <AiTutorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        contextMessage={aiContext}
      />

    </div>
  );
}

export default App;

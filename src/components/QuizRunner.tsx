import React, { useState } from 'react';
import { Quiz } from '../types/database';
import { CheckCircle2, XCircle, HelpCircle, Award, RotateCcw, ArrowRight } from 'lucide-react';

interface QuizRunnerProps {
  quizzes: Quiz[];
  onQuizCompleted: (moduleId: string, scorePercentage: number) => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({
  quizzes,
  onQuizCompleted,
}) => {
  const [selectedQuizId, setSelectedQuizId] = useState<string>(quizzes[0]?.moduleId || '');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const activeQuiz = quizzes.find(q => q.moduleId === selectedQuizId) || quizzes[0];
  const currentQuestion = activeQuiz?.questions[currentQuestionIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (submitted) return;
    setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: optionIndex }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setSubmitted(true);
    let correctCount = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswerIndex) {
        correctCount++;
      }
    });
    const percentage = Math.round((correctCount / activeQuiz.questions.length) * 100);
    onQuizCompleted(activeQuiz.moduleId, percentage);
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setSubmitted(false);
  };

  const scorePercentage = submitted
    ? Math.round(
        (activeQuiz.questions.filter((q, idx) => userAnswers[idx] === q.correctAnswerIndex).length /
          activeQuiz.questions.length) *
          100
      )
    : 0;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Quiz Selector Dropdown / Pills */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              <span>Mini-Exámenes Teóricos Interactivos</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Evalúa tu comprensión teórica de cada módulo con retroalimentación inmediata.</p>
          </div>

          {/* Module Selector */}
          <select
            value={selectedQuizId}
            onChange={(e) => {
              setSelectedQuizId(e.target.value);
              handleResetQuiz();
            }}
            className="bg-slate-950 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
          >
            {quizzes.map((q) => (
              <option key={q.moduleId} value={q.moduleId}>
                {q.title}
              </option>
            ))}
          </select>
        </div>

        {/* Quiz Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Pregunta {currentQuestionIndex + 1} de {activeQuiz.questions.length}</span>
            <span>{Math.round(((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100)}% avance</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-400 h-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quiz Question Box */}
      {currentQuestion && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
            {currentQuestionIndex + 1}. {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, optIdx) => {
              const isSelected = userAnswers[currentQuestionIndex] === optIdx;
              const isCorrect = currentQuestion.correctAnswerIndex === optIdx;

              let optionStyle = 'bg-slate-950 hover:bg-slate-800/80 text-slate-300 border-slate-800';
              if (submitted) {
                if (isCorrect) {
                  optionStyle = 'bg-emerald-950/60 text-emerald-200 border-emerald-500/60 font-semibold';
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'bg-red-950/60 text-red-200 border-red-500/60';
                }
              } else if (isSelected) {
                optionStyle = 'bg-blue-600/20 text-blue-200 border-blue-500/60 font-semibold';
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={submitted}
                  className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${optionStyle}`}
                >
                  <span>{option}</span>
                  {submitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {submitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation if submitted */}
          {submitted && (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-1">
              <strong className="text-amber-400 font-bold block">💡 Explicación Didáctica:</strong>
              <p>{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded-xl text-xs font-semibold"
            >
              Anterior
            </button>

            {currentQuestionIndex < activeQuiz.questions.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5"
              >
                <span>Siguiente</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : !submitted ? (
              <button
                onClick={handleSubmitQuiz}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30"
              >
                Finalizar Examen
              </button>
            ) : (
              <button
                onClick={handleResetQuiz}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Repetir Examen</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quiz Final Score Banner */}
      {submitted && (
        <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 text-center space-y-3 shadow-xl">
          <Award className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="text-xl font-extrabold text-white">Resultado del Mini-Examen</h3>
          <p className="text-3xl font-black text-amber-400">{scorePercentage}% de Aciertos</p>
          <p className="text-xs text-slate-300">
            {scorePercentage >= 80
              ? '¡Excelente trabajo! Has demostrado un alto dominio de los conceptos del módulo.'
              : 'Buen intento. Te recomendamos repasar los conceptos en la sección de Teoría e intentarlo de nuevo.'}
          </p>
        </div>
      )}

    </div>
  );
};

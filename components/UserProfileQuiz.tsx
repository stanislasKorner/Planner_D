import React, { useState } from 'react';
import { QUIZ_DATA } from '../constants';
import { QuizAnswers } from '../types';
import { ArrowRight, AlertCircle } from 'lucide-react';

interface Props {
  onSubmit: (answers: QuizAnswers) => void;
}

export const UserProfileQuiz: React.FC<Props> = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [showShame, setShowShame] = useState(false);

  const currentQuestion = QUIZ_DATA[currentStep];

  const handleOptionSelect = (optionId: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: optionId };
    setAnswers(newAnswers);

    if (currentStep < QUIZ_DATA.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 300);
    } else {
      onSubmit(newAnswers as QuizAnswers);
    }
  };

  const handleSkip = () => {
      if (!showShame) {
          setShowShame(true);
      } else {
          onSubmit({
              attractionType: 'unknown',
              adrenalineLevel: 'chill',
              avoidance: 'none'
          });
      }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative">
        
        {/* Header / Progress */}
        <div className="bg-slate-50 p-6 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">Profil Disney</span>
            <span className="text-xs font-medium text-slate-400">{currentStep + 1} / {QUIZ_DATA.length}</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / QUIZ_DATA.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-black text-slate-900 mb-6 leading-tight">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map(option => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                className="w-full text-left p-4 rounded-xl border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50/50 transition-all group flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-800 group-hover:text-indigo-900">{option.label}</div>
                  {option.desc && (
                    <div className="text-xs text-slate-500 mt-1 group-hover:text-indigo-600/80">{option.desc}</div>
                  )}
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:border-indigo-600 transition-colors">
                    <ArrowRight size={14} className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
          </div>

          {/* Skip Button */}
          <div className="mt-8 pt-4 border-t border-slate-100 text-center">
              {!showShame ? (
                  <button 
                    onClick={handleSkip}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 underline transition-colors"
                  >
                      Passer (Je suis ennuyeux)
                  </button>
              ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="flex items-center justify-center gap-2 text-amber-600 font-bold text-sm mb-2">
                          <AlertCircle size={16} />
                          <span>Vraiment ? C'est triste...</span>
                      </div>
                      <button 
                        onClick={handleSkip}
                        className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-200 transition-colors"
                      >
                          Oui, je confirme mon absence de fun
                      </button>
                  </div>
              )}
          </div>
        </div>

      </div>
    </div>
  );
};

import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { eduTranslations } from '../i18n';
import { FileQuestion, History, Award, ChevronRight } from 'lucide-react';

const Quizzes: React.FC = () => {
  const { language } = useApp();
  const t = eduTranslations[language].dashboard;

  return (
    <div className="space-y-6">
      <div className="p-6 bg-blue-600 rounded-3xl text-white shadow-lg text-center">
        <FileQuestion size={40} className="mx-auto mb-4 opacity-80" />
        <h3 className="text-xl font-extrabold mb-2">Knowledge Check</h3>
        <p className="text-xs opacity-90 mb-6 px-4">Test your skills in JavaScript, Design, or Marketing. AI-powered customized quizzes.</p>
        <button className="w-full py-4 bg-white text-blue-600 rounded-2xl font-bold text-sm">
          {t.startQuiz}
        </button>
      </div>

      <div>
        <h3 className="font-bold text-sm mb-3 px-1 flex items-center gap-2">
          <History size={16} className="text-blue-600" /> History
        </h3>
        <div className="space-y-3">
          {[
            { title: "React Hooks Advanced", score: 92, date: "May 20, 2024" },
            { title: "Graphic Design Basics", score: 100, date: "May 18, 2024" },
            { title: "Marketing Funnels", score: 75, date: "May 15, 2024" },
          ].map((quiz, idx) => (
            <div key={idx} className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${quiz.score >= 90 ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'} dark:bg-slate-900`}>
                  <Award size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold">{quiz.title}</p>
                  <p className="text-[10px] text-gray-500">{quiz.date}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-sm font-extrabold ${quiz.score >= 90 ? 'text-emerald-500' : quiz.score >= 70 ? 'text-blue-500' : 'text-rose-500'}`}>
                  {quiz.score}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quizzes;
